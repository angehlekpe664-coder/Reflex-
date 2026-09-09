export type LanguageCode = 'FR' | 'EN';

export interface TranslationDict {
  // Navigation & Header
  activeService: string;
  featuresNav: string;
  demoVideoNav: string;
  faqNav: string;
  login: string;
  startFree: string;
  logout: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSub: string;
  ctaStartNow: string;
  ctaWatchDemo: string;
  trustNoCreditCard: string;
  trustSetupTime: string;
  trustSecured: string;

  // Demo Video & Support Bar
  demoVideoTitle: string;
  momoSupportTitle: string;
  momoSupportSub: string;

  // Features Section
  featuresTitle: string;
  featuresSub: string;
  featAutoReplyTitle: string;
  featAutoReplyDesc: string;
  featMobileMoneyTitle: string;
  featMobileMoneyDesc: string;
  featCatalogTitle: string;
  featCatalogDesc: string;
  featSecurityTitle: string;
  featSecurityDesc: string;

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
  choosePlan: string;

  // FAQ Section
  faqTitle: string;
  faqSub: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;

  // Footer
  footerDesc: string;
  footerRights: string;
  footerSecurityNotice: string;

  // Auth Page / Modal
  authWelcomeLogin: string;
  authWelcomeSignup: string;
  authSubLogin: string;
  authSubSignup: string;
  emailLabel: string;
  passwordLabel: string;
  fullNameLabel: string;
  companyNameLabel: string;
  phoneLabel: string;
  googleAuthBtn: string;
  authOrSeparator: string;
  submitLogin: string;
  submitSignup: string;
  toggleToSignup: string;
  toggleToLogin: string;

  // Dashboard Sidebar & Header
  dashOverview: string;
  dashOrders: string;
  dashPayments: string;
  dashCatalog: string;
  dashSettings: string;
  dashAiActive: string;
  dashPmeActive: string;

  // Dashboard Overview Stats
  statConversations: string;
  statRevenue: string;
  statOrders: string;
  statSuccessRate: string;
  recentOrdersTitle: string;
  noRecentOrders: string;

  // Orders View
  ordersTitle: string;
  ordersSub: string;
  orderSearchPlaceholder: string;
  filterAll: string;
  filterPaid: string;
  filterPending: string;
  thOrderId: string;
  thCustomer: string;
  thItem: string;
  thAmount: string;
  thStatus: string;
  thDate: string;
  thAction: string;
  btnDownloadReceipt: string;

  // Payments View
  paymentsTitle: string;
  paymentsSub: string;
  totalCollected: string;
  momoProvidersTitle: string;
  thTransactionHash: string;
  thPayerPhone: string;

  // Catalogue View
  catalogTitle: string;
  catalogSub: string;
  btnAddProduct: string;
  thProduct: string;
  thCategory: string;
  thPrice: string;
  thStock: string;
  thActions: string;
  inStock: string;
  outOfStock: string;

  // Settings View
  settingsTitle: string;
  settingsSub: string;
  pmeInfoSection: string;
  aiToneSection: string;
  metaConnSection: string;
  btnConnectMeta: string;
  metaConnected: string;
  btnSaveSettings: string;

  // Checkout Payment Page
  checkoutTitle: string;
  checkoutSub: string;
  checkoutItem: string;
  checkoutAmount: string;
  checkoutPayerName: string;
  checkoutPayerPhone: string;
  checkoutPayBtn: string;
  checkoutSuccessTitle: string;
  checkoutSuccessSub: string;
  btnBackHome: string;
  btnGoDashboard: string;

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
    // Navigation & Header
    activeService: 'Service Actif 24/7',
    featuresNav: 'Fonctionnalités',
    demoVideoNav: 'Démo Vidéo',
    faqNav: 'FAQ',
    login: 'Se connecter',
    startFree: 'Commencer gratuitement',
    logout: 'Déconnexion',

    // Hero Section
    heroBadge: "L'IA Commerciale WhatsApp N°1 en Afrique de l'Ouest",
    heroTitle1: 'Automatisez vos ventes WhatsApp & encaissez par',
    heroTitleHighlight: 'Mobile Money 24/7',
    heroSub: 'Reflex répond à vos clients sur WhatsApp en moins de 3 secondes, présente votre catalogue de produits et génère des liens de paiement Mobile Money instantanés.',
    ctaStartNow: 'Essayer Reflex Gratuitement',
    ctaWatchDemo: 'Voir le Simulateur Live',
    trustNoCreditCard: 'Sans carte bancaire',
    trustSetupTime: 'Configuration en 3 min',
    trustSecured: 'Paiements Sécurisés',

