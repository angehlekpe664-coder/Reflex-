export type LanguageCode = 'FR' | 'EN' | 'FON' | 'WO';

export interface TranslationDict {
  // Navigation & Badges
  activeService: string;
  featuresNav: string;
  demoVideoNav: string;
  faqNav: string;
  login: string;
  startFree: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSub: string;
  ctaStartNow: string;
  ctaWatchDemo: string;
  trustNoCreditCard: string;
  trustSetupTime: string;
  trustSecured: string;

  // Features Section
  featuresTitle: string;
  featuresSub: string;
  featAutoReplyTitle: string;
  featAutoReplyDesc: string;
  featMobileMoneyTitle: string;
  featMobileMoneyDesc: string;
  featCatalogTitle: string;
  featCatalogDesc: string;

  // Simulator Section
  simulatorBadge: string;
  simulatorTitle: string;
  simulatorSub: string;
  simulatorPlaceholder: string;
  simulatorSend: string;

  // Pricing Section
  pricingBadge: string;
  pricingTitle: string;
  pricingSub: string;
  planMonthly: string;
  planYearly: string;
  planStarterTitle: string;
  planStarterPrice: string;
  planProTitle: string;
  planProPrice: string;

  // Receipts & Modal
  receiptTitle: string;
  receiptDownloadBtn: string;
  receiptStatusPaid: string;
  receiptAmount: string;
  receiptPme: string;
  receiptCustomer: string;
  receiptMethod: string;
}

