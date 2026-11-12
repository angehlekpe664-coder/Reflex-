import { useState } from 'react';
import { 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  QrCode, 
  LayoutGrid, 
  Utensils, 
  GraduationCap, 
  Briefcase, 
  Database, 
  Heart, 
  Wrench, 
  ArrowRight, 
  Sun,
  Moon,
  Zap,
  Users,
  ShieldCheck,
  MessageSquare,
  Wallet,
  BarChart3,
  Workflow
} from 'lucide-react';

export function LandingPage(props: any) {
  const { 
    setActiveView, 
    setAuthMode, 
    setSelectedPlan, 
    showScrollTop
  } = props;

  // View state: 'home' | 'about' | 'blog'
  const [currentSubView, setCurrentSubView] = useState<'home' | 'about' | 'blog'>('home');
  
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [blogFilter, setBlogFilter] = useState<'Tous' | 'Produit' | 'Guide' | 'Croissance'>('Tous');

  const isLight = theme === 'light';

  const testimonials = [
    {
      quote: "Avant Reflex, je passais 3 heures chaque soir à répondre aux messages clients. L'IA gère maintenant 90% des demandes. J'ai enfin pu passer des soirées sereines.",
      author: "Amina Sow",
      role: "AO Fashion Boutique, Cotonou"
    },
    {
      quote: "Les commandes se perdaient pendant le rush du soir en cuisine. Avec Reflex, les commandes et les paiements MoMo sont confirmés instantanément.",
      author: "Romuald Houngbo",
      role: "Saveurs & Délices, Porto-Novo"
    },
    {
      quote: "Nos patients peuvent réserver leurs consultations et obtenir des informations 24h/24. C'est comme avoir 3 assistants dédiés en continu.",
      author: "Dr. Kpogbemabou",
      role: "Centre Médical Sainte-Marie, Cotonou"
    }
  ];

  // Exact 7 FAQ items (Localized strictly for Benin)
  const faqs = [
    {
      q: "Est-ce que cela fonctionne avec mon numéro WhatsApp actuel ?",
      a: "Oui. Vous pouvez connecter votre numéro WhatsApp existant ou un nouveau numéro professionnel. La liaison s'effectue en quelques clics via l'API officielle Meta Cloud."
    },
    {
      q: "Mes clients doivent-ils télécharger une application ?",
      a: "Non, aucun téléchargement n'est requis ! Vos clients vous écrivent directement sur leur WhatsApp habituel, exactement comme ils l'ont toujours fait."
    },
    {
      q: "Combien de temps faut-il pour être opérationnel ?",
      a: "Moins de 15 minutes. Vous liez votre numéro, ajoutez vos produits ou services et leurs prix, et votre assistant IA commence à répondre immédiatement."
    },
    {
      q: "Puis-je l'utiliser pour des prestations de services, pas seulement des produits ?",
      a: "Absolument. Reflex est optimisé pour les cliniques, salons de coiffure, cabinets, réparateurs, écoles et toute activité nécessitant devis, rendez-vous ou renseignements."
    },
    {
      q: "Quels moyens de paiement sont pris en charge au Bénin ?",
      a: "Reflex intègre nativement MTN Mobile Money (*139#), Moov Money (*155#), Celtiis Cash, Wave, et les cartes bancaires directement dans la conversation WhatsApp."
    },
    {
      q: "Mes données et celles de mes clients sont-elles protégées ?",
      a: "Oui. Toutes les communications transitent par les serveurs sécurisés et chiffrés de l'infrastructure officielle Meta. Vos données restent strictement confidentielles."
    },
    {
      q: "Puis-je résilier à tout moment ?",
      a: "Oui, vous êtes 100% libre. Vous pouvez suspendre ou annuler votre abonnement en un clic depuis votre espace, sans aucun engagement ni frais caché."
    }
  ];

  // Blog Posts matching Screenshots 1 & 4 (Localized to Benin & West Africa)
  const allBlogPosts = [
    {
      tag: "Produit",
      category: "Produit",
      title: "IA WhatsApp pour les entreprises au Bénin : Comment ça marche et pourquoi les commerçants l'adorent",
      snippet: "L'intelligence artificielle conversationnelle remplace la saisie manuelle des commandes pour des centaines de commerçants béninois. Découvrez ses fonctionnalités concrètes.",
      author: "Ange H.",
      date: "28 Fév 2026",
      readTime: "6 min de lecture"
    },
    {
      tag: "Produit",
      category: "Produit",
      title: "5 astuces Reflex pour ne plus jamais manquer une commande client la nuit",
      snippet: "Chaque message non répondu est une vente perdue. Voici les 5 fonctions clés qu'utilisent nos commerçants pour encaisser même à 2h du matin.",
      author: "Mireille T.",
      date: "12 Fév 2026",
      readTime: "4 min de lecture"
    },
    {
      tag: "Guide",
      category: "Guide",
      title: "Automatisation des ventes WhatsApp au Bénin : Le Guide Complet 2026",
      snippet: "Tout ce que les PME béninoises doivent savoir pour automatiser leur WhatsApp : de la configuration au paiement Mobile Money sans lever le petit doigt.",
      author: "Dossou K.",
      date: "1 Mai 2026",
      readTime: "9 min de lecture"
    },
    {
      tag: "Guide",
      category: "Guide",
      title: "Comment encaisser par Mobile Money sur WhatsApp au Bénin (MTN MoMo, Moov Money, Celtiis)",
      snippet: "Guide étape par étape pour collecter des paiements Mobile Money directement dans la discussion WhatsApp — reçus automatiques instantanés.",
      author: "Ange H.",
      date: "5 Avr 2026",
      readTime: "6 min de lecture"
    },
    {
      tag: "Guide",
      category: "Guide",
      title: "WhatsApp Business API en Afrique : Ce que c'est et comment l'obtenir",
      snippet: "L'API Cloud officielle de WhatsApp débloque l'automatisation sans risque de blocage. Voici les critères et étapes simples d'approbation.",
      author: "Équipe Reflex",
      date: "18 Avr 2026",
      readTime: "8 min de lecture"
    },
    {
      tag: "Croissance",
      category: "Croissance",
      title: "Passer de 10 à 500 commandes WhatsApp par jour sans recruter d'équipe",
      snippet: "Étude de cas d'une boutique de prêt-à-porter à Cotonou qui a multiplié ses ventes par 4 grâce au traitement instantané des demandes.",
      author: "Amina S.",
      date: "22 Jan 2026",
      readTime: "7 min de lecture"
    }
  ];

  const filteredBlogPosts = blogFilter === 'Tous' 
    ? allBlogPosts 
    : allBlogPosts.filter(p => p.category === blogFilter);

  const navigateTo = (view: 'home' | 'about' | 'blog', anchor?: string) => {
    setCurrentSubView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (anchor && view === 'home') {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className={`relay-landing-wrapper ${isLight ? 'theme-light' : ''}`}>
      {/* Background Grid Pattern & Ambient Glow */}
      <div className="relay-bg-grid" />
      <div className="relay-bg-glow" />

      {/* Floating Centered Pill Navbar */}
      <header className="relay-floating-navbar">
        {/* Logo Image Only (NO duplicate text! Adapts to Light/Dark mode) */}
        <div 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigateTo('home')}
        >
          <img 
            src={isLight ? "/logo-light-bg.png" : "/logo.png"} 
            alt="Reflex" 
            style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }} 
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <span 
            style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => navigateTo('home', 'features')}
          >
            Fonctionnalités
          </span>
          <span 
            style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => navigateTo('home', 'pricing')}
          >
            Tarification
          </span>
          <span 
            style={{ 
              color: currentSubView === 'about' ? '#2563EB' : (isLight ? '#475569' : '#94a3b8'), 
              fontSize: '14px', 
              fontWeight: currentSubView === 'about' ? 700 : 500, 
              cursor: 'pointer', 
              transition: 'color 0.2s' 
            }} 
            onClick={() => navigateTo('about')}
          >
            À propos
          </span>
          <span 
            style={{ 
              color: currentSubView === 'blog' ? '#2563EB' : (isLight ? '#475569' : '#94a3b8'), 
              fontSize: '14px', 
              fontWeight: currentSubView === 'blog' ? 700 : 500, 
              cursor: 'pointer', 
              transition: 'color 0.2s' 
            }} 
            onClick={() => navigateTo('blog')}
          >
            Blog
          </span>
        </nav>

        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="nav-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Light / Dark Mode Toggle Button */}
          <div 
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              color: isLight ? '#475569' : '#94a3b8', 
              cursor: 'pointer', 
              transition: 'all 0.2s',
              backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'
            }}
            title={isLight ? "Passer en mode sombre" : "Passer en mode clair"}
          >
            {isLight ? <Moon size={16} /> : <Sun size={17} />}
          </div>

          {/* Log in Link */}
          <span
            className="nav-login-btn"
            style={{ fontSize: '14px', fontWeight: 600, color: isLight ? '#0F172A' : '#ffffff', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onClick={() => { setAuthMode('login'); setActiveView('auth'); }}
          >
            Se connecter
          </span>

          {/* Get Started Button in Brand Blue */}
          <button
            className="relay-btn-primary"
            style={{ padding: '8px 18px', fontSize: '13.5px', borderRadius: '8px' }}
            onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
          >
            Commencer
          </button>
        </div>

        {/* Mobile Actions: Compact Theme Toggle + Hamburger Button (Visible ONLY on Mobile) */}
        <div className="nav-mobile-actions">
          <div 
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '34px', 
              height: '34px', 
              borderRadius: '50%', 
              color: isLight ? '#0F172A' : '#ffffff', 
              cursor: 'pointer', 
              backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
            }}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </div>

          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Toggle Menu"
            style={{ 
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)', 
              color: isLight ? '#0F172A' : '#ffffff'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(14, 20, 29, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            zIndex: 1001
          }}>
            <span onClick={() => navigateTo('home', 'features')} style={{ color: isLight ? '#0F172A' : '#ffffff', fontSize: '16px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', borderRadius: '8px' }}>Fonctionnalités</span>
            <span onClick={() => navigateTo('home', 'pricing')} style={{ color: isLight ? '#0F172A' : '#ffffff', fontSize: '16px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', borderRadius: '8px' }}>Tarification</span>
            <span onClick={() => navigateTo('about')} style={{ color: isLight ? '#0F172A' : '#ffffff', fontSize: '16px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', borderRadius: '8px' }}>À propos</span>
            <span onClick={() => navigateTo('blog')} style={{ color: isLight ? '#0F172A' : '#ffffff', fontSize: '16px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', borderRadius: '8px' }}>Blog</span>
            <span onClick={() => navigateTo('home', 'faq')} style={{ color: isLight ? '#0F172A' : '#ffffff', fontSize: '16px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', borderRadius: '8px' }}>FAQ</span>
            <div style={{ height: '1px', backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
            <button 
              className="relay-btn-outline" 
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
              onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); setActiveView('auth'); }}
            >
              Se connecter
            </button>
            <button 
              className="relay-btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '15px', backgroundColor: '#2563EB' }}
              onClick={() => { setMobileMenuOpen(false); setAuthMode('signup'); setActiveView('auth'); }}
            >
              Commencer
            </button>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: HOME PAGE (Blog and About are separate views, clicked on demand) */}
      {/* ========================================================================= */}
      {currentSubView === 'home' && (
        <>
          {/* 1. HERO SECTION */}
          <section className="hero-section-responsive" style={{ paddingTop: '150px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div style={{ maxWidth: '880px', margin: '0 auto' }}>
              
              {/* Early Access Pill (BENIN) */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 18px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                marginBottom: '32px'
              }}>
                <span className="pulse-blue-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#3B82F6', letterSpacing: '0.02em' }}>
                  Désormais disponible au Bénin — Accès Anticipé
                </span>
              </div>

              {/* Headline with Blue Italic Accent */}
              <h1 className="text-white-heading" style={{
                color: isLight ? '#0F172A' : '#ffffff',
                fontSize: 'clamp(34px, 7.5vw, 72px)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                marginBottom: '24px'
              }}>
                Servez vos clients,<br />
                encaissez vos paiements,<br />
                <span 
                  className="font-fraunces-italic" 
                  style={{ 
                    color: '#2563EB', 
                    fontSize: 'clamp(40px, 8.5vw, 80px)', 
                    fontWeight: 400,
                    display: 'inline-block',
                    marginTop: '4px'
                  }}
                >
                  le tout sur WhatsApp
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-muted-desc" style={{
                color: isLight ? '#64748B' : '#94a3b8',
                fontSize: 'clamp(15px, 2vw, 18.5px)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto 36px',
                fontWeight: 400
              }}>
                Automatisation des ventes et de la relation client par IA sur WhatsApp pour toute entreprise. Répondez aux demandes, réservez des rendez-vous, traitez les commandes et encaissez — automatiquement 24h/24.
              </p>

              {/* CTA Buttons in Blue */}
              <div className="hero-cta-buttons-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="relay-btn-primary"
                  style={{ padding: '14px 34px', fontSize: '16px', borderRadius: '10px' }}
                  onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Commencer
                </button>
                <a
                  href="#how-it-works"
                  className="relay-btn-outline"
                  style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '10px' }}
                >
                  Voir comment ça marche
                </a>
              </div>

              {/* Guarantee */}
              <div style={{ color: '#64748b', fontSize: '13px', marginTop: '20px', fontWeight: 400 }}>
                Sans carte bancaire requise · Résiliation à tout moment
              </div>

            </div>
          </section>

          {/* 2. THREE-STEP PROCESS: "Opérationnel en 15 minutes" */}
          <section id="how-it-works" className="section-container-responsive" style={{ maxWidth: '1140px', margin: '0 auto 120px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="text-white-heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Opérationnel en <span style={{ color: '#2563EB' }}>15 minutes</span>
              </h2>
              <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '14px auto 0', lineHeight: 1.6 }}>
                Aucune compétence technique requise. Si vous savez envoyer un message WhatsApp, vous savez utiliser Reflex.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* CARD 01 */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ fontSize: '46px', fontWeight: 800, color: '#2563EB', lineHeight: 1, marginBottom: '22px' }}>
                  01
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <QrCode size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '12px' }}>
                  Connectez votre WhatsApp
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.65, margin: 0 }}>
                  Liez votre numéro en un clic. Vos clients vous contactent exactement comme avant — rien ne change pour eux.
                </p>
              </div>

              {/* CARD 02 */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ fontSize: '46px', fontWeight: 800, color: '#2563EB', lineHeight: 1, marginBottom: '22px' }}>
                  02
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <LayoutGrid size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '12px' }}>
                  Configurez votre offre
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.65, margin: 0 }}>
                  Ajoutez vos produits, listez vos services ou décrivez votre activité. Fixez vos prix et disponibilités. L'IA apprend votre métier et répond aux questions.
                </p>
              </div>

              {/* CARD 03 */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ fontSize: '46px', fontWeight: 800, color: '#2563EB', lineHeight: 1, marginBottom: '22px' }}>
                  03
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <CheckCircle2 size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '12px' }}>
                  Servez, livrez &amp; encaissez
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.65, margin: 0 }}>
                  L'IA répond aux sollicitations 24h/24 — prises de commandes, réservations, conseils. Vous êtes notifié et le paiement est collecté directement dans le chat.
                </p>
              </div>
            </div>
          </section>

          {/* 3. USE CASES SECTION: "Produits, services ou toute autre activité" */}
          <section id="use-cases" className="section-container-responsive" style={{ maxWidth: '1140px', margin: '0 auto 120px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="text-white-heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Produits, services ou <span style={{ color: '#2563EB' }}>toute autre activité</span>
              </h2>
              <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '16px', maxWidth: '680px', margin: '14px auto 0', lineHeight: 1.6 }}>
                Que vous vendiez des articles, dirigiez une clinique ou gériez une agence — Reflex s'adapte à tous vos besoins sur WhatsApp.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* 1. Mode & Prêt-à-porter */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <ShoppingBag size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Mode &amp; Prêt-à-porter</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Partagez vos catalogues, prenez les commandes, traitez les questions de pointure ou de taille et encaissez — sans quitter WhatsApp.
                </p>
              </div>

              {/* 2. Restauration & Traiteur (Populaire) */}
              <div className="relay-card-dark mobile-responsive-card">
                <span style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.35)', color: '#2563EB', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', letterSpacing: '0.04em' }}>
                  Populaire
                </span>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Utensils size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Restauration &amp; Traiteur</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Présentez vos menus, enregistrez les précommandes, confirmez les réservations et suivez les livraisons en toute fluidité.
                </p>
              </div>

              {/* 3. Écoles & Formations */}
              <div className="relay-card-dark mobile-responsive-card">
                <span style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(0, 0, 0, 0.05)', border: '1px solid rgba(0, 0, 0, 0.1)', color: '#64748B', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px' }}>
                  Entreprise
                </span>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Écoles &amp; Formations</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Gérez les demandes d'admission, communiquez les résultats, envoyez les rappels de scolarité et encaissez automatiquement.
                </p>
              </div>

              {/* 4. Services Professionnels */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Briefcase size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Services Professionnels</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Consultants, avocats, experts-comptables : réalisez vos devis, planifiez les consultations, effectuez les relances et facturez automatiquement.
                </p>
              </div>

              {/* 5. Registres & Suivi de dossiers */}
              <div className="relay-card-dark mobile-responsive-card">
                <span style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(0, 0, 0, 0.05)', border: '1px solid rgba(0, 0, 0, 0.1)', color: '#64748B', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px' }}>
                  Entreprise
                </span>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Database size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Registres &amp; Suivi de dossiers</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Agences, coopératives, cabinets : permettez aux usagers d'envoyer un message pour vérifier un statut ou demander des attestations.
                </p>
              </div>

              {/* 6. Santé & Bien-être */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Heart size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Santé &amp; Bien-être</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Planifiez les rendez-vous, envoyez les rappels de consultation, transmettez les résultats d'analyses et gérez les patients en continu.
                </p>
              </div>

              {/* 7. Réparations & Maintenance */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Wrench size={20} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Réparations &amp; Maintenance</h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Enregistrez les demandes d'intervention, envoyez les devis détaillés, communiquez l'avancement et encaissez dès la fin du travail.
                </p>
              </div>
            </div>

            {/* Custom Build Callout Banner */}
            <div className="custom-build-banner-flex" style={{
              backgroundColor: isLight ? '#EFF6FF' : '#0F1622',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: '20px',
              padding: '40px 48px',
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '32px',
              flexWrap: 'wrap',
              textAlign: 'left'
            }}>
              <div style={{ maxWidth: '640px' }}>
                <h3 className="text-white-heading" style={{ fontSize: '22px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Vous ne trouvez pas votre cas d'usage ?
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                  Nous concevons des <span style={{ color: '#2563EB', textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}>solutions WhatsApp sur mesure</span> adaptées à votre fonctionnement précis au Bénin et en Afrique de l'Ouest — réseaux multi-points de vente, logistique, cliniques et grands comptes.
                </p>
              </div>

              <button
                className="relay-btn-outline"
                style={{ 
                  borderColor: 'rgba(37, 99, 235, 0.4)', 
                  color: '#2563EB', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  fontWeight: 600,
                  gap: '8px'
                }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Demander une solution sur mesure <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* 4. SYSTEME D'EXPLOITATION COMPLET / FEATURES SECTION (From User Screenshots media_1794514925285_bcff9a36.png) */}
          <section id="features" className="section-container-responsive" style={{ maxWidth: '1140px', margin: '0 auto 120px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#2563EB',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>
                BIEN PLUS QU'UN SIMPLE CHATBOT
              </div>
              <h2 className="text-white-heading" style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Un <span style={{ color: '#2563EB' }}>système d'exploitation complet</span> pour votre entreprise
              </h2>
              <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '16.5px', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
                Des outils performants conçus pour les entrepreneurs des marchés émergents
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Card 1: Intégration WhatsApp */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <MessageSquare size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Intégration WhatsApp
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Connectez votre compte WhatsApp Business et commencez à servir vos clients instantanément : produits, services, réservations ou tout autre chose.
                </p>
              </div>

              {/* Card 2: Réponses basées sur l'IA */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Zap size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Réponses basées sur l'IA
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Il traite les demandes de renseignements, prend les rendez-vous, recommande des produits, établit des devis et envoie des mises à jour — automatiquement, 24 heures sur 24.
                </p>
              </div>

              {/* Card 3: Paiements instantanés */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Wallet size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Paiements instantanés
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Encaissez les paiements pour tout type de produit, service, dépôt ou frais via MTN MoMo, Moov Money, Celtiis Cash, Wave et cartes bancaires directement dans la conversation.
                </p>
              </div>

              {/* Card 4: Tableau de bord analytique */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Tableau de bord analytique
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Suivez les revenus, les réservations, la prestation de services, l'engagement client et les indicateurs de performance de votre entreprise, le tout au même endroit et en temps réel.
                </p>
              </div>

              {/* Card 5: Sécurisé et fiable */}
              <div className="relay-card-dark mobile-responsive-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Sécurisé et fiable
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Sécurité de niveau bancaire avec données cryptées et conformité aux normes internationales.
                </p>
              </div>

              {/* Card 6: Automatisations personnalisées (avec badge Prochainement) */}
              <div className="relay-card-dark mobile-responsive-card" style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.35)',
                  color: '#2563EB',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em'
                }}>
                  Prochainement
                </span>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Workflow size={22} />
                </div>
                <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>
                  Automatisations personnalisées
                </h3>
                <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Créez des flux de travail adaptés à votre activité précise : suivis, rappels de service, confirmations de rendez-vous, réapprovisionnements, et plus encore.
                </p>
              </div>
            </div>
          </section>

          {/* 5. TESTIMONIALS SECTION */}
          <section id="testimonials" className="section-container-responsive" style={{ maxWidth: '1140px', margin: '0 auto 120px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <h2 className="text-white-heading" style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                Impactant<br />
                <span style={{ color: '#2563EB' }}>Succès</span>
              </h2>
            </div>

            <div className="mobile-responsive-card" style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0C1320',
              border: isLight ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: '24px',
              padding: '56px 44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '36px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isLight ? '0 15px 40px rgba(0,0,0,0.04)' : '0 20px 50px rgba(0,0,0,0.5)'
            }}>
              <div className="quote-svg-desktop" style={{ flexShrink: 0, opacity: 0.9 }}>
                <svg width="100" height="90" viewBox="0 0 100 90" fill="#2563EB">
                  <path d="M0 50 C0 20 20 0 45 0 L45 20 C30 20 20 30 20 50 L45 50 L45 90 L0 90 Z" />
                  <path d="M55 50 C55 20 75 0 100 0 L100 20 C85 20 75 30 75 50 L100 50 L100 90 L55 90 Z" />
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0, width: '100%', textAlign: 'left' }}>
                {/* Mobile Single Top Quote SVG */}
                <div className="quote-svg-mobile" style={{ marginBottom: '14px', opacity: 0.9 }}>
                  <svg width="36" height="30" viewBox="0 0 100 90" fill="#2563EB">
                    <path d="M0 50 C0 20 20 0 45 0 L45 20 C30 20 20 30 20 50 L45 50 L45 90 L0 90 Z" />
                    <path d="M55 50 C55 20 75 0 100 0 L100 20 C85 20 75 30 75 50 L100 50 L100 90 L55 90 Z" />
                  </svg>
                </div>

                <p className="text-white-heading" style={{
                  fontSize: 'clamp(16px, 2.5vw, 24px)',
                  color: isLight ? '#0F172A' : '#ffffff',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  margin: '0 0 20px 0'
                }}>
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div style={{ color: '#2563EB', fontWeight: 700, fontSize: '17px' }}>
                  {testimonials[activeTestimonial].author}
                </div>
                <div className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '13.5px', marginTop: '3px' }}>
                  {testimonials[activeTestimonial].role}
                </div>
              </div>

              <div className="quote-svg-desktop" style={{ flexShrink: 0, opacity: 0.9 }}>
                <svg width="100" height="90" viewBox="0 0 100 90" fill="#2563EB">
                  <path d="M0 0 L45 0 L45 40 C45 70 25 90 0 90 L0 70 C15 70 25 60 25 40 L0 40 Z" />
                  <path d="M55 0 L100 0 L100 40 C100 70 80 90 55 90 L55 70 C70 70 80 60 80 40 L55 40 Z" />
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
              {testimonials.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  style={{
                    width: activeTestimonial === idx ? '32px' : '8px',
                    height: '8px',
                    borderRadius: activeTestimonial === idx ? '9999px' : '50%',
                    backgroundColor: activeTestimonial === idx ? '#2563EB' : (isLight ? '#CBD5E1' : '#1E293B'),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </section>

          {/* 5. PRICING SECTION */}
          <section id="pricing" className="section-container-responsive" style={{ maxWidth: '1140px', margin: '0 auto 120px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                marginBottom: '16px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tarifs Simples &amp; Transparents
                </span>
              </div>
              <h2 className="text-white-heading" style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', letterSpacing: '-0.02em', marginBottom: '14px' }}>
                Un plan adapté à chaque étape de votre entreprise
              </h2>
              <p className="text-muted-desc" style={{ fontSize: '16px', color: isLight ? '#64748B' : '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
                Automatisez vos ventes sur WhatsApp, encaissez par Mobile Money (MTN MoMo, Moov Money, Celtiis Cash) et développez votre chiffre d'affaires.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
              {/* Starter */}
              <div className="relay-card-dark mobile-responsive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Starter
                  </div>
                  <div className="text-muted-desc" style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', minHeight: '38px' }}>
                    Idéal pour les boutiques débutantes et créateurs indépendants.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                    <span className="text-white-heading" style={{ fontSize: '38px', fontWeight: 900, color: isLight ? '#0F172A' : '#ffffff' }}>15,000</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#2563EB' }}>FCFA</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>/ mois</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: isLight ? '#475569' : '#cbd5e1' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> 1 Numéro WhatsApp</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Jusqu'à 500 conversations IA / mois</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Catalogue jusqu'à 25 articles</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Reçus Mobile Money certifiés</li>
                  </ul>
                </div>
                <button 
                  className="relay-btn-outline" 
                  style={{ width: '100%' }}
                  onClick={() => { setSelectedPlan && setSelectedPlan('starter'); setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Démarrer avec Starter
                </button>
              </div>

              {/* Pro Business */}
              <div className="relay-card-dark mobile-responsive-card" style={{ 
                border: '2px solid #2563EB', 
                boxShadow: '0 20px 45px rgba(37, 99, 235, 0.25)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#2563EB',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Plus Populaire
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Pro Business
                  </div>
                  <div className="text-muted-desc" style={{ fontSize: '13px', color: isLight ? '#64748B' : '#94a3b8', marginBottom: '24px', minHeight: '38px' }}>
                    Pour les entreprises actives gérant des commandes quotidiennes.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                    <span className="text-white-heading" style={{ fontSize: '38px', fontWeight: 900, color: isLight ? '#0F172A' : '#ffffff' }}>35,000</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#2563EB' }}>FCFA</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>/ mois</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: isLight ? '#0F172A' : '#ffffff' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Conversations IA illimitées</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Catalogue produits &amp; services complet</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Encaissement auto Mobile Money &amp; Cartes</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Statistiques en direct &amp; Support prioritaire</li>
                  </ul>
                </div>
                <button 
                  className="relay-btn-primary" 
                  style={{ width: '100%', backgroundColor: '#2563EB' }}
                  onClick={() => { setSelectedPlan && setSelectedPlan('pro'); setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Choisir Pro Business
                </button>
              </div>

              {/* Enterprise */}
              <div className="relay-card-dark mobile-responsive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Enterprise
                  </div>
                  <div className="text-muted-desc" style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', minHeight: '38px' }}>
                    Solutions sur-mesure pour cliniques, réseaux d'agences et franchises.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                    <span className="text-white-heading" style={{ fontSize: '38px', fontWeight: 900, color: isLight ? '#0F172A' : '#ffffff' }}>Sur Devis</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: isLight ? '#475569' : '#cbd5e1' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Multi-numéros &amp; Boîte de réception collaborative</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Intégration CRM / ERP / Base interne</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Gestionnaire de compte dédié &amp; SLA</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#2563EB" /> Entraînement sur vos procédures internes</li>
                  </ul>
                </div>
                <button 
                  className="relay-btn-outline" 
                  style={{ width: '100%' }}
                  onClick={() => { setSelectedPlan && setSelectedPlan('enterprise'); setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Contacter l'équipe
                </button>
              </div>
            </div>
          </section>

          {/* 6. FAQ ACCORDION SECTION (Screenshot 3) */}
          <section id="faq" className="section-container-responsive" style={{ maxWidth: '840px', margin: '0 auto 120px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="text-white-heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', letterSpacing: '-0.02em', marginBottom: '14px' }}>
                Des questions ? Nous avons les réponses.
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '22px 4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <span className="text-white-heading" style={{ fontSize: '16.5px', fontWeight: 600, color: isLight ? '#0F172A' : '#ffffff' }}>
                      {faq.q}
                    </span>
                    <span style={{ color: '#2563EB', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {openFaqIndex === idx ? <ChevronUp size={19} color="#2563EB" /> : <ChevronDown size={19} color="#2563EB" />}
                    </span>
                  </div>
                  {openFaqIndex === idx && (
                    <p className="text-muted-desc" style={{ marginTop: '14px', fontSize: '14.5px', color: isLight ? '#64748B' : '#94a3b8', lineHeight: 1.65, margin: '14px 0 0 0' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 7. CALL TO ACTION BAR (Screenshot 2) */}
          <section className="section-container-responsive" style={{ maxWidth: '880px', margin: '0 auto 100px', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div className="hero-cta-buttons-group" style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <button
                className="relay-btn-primary"
                style={{ padding: '16px 40px', fontSize: '16.5px', borderRadius: '10px' }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Commencez à vendre sur WhatsApp dès aujourd'hui
              </button>
            </div>
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '16px' }}>
              Sans carte bancaire requise · Résiliation à tout moment
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: ABOUT PAGE (Screenshot 4 - media_1794429710877_65f278fe.png) */}
      {/* ========================================================================= */}
      {currentSubView === 'about' && (
        <section className="hero-section-responsive" style={{ paddingTop: '150px', paddingBottom: '120px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 className="text-white-heading" style={{
              color: isLight ? '#0F172A' : '#ffffff',
              fontSize: 'clamp(32px, 6.5vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              Conçu pour propulser <span style={{ color: '#2563EB' }}>les entreprises d'Afrique</span>
            </h1>
            <p className="text-muted-desc" style={{
              color: isLight ? '#64748B' : '#94a3b8',
              fontSize: 'clamp(15px, 2vw, 19px)',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto 32px',
              fontWeight: 400
            }}>
              Nous croyons que chaque entrepreneur — de la créatrice de mode à Cotonou au responsable de clinique à Porto-Novo — mérite une équipe commerciale et opérationnelle de classe mondiale. Reflex place cette équipe directement dans WhatsApp, disponible 24h/24.
            </p>
            <div className="hero-cta-buttons-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                className="relay-btn-primary"
                style={{ padding: '14px 34px', fontSize: '15.5px', borderRadius: '10px' }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Commencer
              </button>
              <button
                className="relay-btn-outline"
                style={{ padding: '14px 32px', fontSize: '15.5px', borderRadius: '10px' }}
                onClick={() => navigateTo('home')}
              >
                Retour à l'accueil
              </button>
            </div>
          </div>

          {/* WHY WE BUILT THIS */}
          <div className="mobile-responsive-card" style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0E141D',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '56px 44px',
            marginBottom: '48px',
            boxShadow: isLight ? '0 15px 40px rgba(0,0,0,0.03)' : '0 20px 50px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Pourquoi nous avons créé Reflex
            </div>
            <h2 className="text-white-heading" style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '18px', lineHeight: 1.3 }}>
              En Afrique, le commerce ne se fait pas sur des sites e-commerce lents. Il vit sur WhatsApp.
            </h2>
            <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '18px' }}>
              Pourtant, vendre sur WhatsApp à la main est un calvaire épuisant : des dizaines de messages non lus le soir, des clients qui attendent, des prix à répéter 100 fois par jour, et la vérification manuelle stressante des captures d'écran Mobile Money.
            </p>
            <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
              Reflex a été conçu pour résoudre exactement ce problème : donner à chaque PME béninoise et africaine un vendeur IA ultra-compétent qui accueille les clients, présente les produits en FCFA, et génère des liens de paiement Mobile Money certifiés instantanément.
            </p>
          </div>

          {/* 3 Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="relay-card-dark mobile-responsive-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Zap size={22} />
              </div>
              <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>WhatsApp-First</h3>
              <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Zéro friction : pas de formulaire à remplir, pas de compte à créer pour vos clients. Toute l'expérience d'achat se fait dans leur discussion habituelle.
              </p>
            </div>

            <div className="relay-card-dark mobile-responsive-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>Paiements Locaux MoMo</h3>
              <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Intégration profonde avec MTN Mobile Money, Moov Money, Celtiis Cash et Wave. Vérification instantanée sans faux reçus.
              </p>
            </div>

            <div className="relay-card-dark mobile-responsive-card">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Users size={22} />
              </div>
              <h3 className="text-white-heading" style={{ fontSize: '19px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', marginBottom: '10px' }}>100% Sensation Humaine</h3>
              <p className="text-muted-desc" style={{ color: isLight ? '#64748B' : '#94a3b8', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                L'IA n'est pas un robot rigide : elle dialogue courtoisement, négocie, renseigne et encaisse exactement comme le meilleur vendeur de votre boutique.
              </p>
            </div>
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: BLOG PAGE (Screenshot 1 & media_1794431011796_4a784b6d.png) */}
      {/* ========================================================================= */}
      {currentSubView === 'blog' && (
        <section className="hero-section-responsive" style={{ paddingTop: '150px', paddingBottom: '120px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1140px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#2563EB',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Blog Reflex
            </div>
            <h1 className="text-white-heading" style={{
              color: isLight ? '#0F172A' : '#ffffff',
              fontSize: 'clamp(32px, 6vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}>
              Conseils &amp; Stratégies pour Commerçants
            </h1>
            <p className="text-muted-desc" style={{
              color: isLight ? '#64748B' : '#94a3b8',
              fontSize: 'clamp(15px, 2vw, 17px)',
              maxWidth: '620px',
              margin: '0 auto 32px',
              lineHeight: 1.6
            }}>
              Guides pratiques, nouveautés et tactiques concrètes pour développer votre entreprise sur WhatsApp au Bénin et en Afrique.
            </p>

            {/* Filter Category Pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {(['Tous', 'Produit', 'Guide', 'Croissance'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setBlogFilter(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: blogFilter === cat 
                      ? '#2563EB' 
                      : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'),
                    color: blogFilter === cat 
                      ? '#ffffff' 
                      : (isLight ? '#475569' : '#94a3b8')
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {filteredBlogPosts.map((post, idx) => (
              <div 
                key={idx}
                className="relay-card-dark mobile-responsive-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '36px 30px'
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    color: '#2563EB',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '6px',
                    marginBottom: '20px'
                  }}>
                    {post.tag}
                  </div>

                  <h2 className="text-white-heading" style={{
                    fontSize: '19px',
                    fontWeight: 700,
                    color: isLight ? '#0F172A' : '#ffffff',
                    lineHeight: 1.4,
                    marginBottom: '14px'
                  }}>
                    {post.title}
                  </h2>

                  <p className="text-muted-desc" style={{
                    fontSize: '14px',
                    color: isLight ? '#64748B' : '#94a3b8',
                    lineHeight: 1.65,
                    marginBottom: '24px'
                  }}>
                    {post.snippet}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '13px',
                  color: '#64748b'
                }}>
                  <span>{post.author} · {post.date}</span>
                  <span style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {post.readTime} →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="relay-btn-outline"
              style={{ padding: '12px 28px', fontSize: '14.5px', borderRadius: '10px' }}
              onClick={() => navigateTo('home')}
            >
              ← Retour à l'accueil
            </button>
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. STRUCTURED FOOTER (Consistent across all sub-views) */}
      {/* ========================================================================= */}
      <footer className="landing-footer-dark" style={{ borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: isLight ? '#F8FAFC' : '#070A0F', padding: '60px 24px 36px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div className="mobile-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '50px' }}>
            
            {/* Brand Col with ONLY Reflex Logo Image */}
            <div className="mobile-footer-brand-col">
              <div 
                style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', cursor: 'pointer' }}
                onClick={() => navigateTo('home')}
              >
                <img 
                  src={isLight ? "/logo-light-bg.png" : "/logo.png"} 
                  alt="Reflex" 
                  style={{ height: '38px', width: 'auto', display: 'block' }} 
                />
              </div>
              <p className="text-muted-desc" style={{ fontSize: '13.5px', color: isLight ? '#64748B' : '#94a3b8', lineHeight: 1.6, maxWidth: '280px', margin: '0 0 16px 0' }}>
                Plateforme d'automatisation des ventes et de relation client par IA sur WhatsApp pour le Bénin et l'Afrique.
              </p>
              <div style={{ fontSize: '13.5px', color: '#2563EB', fontWeight: 600 }}>
                support@reflex.bj
              </div>
            </div>

            {/* PRODUCT Column */}
            <div>
              <div className="text-white-heading" style={{ fontSize: '12px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Produit
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: isLight ? '#64748B' : '#94a3b8' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('home', 'features')}>Fonctionnalités</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('home', 'pricing')}>Tarification</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('home', 'how-it-works')}>Comment ça marche</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('home', 'use-cases')}>Cas d'usage</li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <div className="text-white-heading" style={{ fontSize: '12px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Entreprise
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: isLight ? '#64748B' : '#94a3b8' }}>
                <li style={{ cursor: 'pointer', color: currentSubView === 'about' ? '#2563EB' : 'inherit', fontWeight: currentSubView === 'about' ? 700 : 400 }} onClick={() => navigateTo('about')}>À propos</li>
                <li style={{ cursor: 'pointer', color: currentSubView === 'blog' ? '#2563EB' : 'inherit', fontWeight: currentSubView === 'blog' ? 700 : 400 }} onClick={() => navigateTo('blog')}>Blog</li>
                <li><span style={{ cursor: 'pointer' }}>Politique de Confidentialité</span></li>
                <li><span style={{ cursor: 'pointer' }}>Conditions Générales</span></li>
              </ul>
            </div>

            {/* SUPPORT Column */}
            <div>
              <div className="text-white-heading" style={{ fontSize: '12px', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Support
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: isLight ? '#64748B' : '#94a3b8' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}>Commencer</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('login'); setActiveView('auth'); }}>Se connecter</li>
                <li><a href="mailto:support@reflex.bj" style={{ color: 'inherit', textDecoration: 'none' }}>Contactez-nous</a></li>
                <li style={{ color: '#2563EB', fontWeight: 600 }}>Cotonou, Bénin</li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#64748b' }}>
            <div>© 2026 Reflex Technologies (Bénin). Tous droits réservés.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ cursor: 'pointer' }}>Confidentialité</span>
              <span style={{ cursor: 'pointer' }}>Conditions d'utilisation</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#2563EB',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          aria-label="Back to top"
        >
          ▲
        </button>
      )}

    </div>
  );
}
