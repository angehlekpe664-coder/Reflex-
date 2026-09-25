import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Vérifie la signature HMAC SHA-256 envoyée par Meta pour les webhooks WhatsApp.
 * En production, une signature absente ou invalide est rejetée.
 */
export function verifyMetaWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signatureHeader = req.headers['x-hub-signature-256'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const appSecret = config.meta.appSecret;
  const rawBody = (req as Request & { rawBody?: string }).rawBody;

  if (!appSecret) {
    if (config.nodeEnv === 'production') {
      console.error('❌ META_APP_SECRET est manquant en production. Webhook rejeté.');
      return res.status(500).json({ error: 'Webhook Meta mal configuré' });
    }

    console.warn('⚠️ META_APP_SECRET absent : signature ignorée en environnement non-production.');
    return next();
  }

  if (!signature || !rawBody) {
    console.warn('⚠️ Signature Meta ou corps brut absent.');
    return res.sendStatus(401);
  }

  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex')}`;

  const received = Buffer.from(signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');

  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    console.warn('⚠️ Signature Meta Webhook invalide.');
    return res.sendStatus(401);
  }

  return next();
}

/**
 * Vérification minimale des webhooks de paiement.
 * Les signatures spécifiques doivent être validées par chaque fournisseur
 * dès que leur format officiel est configuré.
 */
export function verifyPaymentWebhookSignature(_req: Request, _res: Response, next: NextFunction) {
  return next();
}
