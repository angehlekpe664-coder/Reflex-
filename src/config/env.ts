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
    appSecret: process.env.META_APP_SECRET || 'a4f8e7b3b607c0f3d79025cfaad7b4c6',
    configId: process.env.META_CONFIG_ID || '',
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || 'EAAapZBe5QZBMgBSuXZA1NcoV4k3CnvSzAB9K1ZCycXr3X2ZBDmjUXmELb9WGgo4j9MAqOzMuY70uZAI3woL5DRd8YNScMZBjYXXHNXRmWCJGLwqFOVk3MZCddYZCeyylfCpup3T2jfs58ZA20zcLL1BY5p6rMhshRNFHdxBrVeLrJoUBEStBVyOQZCO4jMtIXZAf7nrVZCqXzM4flAGzzcy7DC3xdvrMhdfSvMMy2s2y8znTxxePZAd2bduCcYVv8QWfippqjtsjPSZCWMukz6wL9KhJOrDaJiUowZDZD',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '1297674883427187',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'mon_token_verification',
  },
  fedapay: {
    publicKey: process.env.FEDAPAY_PUBLIC_KEY || 'pk_live_JVbKBkCuJMTpnwgwiKi09Hom',
    secretKey: process.env.FEDAPAY_SECRET_KEY || 'sk_live_jQV5A57A9GMJ_mzbK1YtoR3E',
    environment: process.env.FEDAPAY_ENVIRONMENT || 'live',
  },
};
