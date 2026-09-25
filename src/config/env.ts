import dotenv from 'dotenv';

dotenv.config();

const env = (name: string): string => process.env[name]?.trim() || '';

export const config = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: env('NODE_ENV') || 'development',
  openaiApiKey: env('OPENAI_API_KEY'),
  supabaseUrl: env('SUPABASE_URL'),
  supabaseServiceKey: env('SUPABASE_SERVICE_ROLE_KEY'),
  meta: {
    appId: env('META_APP_ID'),
    appSecret: env('META_APP_SECRET'),
    configId: env('META_CONFIG_ID'),
  },
  whatsapp: {
    token: env('WHATSAPP_TOKEN'),
    phoneNumberId: env('WHATSAPP_PHONE_NUMBER_ID'),
    verifyToken: env('WHATSAPP_VERIFY_TOKEN'),
  },
  fedapay: {
    publicKey: env('FEDAPAY_PUBLIC_KEY'),
    secretKey: env('FEDAPAY_SECRET_KEY'),
    environment: env('FEDAPAY_ENVIRONMENT') || 'sandbox',
  },
  kkiapay: {
    publicKey: env('KKIAPAY_PUBLIC_KEY'),
    privateKey: env('KKIAPAY_PRIVATE_KEY'),
    secretKey: env('KKIAPAY_SECRET_KEY'),
    environment: env('KKIAPAY_ENVIRONMENT') || 'sandbox',
  },
};
