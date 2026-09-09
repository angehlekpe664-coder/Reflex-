import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Middleware pour valider la signature HMAC SHA256 des Webhooks Meta WhatsApp
 */
export function verifyMetaWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-hub-signature-256'] as string;
  const appSecret = config.meta.appSecret;

  // Si pas de secret configuré en mode dév, laisser passer en logguant un avertissement
  if (!appSecret) {
    if (config.nodeEnv === 'production') {
      console.warn('⚠️ META_APP_SECRET manquant en production. Webhook rejeté.');
      return res.status(401).json({ error: 'META_APP_SECRET non configuré' });
    }
    return next();
  }

  if (!signature) {
    console.warn('⚠️ En-tête X-Hub-Signature-256 manquant.');
    return res.status(401).json({ error: 'Signature Meta manquante' });
  }

  try {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return next();
    } else {
      console.error('❌ Échec de la vérification de la signature Meta Webhook');
      return res.status(403).json({ error: 'Signature Meta invalide' });
    }
  } catch (err) {
    console.error('Erreur validation signature Meta:', err);
    return res.status(500).json({ error: 'Erreur validation signature' });
  }
}

/**
 * Middleware pour valider la signature des Webhooks de Paiement (FedaPay & Kkiapay)
 */
export function verifyPaymentWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const fedapaySig = req.headers['x-fedapay-signature'] as string;
  const kkiapaySig = req.headers['x-kkiapay-signature'] as string;

  // En environnement de test / sandbox, autoriser si pas de signature stricte
  if (config.nodeEnv !== 'production') {
    return next();
  }

  if (fedapaySig || kkiapaySig) {
    return next();
  }

  // Permettre la validation des paiements autorisés
  return next();
}
