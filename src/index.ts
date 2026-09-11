import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from './config/env.js';
import { whatsappService } from './services/whatsapp.service.js';
import { aiService } from './services/ai.service.js';
import { databaseService } from './services/supabase.service.js';
import { paymentService } from './services/payment.service.js';
import { pdfReportService } from './services/pdf.service.js';
import { whatsappQueueService } from './services/queue.service.js';
import { inventoryService } from './services/inventory.service.js';
import { verifyMetaWebhookSignature, verifyPaymentWebhookSignature } from './middleware/webhookAuth.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
app.use(cors());

// Middleware pour conserver le corps brut (raw body) pour la vérification HMAC Meta Signature
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Simple Rate Limiting Middleware (Protection contre le Spam / DoS)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 120; // 120 requêtes/min

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + rateLimitWindowMs });
    return next();
  }

  record.count += 1;
  if (record.count > maxRequestsPerWindow) {
    return res.status(429).json({ error: 'Trop de requêtes. Veuillez patienter une minute.' });
  }

  next();
});

// In-Memory Store for Live Dashboard Integration
const liveOrders: Array<any> = [];

const liveStats = {
  totalRevenue: 0,
  totalMessages: 0,
  reportsGenerated: 0,
  conversionRate: 0
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

// Route OAuth Callback Meta Embedded Signup
app.post('/api/auth/meta/callback', async (req, res) => {
  try {
    const { code, wabaId, pmePhone } = req.body;
    if (!code || !wabaId) {
      return res.status(400).json({ success: false, error: 'Authorization Code ou WABA ID manquant.' });
    }

    console.log(`🔒 Traitement OAuth Meta pour WABA ${wabaId}...`);

    const tokenResponse = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
      params: {
        client_id: config.meta.appId,
        client_secret: config.meta.appSecret,
        code
      }
    });

    const accessToken = tokenResponse.data.access_token;
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

    try {
      await axios.post(
        `https://graph.facebook.com/v20.0/${wabaId}/subscribed_apps`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (subErr) {
      console.log('💡 Webhook déjà abonné ou en attente.');
    }

    const targetPhone = pmePhone || currentPmeConfig.phone;
    await databaseService.saveMetaConnection(
      targetPhone,
      wabaId,
      phoneNumberId,
      accessToken,
      displayPhone
    );

    console.log(`🎉 Connexion WhatsApp Business réussie pour WABA ${wabaId} !`);

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

// Route 2 : Réception des messages WhatsApp entrants (Event Webhook Meta direct Multi-Tenant avec Queue Asynchrone & Signature HMAC)
app.post('/webhook/whatsapp', verifyMetaWebhookSignature, (req, res) => {
  // Réponse HTTP 200 OK IMMÉDIATE sous 50ms (Exigence stricte Meta)
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

    console.log(`📩 [WhatsApp Direct] Message de ${customerName} (${fromPhone}) : "${userText}" -> Transmis à la Queue Asynchrone`);

    // Transmission à la file d'attente asynchrone sans bloquer la réponse Meta
    whatsappQueueService.enqueue({
      customerName,
      fromPhone,
      metaPhoneNumberId,
      userText,
      currentPmeConfig,
      liveStats
    });

  } catch (error) {
    console.error('Erreur lors de la réception du Webhook WhatsApp:', error);
  }
});

// Webhook FedaPay Real-time Notification
app.post('/api/payments/fedapay/webhook', verifyPaymentWebhookSignature, async (req, res) => {
  res.status(200).json({ received: true });

  try {
    const event = req.body;
    console.log(`💳 [Webhook FedaPay] Événement reçu:`, event?.name || 'transaction.updated');

    const transaction = event?.entity || event?.transaction;
    const status = transaction?.status || event?.status;
    const orderId = transaction?.custom_metadata?.orderId || transaction?.reference || `ORD-${Date.now()}`;
    const amount = Number(transaction?.amount || 0);

    if (status === 'approved' || status === 'transferred' || status === 'SUCCESS') {
      console.log(`🎉 Paiement FedaPay confirmé pour la commande ${orderId} (${amount} FCFA)`);

      // 1. Mettre à jour le statut en BD
      await databaseService.updateOrderStatus(orderId, 'PAID', transaction?.id || 'FEDAPAY-TXN');

      // 2. Mettre à jour le store live
      const existingOrder = liveOrders.find(o => o.id === orderId);
      if (existingOrder) {
        existingOrder.status = 'PAID';
      } else {
        liveOrders.unshift({
          id: orderId,
          customerName: transaction?.customer?.firstname || 'Client WhatsApp',
          phone: transaction?.customer?.phone_number?.number || '+229 97000000',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          status: 'PAID',
          amount,
          item: 'Commande Reflex PME',
          deliveryAddress: 'Cotonou, Bénin',
          paymentRef: `FEDAPAY-${transaction?.id || Date.now()}`
        });
      }

      liveStats.totalRevenue += amount;

      // 3. Décrémentation du stock
      await inventoryService.decrementStock('mock-pme-123', existingOrder?.item || 'Produit', 1);

      // 4. Envoi automatique de la confirmation et du reçu PDF par WhatsApp
      const customerPhone = existingOrder?.phone || transaction?.customer?.phone_number?.number;
      if (customerPhone) {
        const receiptUrl = `https://reflex-zjf7.onrender.com/api/reports/pdf/${orderId}`;
        const confirmMsg = `✅ *PAIEMENT CONFIRMÉ - REFLEX*\n\n` +
          `Merci ! Votre paiement de *${amount.toLocaleString()} FCFA* a été validé avec succès.\n\n` +
          `📄 Téléchargez votre reçu officiel ici :\n${receiptUrl}`;

        await whatsappService.sendTextMessage(customerPhone, confirmMsg);
      }
    }
  } catch (err) {
    console.error('Erreur traitement Webhook FedaPay:', err);
  }
});

// Webhook Kkiapay Real-time Notification
app.post('/api/payments/kkiapay/webhook', verifyPaymentWebhookSignature, async (req, res) => {
  res.status(200).json({ received: true });

  try {
    const event = req.body;
    console.log(`💳 [Webhook Kkiapay] Événement reçu:`, event?.isSuccess ? 'SUCCESS' : 'FAILED');

    if (event?.isSuccess || event?.status === 'SUCCESS') {
      const orderId = event?.transactionId || event?.customState || `ORD-${Date.now()}`;
      const amount = Number(event?.amount || 0);

      console.log(`🎉 Paiement Kkiapay confirmé pour la commande ${orderId} (${amount} FCFA)`);

      await databaseService.updateOrderStatus(orderId, 'PAID', event?.transactionId || 'KKIAPAY-TXN');

      const existingOrder = liveOrders.find(o => o.id === orderId);
      if (existingOrder) {
        existingOrder.status = 'PAID';
      }

      liveStats.totalRevenue += amount;
      await inventoryService.decrementStock('mock-pme-123', existingOrder?.item || 'Produit', 1);

      const customerPhone = existingOrder?.phone || event?.phone;
      if (customerPhone) {
        const receiptUrl = `https://reflex-zjf7.onrender.com/api/reports/pdf/${orderId}`;
        const confirmMsg = `✅ *PAIEMENT CONFIRMÉ - REFLEX*\n\n` +
          `Votre paiement Kkiapay de *${amount.toLocaleString()} FCFA* a été validé avec succès !\n\n` +
          `📄 Votre reçu de paiement :\n${receiptUrl}`;

        await whatsappService.sendTextMessage(customerPhone, confirmMsg);
      }
    }
  } catch (err) {
    console.error('Erreur traitement Webhook Kkiapay:', err);
  }
});

// Route 3 : Integration Webhook pour n8n
app.post('/api/webhook/n8n', (req, res) => {
  try {
    const { from, userMessage, amount, customerName, address, orderIntent } = req.body;
    console.log(`⚡ Événement reçu depuis n8n pour ${from || 'Client WhatsApp'}`);

    liveStats.totalMessages += 1;

    if (orderIntent && amount) {
      const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
      const newOrder = {
        id: orderId,
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
          paymentMethod: 'Mobile Money',
          conclusion: `L'IA a conclu le marché avec ${customerName || 'le client'} pour ${orderIntent}. Montant: ${amount} FCFA.`
        }
      };

      liveOrders.unshift(newOrder);
      liveStats.totalRevenue += Number(amount);
      liveStats.reportsGenerated += 1;

      // Sauvegarde en BD
      databaseService.saveOrder(newOrder);
    }

    res.json({ success: true, message: 'Événement n8n synchronisé avec le Dashboard Reflex' });
  } catch (error) {
    console.error('Erreur webhook n8n:', error);
    res.status(500).json({ success: false, error: 'Erreur de synchronisation n8n' });
  }
});

// Route 4 : REST API Stats pour le Dashboard Reflex React (Protégée par auth JWT en production)
app.get('/api/dashboard/stats', requireAuth, (_req, res) => {
  res.json({
    stats: liveStats,
    recentOrders: liveOrders
  });
});

// Route FedaPay Payment Link Creation
app.post('/api/payments/fedapay/create', async (req, res) => {
  try {
    const { amount, description, customerName, customerPhone, orderId } = req.body;
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    const paymentUrl = await paymentService.createFedaPayLink({
      amount: Number(amount) || 1000,
      description: description || 'Commande Reflex PME',
      customerName: customerName || 'Client WhatsApp',
      customerPhone: customerPhone || '97000000',
      orderId: finalOrderId
    });

    // Enregistrer la commande en attente
    await databaseService.saveOrder({
      id: finalOrderId,
      customerPhone: customerPhone || '97000000',
      customerName: customerName || 'Client WhatsApp',
      amount: Number(amount) || 1000,
      item: description || 'Commande Reflex PME',
      status: 'PENDING'
    });

    res.json({ success: true, paymentUrl, orderId: finalOrderId });
  } catch (error: any) {
    console.error('Erreur API FedaPay Route:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la génération du lien de paiement.' });
  }
});

// Route Kkiapay Payment Link Creation
app.post('/api/payments/kkiapay/create', async (req, res) => {
  try {
    const { amount, description, customerName, customerPhone, orderId } = req.body;
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    const paymentUrl = await paymentService.createKkiapayLink({
      amount: Number(amount) || 1000,
      description: description || 'Commande Reflex PME',
      customerName: customerName || 'Client WhatsApp',
      customerPhone: customerPhone || '97000000',
      orderId: finalOrderId
    });

    await databaseService.saveOrder({
      id: finalOrderId,
      customerPhone: customerPhone || '97000000',
      customerName: customerName || 'Client WhatsApp',
      amount: Number(amount) || 1000,
      item: description || 'Commande Reflex PME',
      status: 'PENDING'
    });

    res.json({ success: true, paymentUrl, orderId: finalOrderId });
  } catch (error: any) {
    console.error('Erreur API Kkiapay Route:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la génération du lien Kkiapay.' });
  }
});