export const translations: Record<LanguageCode, TranslationDict> = {
  FR: {
    activeService: 'Service Actif 24/7',
    featuresNav: 'Fonctionnalités',
    demoVideoNav: 'Démo Vidéo',
    faqNav: 'FAQ',
    login: 'Se connecter',
    startFree: 'Commencer gratuitement',
    heroBadge: "L'IA Commerciale WhatsApp N°1 en Afrique de l'Ouest",
    heroTitle1: 'Automatisez vos ventes WhatsApp & encaissez par',
    heroTitleHighlight: 'Mobile Money 24/7',
    heroSub: 'Reflex répond à vos clients sur WhatsApp en moins de 3 secondes, présente votre catalogue de produits et génère des liens de paiement Mobile Money instantanés.',
    ctaStartNow: 'Essayer Reflex Gratuitement',
    ctaWatchDemo: 'Voir la Démo Vidéo (2 min)',
    trustNoCreditCard: 'Sans carte bancaire',
    trustSetupTime: 'Configuration en 3 min',
    trustSecured: 'Paiements Sécurisés',

    featuresTitle: 'Tout ce dont votre PME a besoin pour exploser ses ventes',
    featuresSub: 'Une plateforme conçue sur-mesure pour le commerce WhatsApp en Afrique de l’Ouest.',
    featAutoReplyTitle: 'Réponse Automatique par IA 24/7',
    featAutoReplyDesc: 'L’IA apprend l’histoire et les prix de vos produits pour répondre instantanément à n’importe quelle heure.',
    featMobileMoneyTitle: 'Encaissement Mobile Money Instantané',
    featMobileMoneyDesc: 'Générez des reçus originaux et des liens de paiement sécurisés directement sur WhatsApp.',
    featCatalogTitle: 'Catalogue Produit & Gestion de Stock',
    featCatalogDesc: 'Mettez à jour vos articles et visualisez vos commandes confirmées en temps réel sur le tableau de bord.',

    simulatorBadge: 'TESTEZ EN DIRECT',
    simulatorTitle: 'Simulateur de Chat WhatsApp Reflex',
    simulatorSub: 'Tapez une question comme un vrai client et découvrez comment l’IA Reflex vend et encaisse automatiquement.',
    simulatorPlaceholder: 'Tapez votre message client (ex: Quel est le prix des perruques ?)...',
    simulatorSend: 'Envoyer',

    pricingBadge: 'TARIFS SIMPLES',
    pricingTitle: 'Des plans adaptés à la taille de votre commerce',
    pricingSub: 'Aucun frais caché. Annulez à tout moment.',
    planMonthly: 'Mensuel',
    planYearly: 'Annuel (-20%)',
    planStarterTitle: 'Starter PME',
    planStarterPrice: '15.000 FCFA / mois',
    planProTitle: 'Pro Commerce',
    planProPrice: '35.000 FCFA / mois',

    receiptTitle: 'Reçu Officiel de Paiement Reflex Mobile Money',
    receiptDownloadBtn: 'Télécharger le Reçu PDF',
    receiptStatusPaid: 'PAIEMENT CONFIRMÉ',
    receiptAmount: 'Montant Total Encaisse',
    receiptPme: 'Commerce / PME',
    receiptCustomer: 'Client',
    receiptMethod: 'Mode de Règlement',
  },

  EN: {
    activeService: '24/7 Active Service',
    featuresNav: 'Features',
    demoVideoNav: 'Video Demo',
    faqNav: 'FAQ',
    login: 'Log In',
    startFree: 'Start Free Trial',
    heroBadge: '#1 WhatsApp Commercial AI in West Africa',
    heroTitle1: 'Automate your WhatsApp sales & collect with',
    heroTitleHighlight: 'Mobile Money 24/7',
    heroSub: 'Reflex answers customer messages on WhatsApp in under 3 seconds, presents your catalog, and generates instant Mobile Money checkout payment links.',
    ctaStartNow: 'Try Reflex Free',
    ctaWatchDemo: 'Watch Video Demo (2 min)',
    trustNoCreditCard: 'No credit card required',
    trustSetupTime: '3-min setup',
    trustSecured: 'Secured Payments',

    featuresTitle: 'Everything your business needs to scale sales',
    featuresSub: 'Tailor-made platform for WhatsApp commerce across West Africa.',
    featAutoReplyTitle: '24/7 AI Automated Replies',
    featAutoReplyDesc: 'AI learns your product details and prices to reply instantly at any time of day or night.',
    featMobileMoneyTitle: 'Instant Mobile Money Payments',
    featMobileMoneyDesc: 'Generate official receipts and secure checkout links straight inside WhatsApp.',
    featCatalogTitle: 'Product Catalog & Inventory Management',
    featCatalogDesc: 'Update your items and track confirmed customer orders in real-time from your dashboard.',

    simulatorBadge: 'LIVE DEMO SIMULATOR',
    simulatorTitle: 'Reflex WhatsApp Live Chat Simulator',
    simulatorSub: 'Type a query like a real customer and see Reflex AI sell and collect payments automatically.',
    simulatorPlaceholder: 'Type a message (e.g., How much for the wig?)...',
    simulatorSend: 'Send',

    pricingBadge: 'SIMPLE PRICING',
    pricingTitle: 'Plans designed for every business size',
    pricingSub: 'No hidden fees. Cancel anytime.',
    planMonthly: 'Monthly',
    planYearly: 'Yearly (-20%)',
    planStarterTitle: 'SMB Starter',
    planStarterPrice: '15,000 FCFA / mo',
    planProTitle: 'Commerce Pro',
    planProPrice: '35,000 FCFA / mo',

    receiptTitle: 'Official Reflex Mobile Money Payment Receipt',
    receiptDownloadBtn: 'Download PDF Receipt',
    receiptStatusPaid: 'PAYMENT CONFIRMED',
    receiptAmount: 'Total Amount Collected',
    receiptPme: 'Merchant / Business',
    receiptCustomer: 'Customer',
    receiptMethod: 'Payment Method',
  },

  FON: {
    activeService: 'Azɔ̌ ɖò yiyí wɛ 24/7',
    featuresNav: 'Azɔ̌mɛnu lɛ̀',
    demoVideoNav: 'Vidéo Xlɛ́mɛ',
    faqNav: 'Nùkánbýɔ́ lɛ̀',
    login: 'Byɔ́ Mɛ̀',
    startFree: 'Bɛ́ bló kpó dɔ̀là ɖéɔ́ á',
    heroBadge: 'IA WhatsApp Azɔ̌watɔ́ N°1 ɖó Afrique de l’Ouest',
    heroTitle1: 'Sɔ́ azɔ̌ éwé lɛ́ wà kpó WhatsApp kpó bó yí akwɛ́',
    heroTitleHighlight: 'Mobile Money 24/7',
    heroSub: "Reflex nɔ́ yí gbe nú axɔ́súnɔ́ lɛ́ ɖò WhatsApp jí mɛ̀ kpɛ́ɖé mɛ̀, bo nɔ́ xlɛ́ nǔ e a ɖó lɛ́ bo nɔ́ d'akwɛ́ gbé Mobile Money tɔn instantané.",
    ctaStartNow: 'Tɛ́n Reflex kpɔ́n Mahwan',
    ctaWatchDemo: 'Kpɔ́n Vidéo Xlɛ́mɛ (Cɛ́ju 2)',
    trustNoCreditCard: 'Karta Kéɖé Mawu',
    trustSetupTime: 'Cɛ́ju 3 mɛ̀',
    trustSecured: 'Akwɛ́ Yíyí Ayijayǐ',

    featuresTitle: 'Nǔ e axɔ́súzɔ́ ewe ɖó hudo lɛ́ bí',
    featuresSub: 'Sisi sɔ́ nú commerce WhatsApp ɖò afrique west.',
    featAutoReplyTitle: 'Yǐgbe Tɔ́n Kpata 24/7',
    featAutoReplyDesc: 'IA ń kplɔ́n axɔ́ ewe lɛ́ bo nɔ́ yí gbe nú mɛ̀ ɖo zǎn mɛ̀ kpó hwèjǐ kpó.',
    featMobileMoneyTitle: 'Akwɛ́ Yíyí Mobile Money Kpata',
    featMobileMoneyDesc: 'Blo reçus tɔ́gbo lɛ́ bo sɔ́ lien Mobile Money dɔmɛ̀ WhatsApp mɛ̀.',
    featCatalogTitle: 'Nǔ mɛ̀ lɛ́ kpo Stock kpó',
    featCatalogDesc: 'Sɔ́ nǔ yɔ́yɔ́ lɛ́ dɔmɛ̀ bo kpɔ́n commandes e mɛ̀ lɛ́ bló lɛ́.',

    simulatorBadge: 'TƐ́N KPƆ́N FINƐ́',
    simulatorTitle: 'WhatsApp Reflex Live Chat Simulator',
    simulatorSub: 'Wlan nǔ ɖé bɔ IA Reflex na yí gbe bo sɔ́ akwɛ́ yi link xlɛ́ we.',
    simulatorPlaceholder: 'Wlan nùkanbyɔ ewe (ex: Nabi wɛ nǔ éè nyí?)...',
    simulatorSend: 'Sɔ́ hlyɛ́n',

    pricingBadge: 'AKWƐ́ E SƆ́ LƐ́',
    pricingTitle: 'Axɔ́ wúnmɛ́ wúnmɛ́ lɛ́ tɔn',
    pricingSub: 'Akwɛ́ gló mawu. Mon tɛ́n kpɔ́n.',
    planMonthly: 'Sùn mɛ̀',
    planYearly: 'Xwè mɛ̀ (-20%)',
    planStarterTitle: 'Starter PME',
    planStarterPrice: '15.000 FCFA / sun',
    planProTitle: 'Pro Commerce',
    planProPrice: '35.000 FCFA / sun',

    receiptTitle: 'Reçu Tɔ́gbo Reflex Mobile Money',
    receiptDownloadBtn: 'Sɔ́ PDF Reçu',
    receiptStatusPaid: 'AKWƐ́ YÍYÍ VƆ́',
    receiptAmount: 'Akwɛ́ Bi E Yí',
    receiptPme: 'Axɔ́súzɔ́ / PME',
    receiptCustomer: 'Axɔ́súnɔ́',
    receiptMethod: 'Akwɛ́ Yíyí Ali',
  },

  WO: {
    activeService: 'Liggéey bi mi ngi dox 24/7',
    featuresNav: 'Jëfkaay yi',
    demoVideoNav: 'Wane Wideo',
    faqNav: 'Laaj yi',
    login: 'Bindaandiku',
    startFree: 'Tambalil ci bënne tay',
    heroBadge: 'IA WhatsApp Bu Njiitu ci Afrique de l’Ouest',
    heroTitle1: 'Yoombàl sa njaay ci WhatsApp te nga feyu ci',
    heroTitleHighlight: 'Mobile Money 24/7',
    heroSub: 'Reflex dina tontu sa wopp klijang yi ci WhatsApp ci lu mu gën a gaaw, wane sa njay yi te defal la liens feyu Mobile Money ci saasi.',
    ctaStartNow: 'Jëfandiko Reflex Tay',
    ctaWatchDemo: 'Xool Wideo Bi (2 min)',
    trustNoCreditCard: 'Duff laajte karte',
    trustSetupTime: '3 minit dong',
    trustSecured: 'Feyu gu wóor',

    featuresTitle: 'Mbopp lu sa meun-meun soxla ngir yokk njaay yi',
    featuresSub: 'Platform bu ñu defal commerce WhatsApp ci reewi Afrique West.',
    featAutoReplyTitle: 'Tontu Automatig 24/7',
    featAutoReplyDesc: 'IA bi dina xam sa njeeg yi ak dundug sa jëfkaay ngir tontu waxtu wu nekk.',
    featMobileMoneyTitle: 'Feyu Mobile Money Ci Saasi',
    featMobileMoneyDesc: 'Defal ricevimentu ak lien feyu ci bir WhatsApp.',
    featCatalogTitle: 'Katalog Ak Saytu Stock Bi',
    featCatalogDesc: 'Yessal sa jënd yi te nga xool sa commande yi ci tableau de bord bi.',

    simulatorBadge: 'SEETAL CI SAASI',
    simulatorTitle: 'Simulateur Chat WhatsApp Reflex',
    simulatorSub: 'Bindaal laaj mu mel ni cliente dëgg te nga xool nu IA Reflex di jaaye ak di feyee.',
    simulatorPlaceholder: 'Bindaal laaj (ex: Ñaata lay jar?)...',
    simulatorSend: 'Yebbal',

    pricingBadge: 'NJEEX YU YOMB',
    pricingTitle: 'Njeex yu and ak sa commerce',
    pricingSub: 'Amul xaalis bu ñu dënk. Mën nga ko dagg képp waxtu.',
    planMonthly: 'Weer bu nekk',
    planYearly: 'At bu nekk (-20%)',
    planStarterTitle: 'Starter PME',
    planStarterPrice: '15.000 FCFA / weer',
    planProTitle: 'Pro Commerce',
    planProPrice: '35.000 FCFA / weer',

    receiptTitle: 'Ricevimentu Dëggu Reflex Mobile Money',
    receiptDownloadBtn: 'Yebal Ricevimentu PDF',
    receiptStatusPaid: 'FEYU BI JALL NA',
    receiptAmount: 'Mbopp Xaalis Bi',
    receiptPme: 'Jaaykat / PME',
    receiptCustomer: 'Klijang',
    receiptMethod: 'Anam Feyu Bi',
  }
};