    // Demo Video & Support Bar
    demoVideoTitle: 'Démo Vidéo de la Plateforme Reflex',
    momoSupportTitle: "Prise en charge intégrale des paiements d'Afrique de l'Ouest",
    momoSupportSub: 'MTN Mobile Money (*139#), Moov Money (*155#), Wave et Cartes bancaires avec reçus certifiés SHA-256.',

    // Features Section
    featuresTitle: 'Tout ce dont votre PME a besoin pour exploser ses ventes',
    featuresSub: 'Une plateforme conçue sur-mesure pour le commerce WhatsApp en Afrique de l’Ouest.',
    featAutoReplyTitle: 'Réponse Automatique par IA 24/7',
    featAutoReplyDesc: 'L’IA apprend l’histoire et les prix de vos produits pour répondre instantanément à n’importe quelle heure.',
    featMobileMoneyTitle: 'Encaissement Mobile Money Instantané',
    featMobileMoneyDesc: 'Générez des reçus originaux et des liens de paiement sécurisés directement sur WhatsApp.',
    featCatalogTitle: 'Catalogue Produit & Gestion de Stock',
    featCatalogDesc: 'Mettez à jour vos articles et visualisez vos commandes confirmées en temps réel sur le tableau de bord.',
    featSecurityTitle: 'Sécurité & Conformité Certifiée',
    featSecurityDesc: 'Transactions chiffrées de bout en bout avec génération de reçus certifiés SHA-256.',

    // Simulator Section
    simulatorBadge: 'TESTEZ EN DIRECT',
    simulatorTitle: 'Simulateur de Chat WhatsApp Reflex',
    simulatorSub: 'Tapez une question comme un vrai client et découvrez comment l’IA Reflex vend et encaisse automatiquement.',
    simulatorPlaceholder: 'Tapez votre message client (ex: Quel est le prix des perruques ?)...',
    simulatorSend: 'Envoyer',

    // Pricing Section
    pricingBadge: 'TARIFS SIMPLES',
    pricingTitle: 'Des plans adaptés à la taille de votre commerce',
    pricingSub: 'Aucun frais caché. Annulez à tout moment.',
    planMonthly: 'Mensuel',
    planYearly: 'Annuel (-20%)',
    planStarterTitle: 'Starter PME',
    planStarterPrice: '15.000 FCFA / mois',
    planProTitle: 'Pro Commerce',
    planProPrice: '35.000 FCFA / mois',
    choosePlan: 'Choisir ce plan',

    // FAQ Section
    faqTitle: 'Foire Aux Questions (FAQ)',
    faqSub: 'Des réponses claires à vos questions sur l’IA commercial WhatsApp.',
    faqQ1: 'Comment Reflex se connecte-t-il à mon WhatsApp Business ?',
    faqA1: 'La connexion se fait en 1-clic grâce à l’API officielle Meta Embedded Signup. Aucune compétence technique requise.',
    faqQ2: 'Quels modes de paiement Mobile Money sont supportés ?',
    faqA2: 'Reflex supporte MTN MoMo (*139#), Moov Money (*155#), Wave et les cartes bancaires dans toute l’Afrique de l’Ouest.',
    faqQ3: 'Puis-je personnaliser le catalogue et les réponses de l’IA ?',
    faqA3: 'Oui, vous pouvez ajouter vos articles, images, prix et définir le ton (Chaleureux, Strictement Pro, Décontracté) dans le tableau de bord.',

    // Footer
    footerDesc: 'Plateforme N°1 d’automatisation commerciale et d’encaissement Mobile Money sur WhatsApp pour les PME en Afrique de l’Ouest.',
    footerRights: 'Tous droits réservés.',
    footerSecurityNotice: 'Paiements certifiés • Infrastructure cloud hautement disponible.',

    // Auth Page / Modal
    authWelcomeLogin: 'Connexion à votre Espace Reflex',
    authWelcomeSignup: 'Créer votre Compte Reflex Gratuit',
    authSubLogin: 'Saisissez vos identifiants pour accéder au tableau de bord.',
    authSubSignup: 'Rejoignez des centaines de PME et automatisez vos ventes sur WhatsApp.',
    emailLabel: 'Adresse E-mail Professionnelle',
    passwordLabel: 'Mot de passe',
    fullNameLabel: 'Nom & Prénom',
    companyNameLabel: 'Nom de votre PME / Commerce',
    phoneLabel: 'Numéro WhatsApp Business',
    googleAuthBtn: 'Continuer avec Google',
    authOrSeparator: 'OU AVEC EMAIL',
    submitLogin: 'Se connecter à mon compte',
    submitSignup: 'Créer mon compte marchand',
    toggleToSignup: 'Pas encore de compte ? Inscrivez-vous gratuitement',
    toggleToLogin: 'Déjà inscrit ? Connectez-vous',