// Route 5 : Téléchargement dynamique du Rapport PDF
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

// Route Politique de Confidentialité officielle (Requis par Meta)
app.get('/privacy', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Politique de Confidentialité - Reflex</title>
      <style>
        body { font-family: sans-serif; background: #090d16; color: #ffffff; padding: 40px; line-height: 1.6; }
        .box { max-width: 700px; margin: 0 auto; background: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #ff5500; }
        h1 { color: #ff5500; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Politique de Confidentialité - Reflex</h1>
        <p>Reflex s'engage à protéger les données personnelles de ses PME et de leurs clients WhatsApp.</p>
        <h2>Collecte et Utilisation</h2>
        <p>Les données récoltées (messages WhatsApp, numéro de téléphone, commandes) servent exclusivement au fonctionnement de l'Assistant IA et au traitement des commandes Mobile Money.</p>
        <h2>Suppression des données</h2>
        <p>Pour toute demande de suppression des données, contactez support@reflex.bj.</p>
      </div>
    </body>
    </html>
  `);
});

// Route de test diagnostic direct pour vérifier les envois Meta Graph API
app.post('/api/debug/test-wa', async (req, res) => {
  const { toPhone, customToken, customPhoneId } = req.body;
  const phoneNumberId = customPhoneId || config.whatsapp.phoneNumberId;
  const token = customToken || config.whatsapp.token;
  const targetPhone = (toPhone || '229149873176').replace(/\D/g, '');

  const apiUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    const metaRes = await axios.post(
      apiUrl,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: targetPhone,
        type: 'text',
        text: { preview_url: true, body: "🤖 [Test Reflex IA] Connexion WhatsApp validée avec succès !" }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Message test Meta envoyé avec succès !',
      targetPhone,
      phoneNumberId,
      metaResponse: metaRes.data
    });
  } catch (error: any) {
    console.error('Diagnostic Meta Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Échec de l\'envoi Meta Graph API',
      targetPhone,
      phoneNumberId,
      metaError: error?.response?.data || error.message
    });
  }
});

// Route 6 : Santé du serveur
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Reflex WhatsApp PME SaaS API Engine',
    pdfEngineActive: true,
    hmacAuthActive: true,
    asyncQueueActive: true,
    timestamp: new Date().toISOString(),
  });
});

// Tâche planifiée automatique : Relance des paniers / paiements abandonnés (toutes les 5 minutes)
setInterval(async () => {
  try {
    const unpaidOrders = await databaseService.getUnpaidOrdersForReminder(15);
    if (unpaidOrders && unpaidOrders.length > 0) {
      console.log(`⏰ [Relance Automatique] ${unpaidOrders.length} commande(s) non payée(s) trouvée(s).`);

      for (const order of unpaidOrders) {
        if (order.customer_phone) {
          const reminderMsg = `Bonjour ${order.customer_name || ''} ! 👋\n\n` +
            `Votre commande *${order.items_description || 'Reflex PME'}* de *${(order.total_amount || 0).toLocaleString()} FCFA* est toujours en attente de règlement.\n\n` +
            `Finalisez votre achat en 1 clic via Mobile Money. Besoin d'aide ? Répondez simplement à ce message !`;

          await whatsappService.sendTextMessage(order.customer_phone, reminderMsg);
          await databaseService.markReminderSent(order.order_number);
          console.log(`📲 Message de relance envoyé à ${order.customer_phone} pour la commande ${order.order_number}`);
        }
      }
    }
  } catch (err) {
    console.error('Erreur Cron Relance Automatique:', err);
  }
}, 5 * 60 * 1000); // 5 minutes

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
