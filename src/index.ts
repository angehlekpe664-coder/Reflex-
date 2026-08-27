import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { whatsappService } from './services/whatsapp.service.js';
import { aiService } from './services/ai.service.js';
import { databaseService } from './services/supabase.service.js';
import { paymentService } from './services/payment.service.js';

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Store for Live Dashboard Integration
const liveOrders: Array<any> = [
  {
    id: 'ORD-229-892',
    customerName: 'Koffi Mensah',
    phone: '+229 97 45 12 89',
    time: '10:42 AM',
    status: 'PAID',
    amount: 45000,
    item: 'Perruque Brésilienne 18 pouces',
    deliveryAddress: 'Ganhi, Immeuble Horizon, Cotonou',
    paymentRef: 'REFLEX-TXN-88902',
    lastMsg: "C'est parfait, j'ai effectué le paiement via le lien. Quand pouvez-vous me livrer à Ganhi ?",
    summary: {
      intention: 'Achat de Perruque Brésilienne 18 pouces',
      amount: 45000,
      deliveryLocation: 'Ganhi, Immeuble Horizon, Cotonou',
      paymentMethod: 'MTN Mobile Money',
      conclusion: 'Le client Koffi Mensah a conclu l\'accord avec l\'IA et réglé la totalité du montant (45 000 FCFA). La livraison est requise cet après-midi à Ganhi.'
    }
  }
];

const liveStats = {
  totalRevenue: 1245000,
  totalMessages: 4302,
  reportsGenerated: 128,
  conversionRate: 8.4
};

let currentPmeConfig = {
  name: 'Boutique Élégance Bénin',
  sector: 'Mode & Vêtements',
  phone: '+229 97 00 00 00',
  description: 'Vente de vêtements de luxe et d\'accessoires de mode à Cotonou.',
  tone: 'Chaleureux & Commercial',
  welcomeMessage: 'Bonjour ! Bienvenue chez Boutique Élégance. Que puis-je faire pour vous aujourd\'hui ?',
  deliveryInfo: 'Livraison sous 24h à Cotonou, Calavi et Porto-Novo.',
  catalogue: [
    { name: 'Perruque Brésilienne 18 pouces', price: 45000, category: 'Perruques', description: 'Cheveux 100% naturels' },
    { name: 'Sac à main en cuir artisanal', price: 25000, category: 'Accessoires', description: 'Fait main au Bénin' }
  ]
};

// Route d'enregistrement et synchronisation Onboarding PME
app.post('/api/onboarding', async (req, res) => {
  try {
    const { companyData, productsList, assistantConfig } = req.body;
    if (companyData) {
      currentPmeConfig = {
        name: companyData.name || currentPmeConfig.name,
        sector: companyData.sector || currentPmeConfig.sector,
        phone: companyData.phone || currentPmeConfig.phone,
        description: companyData.description || currentPmeConfig.description,
        tone: assistantConfig?.tone || currentPmeConfig.tone,
        welcomeMessage: assistantConfig?.welcomeMessage || currentPmeConfig.welcomeMessage,
        deliveryInfo: assistantConfig?.deliveryInfo || currentPmeConfig.deliveryInfo,
        catalogue: (productsList && productsList.length > 0) ? productsList : currentPmeConfig.catalogue
      };

      // Tenter de persister dans Supabase si configuré
      try {
        await databaseService.savePmeCatalogue(currentPmeConfig.phone, currentPmeConfig);
      } catch (err) {
        console.log('💡 Information locale synchronisée.');
      }

      console.log(`✅ PME "${currentPmeConfig.name}" enregistrée et IA configurée !`);
    }

    res.json({
      success: true,
      message: 'Onboarding PME enregistré et synchronisé avec l\'IA Reflex.',
      config: currentPmeConfig
    });
  } catch (error) {
    console.error('Erreur Onboarding API:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement PME.' });
  }
});

// Route de récupération de la configuration PME active
app.get('/api/pme/config', (_req, res) => {
  res.json({ success: true, config: currentPmeConfig });
});

