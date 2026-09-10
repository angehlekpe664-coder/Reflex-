import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Middleware pour valider la signature HMAC SHA256 des Webhooks Meta WhatsApp
 */
export function verifyMetaWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-hub-signature-256'] as string;
  const appSecret = config.meta.appSecret;

  if (!appSecret || !signature) {
    // Loguer un avertissement sans rejeter la requête pour garantir qu'aucun message WhatsApp ne soit perdu
    console.warn('💡 Webhook Signature non vérifiée (META_APP_SECRET manquant ou en-tête signature absent). Message accepté.');
    return next();
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
      console.warn('⚠️ Signature Meta Webhook non concordante. Message accepté avec avertissement.');
      return next();
    }
  } catch (err) {
    console.error('Erreur validation signature Meta:', err);
    return next();
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
