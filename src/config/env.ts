import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  meta: {
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    configId: process.env.META_CONFIG_ID || '',
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'mon_token_verification',
  },
  fedapay: {
    publicKey: process.env.FEDAPAY_PUBLIC_KEY || '',
    secretKey: process.env.FEDAPAY_SECRET_KEY || '',
    webhookSecret: process.env.FEDAPAY_WEBHOOK_SECRET || '',
    environment: process.env.FEDAPAY_ENVIRONMENT || 'sandbox',
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean),
};

// Vérification de sécurité au démarrage pour l'environnement de production
export function validateEnvironmentSecurity(): void {
  if (!isProduction) return;

  const requiredInProd = [
    { key: 'SUPABASE_URL', val: config.supabaseUrl },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', val: config.supabaseServiceKey },
    { key: 'META_APP_SECRET', val: config.meta.appSecret },
    { key: 'WHATSAPP_TOKEN', val: config.whatsapp.token },
    { key: 'WHATSAPP_PHONE_NUMBER_ID', val: config.whatsapp.phoneNumberId },
    { key: 'FEDAPAY_SECRET_KEY', val: config.fedapay.secretKey },
  ];

  const missing = requiredInProd.filter(item => !item.val).map(item => item.key);

  if (missing.length > 0) {
    console.error(`🚨 [SÉCURITÉ PROD] Variables d'environnement critiques manquantes: ${missing.join(', ')}`);
  }
}

