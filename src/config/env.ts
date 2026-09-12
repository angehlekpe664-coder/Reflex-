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
    token: 'EAAapZBe5QZBMgBSV0n5gzB6TnhxJa2Szqn1Q0UZBLkAH1cz7J2qgKNRupD6dG3rH4ZBZCtPZCQlyQkgRiJ2wGglCRMIVD3RWatxwdMu9yAL5BJ7rSTvaec70fXZBZCq6hrI7zNH5kjFFJptOIQwnlEXVb1ZCyHWN0tHuifnxRtOv7gvmNuw6ug6r4hfZB6euZA82FtjkGgGhZC7AkeN1GkipQ0mXu5rshPGbUITZBdWWCsPMaoW8A9UD8v3dqKYL7IaTdYRlZBgzuIZBH8nY4p9i7cys0FJXTbL',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '1297674883427187',
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