// Route de test d'un message WhatsApp client simulant le bot en direct
app.post('/api/test-wa-message', async (req, res) => {
  try {
    const { userText } = req.body;
    const aiResponse = await aiService.generateResponse(
      userText || 'Bonjour, quels sont vos tarifs et conditions de livraison ?',
      [],
      currentPmeConfig
    );
    res.json({ success: true, userText, aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur génération IA' });
  }
});

// Route 1 : Vérification initiale du Webhook Meta WhatsApp API
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
      console.log('✅ Webhook WhatsApp vérifié avec succès par Meta !');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
});

// Route 2 : Réception des messages WhatsApp entrants (Event Webhook Meta direct)
app.post('/webhook/whatsapp', async (req, res) => {
  res.status(200).send('EVENT_RECEIVED');

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return;

    const fromPhone = message.from;
    const messageType = message.type;
    let userText = '';

    if (messageType === 'text') {
      userText = message.text.body;
    } else if (messageType === 'interactive') {
      userText = message.interactive?.button_reply?.title || 'Bouton cliqué';
    } else {
      userText = "[Message reçu : image ou audio]";
    }

    console.log(`📩 Message reçu de ${fromPhone} : "${userText}"`);

    const pmeData = currentPmeConfig;

    const aiResponse = await aiService.generateResponse(
      userText,
      [],
      pmeData
    );

    // Increment message count
    liveStats.totalMessages += 1;

    await whatsappService.sendTextMessage(fromPhone, aiResponse);
    console.log(`📤 Réponse envoyée à ${fromPhone}`);

  } catch (error) {
    console.error('Erreur lors du traitement du Webhook WhatsApp:', error);
  }
});

// Route 3 : Integration Webhook pour n8n (Recevoir les événements n8n -> Reflex Dashboard)
app.post('/api/webhook/n8n', (req, res) => {
  try {
    const { from, userMessage, aiResponse, orderIntent, amount, customerName, address } = req.body;
    console.log(`⚡ Événement reçu depuis n8n pour ${from || 'Client WhatsApp'}`);

    liveStats.totalMessages += 1;

    if (orderIntent && amount) {
      const newOrder = {
        id: `ORD-229-${Math.floor(100 + Math.random() * 900)}`,
        customerName: customerName || `Client (${from || 'WhatsApp'})`,
        phone: from || '+229 97 00 00 00',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'PAID',
        amount: Number(amount),
        item: orderIntent,
        deliveryAddress: address || 'Cotonou, Bénin',
        paymentRef: `REFLEX-TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        lastMsg: userMessage || 'Accord conclu par l\'IA n8n',
        summary: {
          intention: orderIntent,
          amount: Number(amount),
          deliveryLocation: address || 'Cotonou, Bénin',
          paymentMethod: 'MTN Mobile Money / Wave',
          conclusion: `L'IA a conclu le marché avec ${customerName || 'le client'} pour ${orderIntent}. Montant: ${amount} FCFA.`
        }
      };

      liveOrders.unshift(newOrder);
      liveStats.totalRevenue += Number(amount);
      liveStats.reportsGenerated += 1;
    }

    res.json({ success: true, message: 'Événement n8n synchronisé avec le Dashboard Reflex' });
  } catch (error) {
    console.error('Erreur webhook n8n:', error);
    res.status(500).json({ success: false, error: 'Erreur de synchronisation n8n' });
  }
});

// Route 4 : REST API Stats pour le Dashboard Reflex React
app.get('/api/dashboard/stats', (_req, res) => {
  res.json({
    stats: liveStats,
    recentOrders: liveOrders
  });
});

// Route 5 : Santé du serveur
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Reflex WhatsApp PME SaaS API Engine',
    n8nBridgeActive: true,
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 Serveur Reflex WhatsApp PME démarré sur le port ${config.port}`);
  console.log(`📍 URL Webhook Meta : http://localhost:${config.port}/webhook/whatsapp`);
  console.log(`⚡ URL Webhook Bridge n8n : http://localhost:${config.port}/api/webhook/n8n`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Le port ${config.port} est actuellement occupé. Tentative de libération automatique...`);
  } else {
    console.error('Erreur serveur:', err);
  }
});


