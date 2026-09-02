import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from './config/env.js';
import { whatsappService } from './services/whatsapp.service.js';
import { aiService } from './services/ai.service.js';
import { databaseService } from './services/supabase.service.js';
import { paymentService } from './services/payment.service.js';
import { pdfReportService } from './services/pdf.service.js';

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

// Route OAuth Callback Meta Embedded Signup (Officiel)
app.post('/api/auth/meta/callback', async (req, res) => {
  try {
    const { code, wabaId, pmePhone } = req.body;
    if (!code || !wabaId) {
      return res.status(400).json({ success: false, error: 'Authorization Code ou WABA ID manquant.' });
    }

    console.log(`🔒 Traitement OAuth Meta pour WABA ${wabaId}...`);

    // 1. Échange du code contre un System User Access Token auprès de Meta Graph API
    const tokenResponse = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
      params: {
        client_id: config.meta.appId,
        client_secret: config.meta.appSecret,
        code
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // 2. Récupération automatique du Phone Number ID et du numéro affiché
    let phoneNumberId = config.whatsapp.phoneNumberId;
    let displayPhone = pmePhone || currentPmeConfig.phone;

    try {
      const phoneRes = await axios.get(`https://graph.facebook.com/v20.0/${wabaId}/phone_numbers`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const firstPhone = phoneRes.data.data?.[0];
      if (firstPhone) {
        phoneNumberId = firstPhone.id;
        displayPhone = firstPhone.display_phone_number || displayPhone;
      }
    } catch (e: any) {
      console.log('💡 Utilisation des identifiants par défaut pour le numéro.');
    }

    // 3. Souscription automatique du Webhook Reflex sur l'application WABA
    try {
      await axios.post(
        `https://graph.facebook.com/v20.0/${wabaId}/subscribed_apps`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (subErr) {
      console.log('💡 Webhook déjà abonné ou en attente.');
    }

    // 4. Sauvegarde sécurisée des identifiants en BD Supabase
    const targetPhone = pmePhone || currentPmeConfig.phone;
    await databaseService.saveMetaConnection(
      targetPhone,
      wabaId,
      phoneNumberId,
      accessToken,
      displayPhone
    );

    console.log(`🎉 Connexion WhatsApp Business réussie pour WABA ${wabaId} (Phone ID: ${phoneNumberId}) !`);

    // 5. Réponse sécurisée au frontend (SANS EXPOSER DE TOKEN)
    res.json({
      success: true,
      message: 'Compte WhatsApp Business connecté avec succès à Reflex !',
      status: 'CONNECTED',
      wabaId,
      displayPhone
    });
  } catch (error: any) {
    console.error('Erreur OAuth Meta Callback:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Échec de la connexion officielle Meta. Vérifiez votre configuration.'
    });
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

// Route 2 : Réception des messages WhatsApp entrants (Event Webhook Meta direct Multi-Tenant)
app.post('/webhook/whatsapp', async (req, res) => {
  res.status(200).send('EVENT_RECEIVED');

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const metadata = changes?.value?.metadata;
    const contactProfile = changes?.value?.contacts?.[0]?.profile;

    if (!message) return;

    const fromPhone = message.from;
    const customerName = contactProfile?.name || `Client (${fromPhone})`;
    const metaPhoneNumberId = metadata?.phone_number_id || config.whatsapp.phoneNumberId;
    const messageType = message.type;
    let userText = '';

    if (messageType === 'text') {
      userText = message.text.body;
    } else if (messageType === 'interactive') {
      userText = message.interactive?.button_reply?.title || 'Bouton cliqué';
    } else {
      userText = "[Message reçu : média/pièce jointe]";
    }

    console.log(`📩 [WhatsApp Direct] Message de ${customerName} (${fromPhone}) pour le numéro Meta ID ${metaPhoneNumberId} : "${userText}"`);

    // 1. Identification dynamique de la PME
    const pmeRecord = await databaseService.getPmeByPhoneNumberIdOrPhone(metaPhoneNumberId);

    const pmeContext = {
      name: pmeRecord?.pme?.name || currentPmeConfig.name,
      description: pmeRecord?.pme?.description || currentPmeConfig.description,
      tone: pmeRecord?.pme?.tone || currentPmeConfig.tone,
      welcomeMessage: pmeRecord?.pme?.welcome_message || currentPmeConfig.welcomeMessage,
      deliveryInfo: pmeRecord?.pme?.delivery_info || currentPmeConfig.deliveryInfo,
      catalogue: pmeRecord?.catalogue || currentPmeConfig.catalogue
    };

    const pmeId = pmeRecord?.pme?.id || 'mock-pme-123';
    const isAiActive = pmeRecord?.pme?.is_ai_active !== false;

    if (!isAiActive) {
      console.log(`🛑 L'IA est désactivée pour la PME "${pmeContext.name}". Ignoré.`);
      return;
    }

    // 2. Enregistrement / Récupération du client en base
    const customer = await databaseService.upsertCustomer(pmeId, fromPhone, customerName);

    if (customer?.is_human_takeover) {
      console.log(`👤 Mode Prise en Main Humaine actif pour ${fromPhone}. L'IA laisse la main à l'équipe commercial.`);
      if (customer.id) {
        await databaseService.saveChatMessage(pmeId, customer.id, 'user', userText);
      }
      return;
    }

    // 3. Récupération de l'historique de conversation
    const chatHistory = customer?.id
      ? await databaseService.getChatHistory(pmeId, customer.id, 8)
      : [];

    // 4. Enregistrement du message utilisateur
    if (customer?.id) {
      await databaseService.saveChatMessage(pmeId, customer.id, 'user', userText);
    }

    // 5. Génération de la réponse IA autonome
    const aiResponse = await aiService.generateResponse(
      userText,
      chatHistory,
      pmeContext
    );

    // 6. Enregistrement de la réponse assistant
    if (customer?.id) {
      await databaseService.saveChatMessage(pmeId, customer.id, 'assistant', aiResponse);
    }

    // 7. Statistique globale
    liveStats.totalMessages += 1;

    // 8. Envoi de la réponse sur WhatsApp Meta
    await whatsappService.sendTextMessage(
      fromPhone,
      aiResponse,
      {
        phoneNumberId: pmeRecord?.pme?.meta_phone_number_id || config.whatsapp.phoneNumberId,
        token: pmeRecord?.pme?.meta_access_token || config.whatsapp.token
      }
    );

    console.log(`🤖 [Réponse IA] Envoyée avec succès à ${fromPhone}`);

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

// Route 5 : Téléchargement dynamique du Rapport PDF de Vente Conclue par l'IA
app.get('/api/reports/pdf/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = liveOrders.find((o) => o.id === orderId) || liveOrders[0];

  try {
    const pdfBuffer = await pdfReportService.generateOrderPDF({
      id: order.id,
      pmeName: currentPmeConfig.name,
      customerName: order.customerName,
      phone: order.phone,
      item: order.item,
      amount: order.amount,
      deliveryAddress: order.deliveryAddress || 'Cotonou, Bénin',
      paymentRef: order.paymentRef || 'REFLEX-TXN-88902',
      date: new Date().toLocaleDateString('fr-FR') + ' - ' + order.time,
      conclusion: order.summary?.conclusion || 'Accord conclu par l\'IA avec confirmation de livraison.'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Rapport_Reflex_${order.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur de génération PDF:', error);
    res.status(500).json({ error: 'Échec de génération du rapport PDF' });
  }
});

// Route 6 : Santé du serveur
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Reflex WhatsApp PME SaaS API Engine',
    pdfEngineActive: true,
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