    // Dashboard Sidebar & Header
    dashOverview: "Vue d'ensemble",
    dashOrders: 'Commandes',
    dashPayments: 'Paiements',
    dashCatalog: 'Catalogue',
    dashSettings: 'Paramètres',
    dashAiActive: 'IA Active sur WhatsApp (24/7)',
    dashPmeActive: 'PME active',

    // Dashboard Overview Stats
    statConversations: 'Conversations Traitées',
    statRevenue: 'Revenus Mobile Money',
    statOrders: 'Commandes Confirmées',
    statSuccessRate: 'Taux de Conversion',
    recentOrdersTitle: 'Dernières Commandes Clients WhatsApp',
    noRecentOrders: 'Aucune commande enregistrée pour le moment.',

    // Orders View
    ordersTitle: 'Gestion des Commandes Clients',
    ordersSub: 'Suivez les ventes conclues par l’IA et téléchargez les reçus officiels.',
    orderSearchPlaceholder: 'Rechercher par client, article ou ID...',
    filterAll: 'Toutes les commandes',
    filterPaid: 'Payées',
    filterPending: 'En attente',
    thOrderId: 'ID Commande',
    thCustomer: 'Client',
    thItem: 'Article',
    thAmount: 'Montant',
    thStatus: 'Statut',
    thDate: 'Date',
    thAction: 'Action',
    btnDownloadReceipt: 'Reçu PDF',

    // Payments View
    paymentsTitle: 'Transactions & Reçus Mobile Money',
    paymentsSub: 'Historique des encaissements certifiés SHA-256 via MTN MoMo, Moov Money et Wave.',
    totalCollected: 'Total Encaissé (FCFA)',
    momoProvidersTitle: 'Modes de règlement Mobile Money actifs',
    thTransactionHash: 'Hash SHA-256',
    thPayerPhone: 'Téléphone Payer',

    // Catalogue View
    catalogTitle: 'Gestion du Catalogue Produit',
    catalogSub: 'Ajoutez et mettez à jour les articles que l’IA Reflex présente sur WhatsApp.',
    btnAddProduct: 'Ajouter un Produit',
    thProduct: 'Produit',
    thCategory: 'Catégorie',
    thPrice: 'Prix (FCFA)',
    thStock: 'Stock',
    thActions: 'Actions',
    inStock: 'En stock',
    outOfStock: 'Rupture',

    // Settings View
    settingsTitle: 'Configuration PME & Assistant IA',
    settingsSub: 'Personnalisez le nom de votre boutique, le ton de l’IA et la connexion WhatsApp Meta.',
    pmeInfoSection: 'Informations Générales de la PME',
    aiToneSection: 'Personnalisation du Ton de l’IA',
    metaConnSection: 'Connexion Officielle WhatsApp Business (Meta)',
    btnConnectMeta: 'Connecter mon WhatsApp Business avec Meta',
    metaConnected: 'WhatsApp Business Lié & Actif',
    btnSaveSettings: 'Enregistrer les modifications',

    // Checkout Payment Page
    checkoutTitle: 'Règlement de la Commande',
    checkoutSub: 'Paiement sécurisé Mobile Money propulsé par Reflex.',
    checkoutItem: 'Article',
    checkoutAmount: 'Montant à payer',
    checkoutPayerName: 'Nom complet du client',
    checkoutPayerPhone: 'Numéro Mobile Money du Payer',
    checkoutPayBtn: 'Payer via Mobile Money →',
    checkoutSuccessTitle: 'Paiement Réussi !',
    checkoutSuccessSub: 'Votre règlement a été encaissé avec succès via Mobile Money. Le reçu officiel a été envoyé sur WhatsApp.',
    btnBackHome: 'Retourner à l’accueil',
    btnGoDashboard: 'Accéder au Dashboard Marchand →',

