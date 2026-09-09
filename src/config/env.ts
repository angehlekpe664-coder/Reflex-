import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  meta: {
    appId: process.env.META_APP_ID || '1875740770498760',
    appSecret: process.env.META_APP_SECRET || '',
    configId: process.env.META_CONFIG_ID || '',
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'mon_token_verification',
  },
  fedapay: {
    publicKey: process.env.FEDAPAY_PUBLIC_KEY || 'pk_live_JVbKBkCuJMTpnwgwiKi09Hom',
    secretKey: process.env.FEDAPAY_SECRET_KEY || 'sk_live_jQV5A57A9GMJ_mzbK1YtoR3E',
    environment: process.env.FEDAPAY_ENVIRONMENT || 'live',
  },
  kkiapay: {
    publicKey: process.env.KKIAPAY_PUBLIC_KEY || '0efb5b708b2911f1a8dd67bbdaba00dc',
    privateKey: process.env.KKIAPAY_PRIVATE_KEY || 'tpk_0efb82818b2911f1a8dd67bbdaba00dc',
    secretKey: process.env.KKIAPAY_SECRET_KEY || 'tsk_0efb82828b2911f1a8dd67bbdaba00dc',
    environment: process.env.KKIAPAY_ENVIRONMENT || 'sandbox',
  },
};
