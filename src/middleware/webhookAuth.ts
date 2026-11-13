import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Middleware pour valider la signature HMAC SHA256 des Webhooks Meta WhatsApp
 */
export function verifyMetaWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-hub-signature-256'] as string;
  const appSecret = config.meta.appSecret;

  // Si aucun appSecret n'est configuré en production, bloquer
  if (!appSecret) {
    if (config.isProduction) {
      console.error('🚨 [Sécurité] META_APP_SECRET non configuré sur le serveur.');
      return res.status(500).json({ error: 'Configuration serveur incomplète pour les webhooks Meta' });
    }
    console.warn('💡 [Dév] META_APP_SECRET manquant. Message accepté en mode local.');
    return next();
  }

  // Si l'en-tête de signature est absent
  if (!signature) {
    if (config.isProduction) {
      console.warn('🚫 [Sécurité] Requête Meta Webhook rejetée : en-tête x-hub-signature-256 manquant.');
      return res.status(401).json({ error: 'En-tête x-hub-signature-256 manquant' });
    }
    console.warn('💡 [Dév] En-tête de signature manquant. Message accepté en mode local.');
    return next();
  }

  try {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    // Comparaison temporelle sécurisée anti-timing attack
    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return next();
    }

    if (config.isProduction) {
      console.warn('🚫 [Sécurité] Requête Meta Webhook rejetée : Signature HMAC invalide.');
      return res.status(403).json({ error: 'Signature Meta Webhook invalide' });
    }

    console.warn('⚠️ [Dév] Signature Meta non concordante, acceptée pour test local.');
    return next();
  } catch (err) {
    console.error('Erreur validation signature Meta:', err);
    if (config.isProduction) {
      return res.status(403).json({ error: 'Erreur lors de la validation de signature' });
    }
    return next();
  }
}

/**
 * Middleware pour valider la signature des Webhooks de Paiement (FedaPay)
 */
export function verifyPaymentWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const fedapaySig = req.headers['x-fedapay-signature'] as string;
  const webhookSecret = config.fedapay.webhookSecret;

  // En local / sandbox sans secret configuré, laisser passer avec trace
  if (!config.isProduction && !webhookSecret) {
    console.log('💡 [Dév] Webhook FedaPay reçu sans signature stricte en environnement de test.');
    return next();
  }

  // En production avec webhookSecret configuré, exiger et vérifier la signature
  if (webhookSecret) {
    if (!fedapaySig) {
      if (config.isProduction) {
        console.warn('🚫 [Sécurité] Requête Webhook FedaPay rejetée : en-tête x-fedapay-signature manquant.');
        return res.status(401).json({ error: 'Signature FedaPay manquante' });
      }
      return next();
    }

    try {
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const sigBuffer = Buffer.from(fedapaySig);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return next();
      }

      if (config.isProduction) {
        console.warn('🚫 [Sécurité] Webhook FedaPay rejeté : signature invalide.');
        return res.status(403).json({ error: 'Signature FedaPay invalide' });
      }
    } catch (err) {
      console.error('Erreur validation signature FedaPay:', err);
      if (config.isProduction) {
        return res.status(403).json({ error: 'Échec de vérification FedaPay' });
      }
    }
  }

  return next();
}