    // Receipts & Modal
    receiptTitle: 'Reçu Officiel de Paiement Reflex Mobile Money',
    receiptDownloadBtn: 'Télécharger le Reçu PDF',
    receiptStatusPaid: 'PAIEMENT CONFIRMÉ',
    receiptAmount: 'Montant Total Encaisse',
    receiptPme: 'Commerce / PME',
    receiptCustomer: 'Client',
    receiptMethod: 'Mode de Règlement',
  },

  EN: {
    // Navigation & Header
    activeService: '24/7 Active Service',
    featuresNav: 'Features',
    demoVideoNav: 'Video Demo',
    faqNav: 'FAQ',
    login: 'Log In',
    startFree: 'Start Free Trial',
    logout: 'Log Out',

    // Hero Section
    heroBadge: '#1 WhatsApp Commercial AI in West Africa',
    heroTitle1: 'Automate your WhatsApp sales & collect with',
    heroTitleHighlight: 'Mobile Money 24/7',
    heroSub: 'Reflex answers customer messages on WhatsApp in under 3 seconds, presents your catalog, and generates instant Mobile Money checkout payment links.',
    ctaStartNow: 'Try Reflex Free',
    ctaWatchDemo: 'Watch Live Simulator',
    trustNoCreditCard: 'No credit card required',
    trustSetupTime: '3-min setup',
    trustSecured: 'Secured Payments',

    // Demo Video & Support Bar
    demoVideoTitle: 'Reflex Platform Video Demo',
    momoSupportTitle: 'Full Support for West African Mobile Money Payments',
    momoSupportSub: 'MTN Mobile Money (*139#), Moov Money (*155#), Wave, and Credit Cards with SHA-256 certified receipts.',

    // Features Section
    featuresTitle: 'Everything your business needs to scale sales',
    featuresSub: 'Tailor-made platform for WhatsApp commerce across West Africa.',
    featAutoReplyTitle: '24/7 AI Automated Replies',
    featAutoReplyDesc: 'AI learns your product details and prices to reply instantly at any time of day or night.',
    featMobileMoneyTitle: 'Instant Mobile Money Payments',
    featMobileMoneyDesc: 'Generate official receipts and secure checkout links straight inside WhatsApp.',
    featCatalogTitle: 'Product Catalog & Inventory Management',
    featCatalogDesc: 'Update your items and track confirmed customer orders in real-time from your dashboard.',
    featSecurityTitle: 'Certified Security & Compliance',
    featSecurityDesc: 'End-to-end encrypted transactions with SHA-256 certified receipt generation.',

    // Simulator Section
    simulatorBadge: 'LIVE DEMO SIMULATOR',
    simulatorTitle: 'Reflex WhatsApp Live Chat Simulator',
    simulatorSub: 'Type a query like a real customer and see Reflex AI sell and collect payments automatically.',
    simulatorPlaceholder: 'Type a message (e.g., How much for the wig?)...',
    simulatorSend: 'Send',

    // Pricing Section
    pricingBadge: 'SIMPLE PRICING',
    pricingTitle: 'Plans designed for every business size',
    pricingSub: 'No hidden fees. Cancel anytime.',
    planMonthly: 'Monthly',
    planYearly: 'Yearly (-20%)',
    planStarterTitle: 'SMB Starter',
    planStarterPrice: '15,000 FCFA / mo',
    planProTitle: 'Commerce Pro',
    planProPrice: '35,000 FCFA / mo',
    choosePlan: 'Choose this plan',

    // FAQ Section
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faqSub: 'Clear answers to your questions about commercial WhatsApp AI.',
    faqQ1: 'How does Reflex connect to my WhatsApp Business?',
    faqA1: 'Connection takes 1 click via the official Meta Embedded Signup API. No technical skills needed.',
    faqQ2: 'Which Mobile Money payment methods are supported?',
    faqA2: 'Reflex supports MTN MoMo (*139#), Moov Money (*155#), Wave, and bank cards across West Africa.',
    faqQ3: 'Can I customize my catalog and AI responses?',
    faqA3: 'Yes, you can add your products, images, pricing, and set AI tone (Warm, Professional, Casual) in the dashboard.',

    // Footer
    footerDesc: '#1 Commercial automation & Mobile Money payment platform on WhatsApp for businesses in West Africa.',
    footerRights: 'All rights reserved.',
    footerSecurityNotice: 'Certified payments • Highly available cloud infrastructure.',

    // Auth Page / Modal
    authWelcomeLogin: 'Log In to your Reflex Account',
    authWelcomeSignup: 'Create your Free Reflex Account',
    authSubLogin: 'Enter your credentials to access your merchant dashboard.',
    authSubSignup: 'Join hundreds of businesses automating their WhatsApp sales.',
    emailLabel: 'Business Email Address',
    passwordLabel: 'Password',
    fullNameLabel: 'Full Name',
    companyNameLabel: 'Business / Company Name',
    phoneLabel: 'WhatsApp Business Number',
    googleAuthBtn: 'Continue with Google',
    authOrSeparator: 'OR WITH EMAIL',
    submitLogin: 'Log In to Account',
    submitSignup: 'Create Merchant Account',
    toggleToSignup: "Don't have an account? Sign up for free",
    toggleToLogin: 'Already registered? Log in',

    // Dashboard Sidebar & Header
    dashOverview: 'Overview',
    dashOrders: 'Orders',
    dashPayments: 'Payments',
    dashCatalog: 'Catalog',
    dashSettings: 'Settings',
    dashAiActive: 'AI Active on WhatsApp (24/7)',
    dashPmeActive: 'Active Business',

    // Dashboard Overview Stats
    statConversations: 'Processed Conversations',
    statRevenue: 'Mobile Money Revenue',
    statOrders: 'Confirmed Orders',
    statSuccessRate: 'Conversion Rate',
    recentOrdersTitle: 'Latest WhatsApp Customer Orders',
    noRecentOrders: 'No orders recorded yet.',

    // Orders View
    ordersTitle: 'Customer Orders Management',
    ordersSub: 'Track sales closed by AI and download official payment receipts.',
    orderSearchPlaceholder: 'Search by customer, item, or ID...',
    filterAll: 'All Orders',
    filterPaid: 'Paid',
    filterPending: 'Pending',
    thOrderId: 'Order ID',
    thCustomer: 'Customer',
    thItem: 'Item',
    thAmount: 'Amount',
    thStatus: 'Status',
    thDate: 'Date',
    thAction: 'Action',
    btnDownloadReceipt: 'PDF Receipt',

    // Payments View
    paymentsTitle: 'Mobile Money Transactions & Receipts',
    paymentsSub: 'History of SHA-256 certified payments via MTN MoMo, Moov Money, and Wave.',
    totalCollected: 'Total Collected (FCFA)',
    momoProvidersTitle: 'Active Mobile Money Payment Methods',
    thTransactionHash: 'SHA-256 Hash',
    thPayerPhone: 'Payer Phone',

    // Catalogue View
    catalogTitle: 'Product Catalog Management',
    catalogSub: 'Add and update products presented by Reflex AI on WhatsApp.',
    btnAddProduct: 'Add New Product',
    thProduct: 'Product',
    thCategory: 'Category',
    thPrice: 'Price (FCFA)',
    thStock: 'Stock',
    thActions: 'Actions',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',

    // Settings View
    settingsTitle: 'Business & AI Assistant Settings',
    settingsSub: 'Customize your store name, AI tone, and Meta WhatsApp connection.',
    pmeInfoSection: 'General Business Information',
    aiToneSection: 'AI Assistant Tone Customization',
    metaConnSection: 'Official Meta WhatsApp Business Connection',
    btnConnectMeta: 'Connect WhatsApp Business with Meta',
    metaConnected: 'WhatsApp Business Linked & Active',
    btnSaveSettings: 'Save Changes',

    // Checkout Payment Page
    checkoutTitle: 'Order Checkout Payment',
    checkoutSub: 'Secured Mobile Money payment powered by Reflex.',
    checkoutItem: 'Item',
    checkoutAmount: 'Amount to pay',
    checkoutPayerName: 'Customer Full Name',
    checkoutPayerPhone: 'Payer Mobile Money Phone Number',
    checkoutPayBtn: 'Pay via Mobile Money →',
    checkoutSuccessTitle: 'Payment Successful!',
    checkoutSuccessSub: 'Your payment was collected successfully via Mobile Money. The official receipt was sent on WhatsApp.',
    btnBackHome: 'Return to Home',
    btnGoDashboard: 'Go to Merchant Dashboard →',

    // Receipts & Modal
    receiptTitle: 'Official Reflex Mobile Money Payment Receipt',
    receiptDownloadBtn: 'Download PDF Receipt',
    receiptStatusPaid: 'PAYMENT CONFIRMED',
    receiptAmount: 'Total Amount Collected',
    receiptPme: 'Merchant / Business',
    receiptCustomer: 'Customer',
    receiptMethod: 'Payment Method',
  }
};
