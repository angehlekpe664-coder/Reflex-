import { useState } from 'react';
import { Menu, CheckCircle, Zap, ChevronDown, ChevronUp, Globe, Mail, Phone, Play, Grid, ShoppingBag, Store, Building, Receipt, Sparkles, CreditCard, LayoutDashboard, MapPin } from 'lucide-react';

export function LandingPage(props: any) {
  const { currentLang, handleSelectLanguage, setActiveView, setAuthMode, setSelectedPlan, t, showScrollTop, langMenuOpen, setLangMenuOpen, availableLanguages } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  

  return (
    <>
      
        <div className="landing-page-wrapper relay-grid-background" style={{ minHeight: '100vh', overflowX: 'hidden', color: '#ffffff' }}>

          {/* Top Navigation Bar with Relay Clean Dark Style */}
          <header className="main-header" style={{ background: 'rgba(10, 17, 29, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', position: 'fixed', top: 0, left: 0, right: 0, width: '100%', boxSizing: 'border-box', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.png" alt="Reflex Logo" style={{ height: '52px', width: 'auto', borderRadius: '8px' }} />
            </div>

            <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>{t.featuresNav}</a>
              <a href="#pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>{t.pricingNav}</a>
              <a href="#demo-video" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>{t.demoVideoNav}</a>
              <a href="#faq" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>{t.faqNav}</a>

              {/* Interactive Language Selector Dropdown */}
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)', userSelect: 'none' }}
                >
                  <Globe size={14} color="#FF5500" /> {availableLanguages.find((l: any) => l.code === currentLang)?.flag} {availableLanguages.find((l: any) => l.code === currentLang)?.code} ▾
                </div>

                {langMenuOpen && (
                  <div style={{ position: 'absolute', top: '120%', right: 0, backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 12px 35px rgba(0,0,0,0.6)', zIndex: 100, minWidth: '150px' }}>
                    {availableLanguages.map((l: any) => (
                      <div
                        key={l.code}
                        onClick={() => handleSelectLanguage(l.code as any)}
                        style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: currentLang === l.code ? '#FF5500' : '#ffffff', fontWeight: currentLang === l.code ? 700 : 500, backgroundColor: currentLang === l.code ? 'rgba(255,85,0,0.15)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span
                style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => { setAuthMode('login'); setActiveView('auth'); }}
              >
                {t.login}
              </span>

              <button
                className="btn-orange-primary"
                style={{ borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: 600 }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                {t.startFree}
              </button>
            </div>

            <button className="mobile-hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
              <Menu size={24} />
            </button>

            {mobileMenuOpen && (
              <div className="mobile-menu-drawer open">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{t.featuresNav}</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{t.pricingNav}</a>
                <a href="#demo-video" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{t.demoVideoNav}</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{t.faqNav}</a>

                <button
                  className="btn-outline-white"
                  style={{ width: '100%', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); setActiveView('auth'); }}
                >
                  {t.login}
                </button>

                <button
                  className="btn-orange-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('signup'); setActiveView('auth'); }}
                >
                  {t.startFree}
                </button>
              </div>
            )}
          </header>

          {/* Hero Section Relay Match */}
          <div className="hero-section-padding" style={{ padding: '140px 24px 80px', position: 'relative', overflow: 'hidden' }}>

            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
              
              {/* Context Badge matching Relay pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', backgroundColor: 'rgba(255, 85, 0, 0.08)', border: '1px solid rgba(255, 85, 0, 0.25)', marginBottom: '32px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF5500' }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#FF5500', letterSpacing: '0.02em' }}>
                  {currentLang === 'FR' ? "• Nouveau : IA Commerciale & Mobile Money au Bénin" : "• Now live in Benin — Early Access"}
                </span>
              </div>

              {/* Exact Relay Tech 3-Line Headline with Fraunces Italic Accent */}
              <h1 style={{ color: '#ffffff', marginBottom: '24px', lineHeight: 1.15, fontSize: 'clamp(36px, 8vw, 56px)', fontWeight: 700, fontFamily: "var(--font-geist), 'Inter', sans-serif", letterSpacing: '-0.03em', wordBreak: 'keep-all' }}>
                {currentLang === 'FR' ? (
                  <>
                    Automatisez vos ventes,<br />
                    encaissez instantanément,<br />
                    <span className="font-fraunces-italic" style={{ color: '#FF5500', fontSize: 'clamp(40px, 9vw, 64px)', fontWeight: 400 }}>directement sur WhatsApp</span>
                  </>
                ) : (
                  <>
                    Automate your sales,<br />
                    collect instant payments,<br />
                    <span className="font-fraunces-italic" style={{ color: '#FF5500', fontSize: 'clamp(40px, 9vw, 64px)', fontWeight: 400 }}>directly on WhatsApp</span>
                  </>
                )}
              </h1>

              <p style={{ color: '#94a3b8', maxWidth: '720px', margin: '0 auto 36px', fontSize: '17.5px', lineHeight: 1.6, fontWeight: 400 }}>
                {currentLang === 'FR'
                  ? "Transformez de simples conversations en chiffre d'affaires. Reflex dote votre entreprise d'une IA qui répond 24h/24, gère vos commandes et encaisse via Mobile Money — 100% en automatique."
                  : "Turn simple conversations into revenue. Reflex gives your business an AI that responds 24/7, handles orders, and collects Mobile Money payments — 100% automatically."}
              </p>

              {/* CTA Buttons Matching Relay Tech */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="btn-orange-primary"
                  style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '8px', fontWeight: 600, border: 'none', backgroundColor: '#FF5500', color: '#ffffff', cursor: 'pointer' }}
                  onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
                >
                  {currentLang === 'FR' ? 'Commencer gratuitement' : 'Get Started'}
                </button>
                
                <a
                  href="#demo-video"
                  className="btn-demo-secondary"
                >
                  {currentLang === 'FR' ? 'Voir la démo' : 'See How It Works'}
                </a>
              </div>

              {/* Relay Sub-caption Guarantee */}
              <div style={{ color: '#64748b', fontSize: '13px', marginTop: '20px', fontWeight: 400 }}>
                {currentLang === 'FR' ? 'Sans carte bancaire · Annulation à tout moment' : 'No credit card required · Cancel anytime'}
              </div>

            </div>
          </div>

          {/* VIDEO DEMO SHOWCASE SECTION */}
          <div id="demo-video" style={{ maxWidth: '1080px', margin: '0 auto 80px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div className="glass-card-dark" style={{ padding: '24px', borderRadius: '24px', border: '1px solid rgba(255, 85, 0, 0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', textAlign: 'center' }}>
              {/* Clean Video Player Frame */}
              <div style={{
                maxWidth: '920px',
                margin: '0 auto',
                aspectRatio: '16/9',
                background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'#ff5500\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                borderRadius: '16px',
                border: '1px solid rgba(255, 85, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#FF5500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(255, 85, 0, 0.7)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}>
                  <Play size={36} color="#ffffff" fill="#ffffff" style={{ marginLeft: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* RELAY MATCH 1: 3-STEP PROCESS SECTION ("Up and running in 15 minutes") */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 className="font-outfit" style={{ fontSize: '46px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {currentLang === 'FR' ? (
                  <>Opérationnel en <span style={{ color: '#FF5500' }}>15 minutes</span></>
                ) : (
                  <>Up and running in <span style={{ color: '#FF5500' }}>15 minutes</span></>
                )}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '17px', maxWidth: '680px', margin: '14px auto 0', lineHeight: 1.6 }}>
                {currentLang === 'FR'
                  ? "Aucune connaissance technique requise. Si vous savez envoyer un message WhatsApp, vous savez utiliser Reflex."
                  : "No technical knowledge needed. If you can send a WhatsApp message, you can use Reflex."}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* STEP 01 */}
              <div className="step-card-hover" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#FF5500', fontFamily: 'var(--font-geist), sans-serif', lineHeight: 1 }}>01</div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Connectez votre WhatsApp" : "Connect Your WhatsApp"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.65 }}>
                  {currentLang === 'FR'
                    ? "Liez votre numéro en un clic. Vos clients vous joignent exactement comme avant — rien ne change pour eux."
                    : "Link your number in one click. Your customers reach you exactly as before — nothing changes on their end."}
                </p>
              </div>

              {/* STEP 02 */}
              <div className="step-card-hover" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#FF5500', fontFamily: 'var(--font-geist), sans-serif', lineHeight: 1 }}>02</div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Grid size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Configurez votre Offre" : "Set Up Your Offering"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.65 }}>
                  {currentLang === 'FR'
                    ? "Ajoutez vos produits, vos services ou décrivez votre activité. Fixez vos prix. L’IA apprend votre métier et répond aux questions."
                    : "Add products, list services, or describe what you do. Set prices and availability. The AI learns your business and handles questions."}
                </p>
              </div>

              {/* STEP 03 */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#FF5500', fontFamily: 'var(--font-geist), sans-serif', lineHeight: 1 }}>03</div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Servez, Livrez & Encaissez" : "Serve, Deliver & Get Paid"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.65 }}>
                  {currentLang === 'FR'
                    ? "L’IA répond 24h/24 et 7j/7 — réservation, enregistrement des commandes, réponses. Vous êtes notifié. Paiement encaissé directement par Mobile Money."
                    : "AI responds to enquiries 24/7 — booking services, taking orders, answering questions. You get notified. Payment collected inside the chat."}
                </p>
              </div>
            </div>
          </div>

          {/* RELAY MATCH 2: USE CASES GRID ("Products, services, or anything in between") */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 className="font-outfit" style={{ fontSize: '46px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {currentLang === 'FR' ? (
                  <>Produits, services, ou <span style={{ color: '#FF5500' }}>tout le reste</span></>
                ) : (
                  <>Products, services, or <span style={{ color: '#FF5500' }}>anything in between</span></>
                )}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '17px', maxWidth: '720px', margin: '14px auto 0', lineHeight: 1.6 }}>
                {currentLang === 'FR'
                  ? "Que vous vendiez des vêtements, gériez un restaurant, une clinique ou une agence — Reflex gère tout directement sur WhatsApp."
                  : "Whether you sell jollof, run a clinic, or manage land registrations — Reflex handles it all through WhatsApp."}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* CARD 1: Fashion & Retail */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Mode & Commerce" : "Fashion & Retail"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentLang === 'FR'
                    ? "Partagez vos catalogues, prenez les commandes, gériez les tailles et encaissez vos paiements — sans quitter WhatsApp."
                    : "Share catalogues, take orders, handle size queries, and collect payments — all without leaving WhatsApp."}
                </p>
              </div>

              {/* CARD 2: Food & Catering (Popular) */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 85, 0, 0.4)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(255, 85, 0, 0.15)', border: '1px solid rgba(255, 85, 0, 0.4)', color: '#FF5500', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular</span>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Restauration & Traiteurs" : "Food & Catering"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentLang === 'FR'
                    ? "Gériez vos menus, prenez des précommandes, confirmez les réservations et envoyez le suivi des livraisons automatiquement."
                    : "Manage menus, take pre-orders, confirm bookings, and send delivery updates — hands-free."}
                </p>
              </div>

              {/* CARD 3: Schools & Academies (Enterprise) */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise</span>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Écoles & Académies" : "Schools & Academies"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentLang === 'FR'
                    ? "Traitez les demandes d’admission, partagez les résultats, envoyez les rappels de frais et encaissez les écolages automatiquement."
                    : "Handle admissions enquiries, share results, send fee reminders, and collect payments automatically."}
                </p>
              </div>

              {/* CARD 4: Professional Services */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Services Professionnels" : "Professional Services"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentLang === 'FR'
                    ? "Consultants, avocats, comptables — envoyez vos devis, planifiez des rendez-vous et relancez vos factures."
                    : "Consultants, lawyers, accountants — quote, schedule appointments, follow up, and invoice clients automatically."}
                </p>
              </div>

              {/* CARD 5: Records & Status Enquiries */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise</span>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Gestion des Demandes & Suivis" : "Records & Status Enquiries"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentLang === 'FR'
                    ? "Agences, coopératives, services publics — permettez aux clients de suivre l'avancement de leur dossier par simple message."
                    : "Any organisation with records — agencies, registries, cooperatives — let people text in to check status, track progress, or request docs."}
                </p>
              </div>

              {/* CARD 6: Health & Wellness */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                  {currentLang === 'FR' ? "Santé & Bien-être" : "Health & Wellness"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                  {currentLang === 'FR'
                    ? "Prise de rendez-vous, rappels de soins, résultats d'analyses et réponse aux questions des patients sans personnel supplémentaire."
                    : "Book appointments, send medication reminders, share lab results, and manage patient queries without extra staff."}
                </p>
              </div>
            </div>
          </div>

          {/* RELAY MATCH 3: TESTIMONIALS SECTION ("Impactful Successes") */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="font-outfit" style={{ fontSize: '46px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {currentLang === 'FR' ? (
                  <>Résultats & <span className="font-fraunces-italic" style={{ color: '#FF5500', fontSize: '52px', fontWeight: 400 }}>Témoignages</span></>
                ) : (
                  <>Impactful <span className="font-fraunces-italic" style={{ color: '#FF5500', fontSize: '52px', fontWeight: 400 }}>Successes</span></>
                )}
              </h2>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', borderRadius: '24px', border: '1px solid rgba(255, 85, 0, 0.3)', padding: '60px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
              {/* Giant Left Quote SVG */}
              <div style={{ fontSize: '140px', lineHeight: 0.6, color: '#FF5500', opacity: 0.35, fontFamily: 'serif', userSelect: 'none' }}>“</div>

              <div style={{ flex: 1, minWidth: '280px', textAlign: 'left' }}>
                <p style={{ fontSize: '22px', color: '#ffffff', lineHeight: 1.6, fontWeight: 500, fontStyle: 'italic', marginBottom: '24px' }}>
                  {currentLang === 'FR'
                    ? "« Avant Reflex, je passais 3 heures chaque soir à répondre aux messages des clients. L'IA gère maintenant 90% des demandes. J'ai enfin pu passer des soirées sereines. »"
                    : "“I used to spend 3 hours every evening replying to customer messages. Reflex handles 90% of it. I actually slept last night.”"}
                </p>
                <div style={{ color: '#FF5500', fontWeight: 700, fontSize: '18px' }}>Amina Sow</div>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>AO Fashion Boutique, Cotonou</div>
              </div>

              {/* Giant Right Quote SVG */}
              <div style={{ fontSize: '140px', lineHeight: 0.6, color: '#FF5500', opacity: 0.35, fontFamily: 'serif', userSelect: 'none' }}>”</div>
            </div>

            {/* Carousel Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              <span style={{ width: '28px', height: '8px', borderRadius: '9999px', backgroundColor: '#FF5500' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>



          {/* MOBILE MONEY PAYMENT DEMO BAR */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div className="font-outfit" style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{t.momoSupportTitle}</div>
                <div style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '4px' }}>{t.momoSupportSub}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#FFCC00', color: '#000000', fontWeight: 800, padding: '8px 16px', borderRadius: '10px', fontSize: '13px', boxShadow: '0 4px 12px rgba(255,204,0,0.25)' }}>MTN MoMo (*139#)</span>
                <span style={{ backgroundColor: '#0055A5', color: '#ffffff', fontWeight: 800, padding: '8px 16px', borderRadius: '10px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,85,165,0.25)' }}>Moov Money (*155#)</span>
                <span style={{ backgroundColor: '#1DC3F4', color: '#ffffff', fontWeight: 800, padding: '8px 16px', borderRadius: '10px', fontSize: '13px', boxShadow: '0 4px 12px rgba(29,195,244,0.25)' }}>Wave App</span>
              </div>
            </div>
          </div>

          {/* 4 KEY FEATURES GRID WITH GLASSMORPHISM & MOTION HOVER */}
          <div id="features" style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <span className="font-outfit" style={{ color: '#FF8800', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.featuresNav}</span>
              <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '8px' }}>
                {t.featuresTitle}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              
              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.25), rgba(230, 57, 0, 0.25))', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(255, 85, 0, 0.35)' }}>
                  <Zap size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{t.featAutoReplyTitle}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {t.featAutoReplyDesc}
                </p>
              </div>

              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(255, 136, 0, 0.25), rgba(245, 158, 11, 0.25))', color: '#FF8800', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(255, 136, 0, 0.35)' }}>
                  <CreditCard size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{t.featMobileMoneyTitle}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {t.featMobileMoneyDesc}
                </p>
              </div>

              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.25))', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
                  <Receipt size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{t.featSecurityTitle}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {t.featSecurityDesc}
                </p>
              </div>

              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                  <LayoutDashboard size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{t.featCatalogTitle}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {t.featCatalogDesc}
                </p>
              </div>

            </div>
          </div>

          {/* REAL PME STORY BANNER */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div className="pme-story-bg" style={{ borderRadius: '24px', padding: '60px 48px', border: '1px solid rgba(255, 85, 0, 0.35)', overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(9,13,22,0.98))' }}>
              <div style={{ maxWidth: '640px' }}>
                <span className="font-outfit" style={{ color: '#FF5500', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CAS CONCRET • BOUTIQUE COTONOU</span>
                <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '10px', marginBottom: '20px', fontSize: '36px' }}>
                  "J'ai multiplié mes ventes par 3 sans recruter de vendeurs."
                </h2>
                <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '28px' }}>
                  Avant Reflex, Amara manquait des dizaines de messages clients le soir. Aujourd'hui, l'IA présente les articles du catalogue, fournit les prix en FCFA et encaisse directement par Mobile Money même pendant qu'elle dort.
                </p>

                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                  <div>
                    <div className="font-outfit" style={{ fontSize: '32px', fontWeight: 800, color: '#FF5500' }}>+300%</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Chiffre d'affaires MoMo</div>
                  </div>
                  <div>
                    <div className="font-outfit" style={{ fontSize: '32px', fontWeight: 800, color: '#FF8800' }}>&lt; 2 sec</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Temps de réponse client</div>
                  </div>
                  <div>
                    <div className="font-outfit" style={{ fontSize: '32px', fontWeight: 800, color: '#06b6d4' }}>100%</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Reçus certifiés générés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* PRICING PLANS SECTION (STYLÉ, HIGH-TECH & RESPONSIVE) */}
          <div id="pricing" style={{ maxWidth: '1200px', margin: '0 auto 120px', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', backgroundColor: 'rgba(255, 85, 0, 0.08)', border: '1px solid rgba(255, 85, 0, 0.25)', marginBottom: '16px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF5500' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FF5500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {currentLang === 'FR' ? 'TARIFS SIMPLES & TRANSPARENTS' : 'SIMPLE & TRANSPARENT PRICING'}
                </span>
              </div>
              <h2 className="headline-lg" style={{ color: '#ffffff', fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                {currentLang === 'FR' ? 'Un plan adapté à chaque étape de votre PME' : 'A plan designed for every stage of your business'}
              </h2>
              <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
                {currentLang === 'FR' 
                  ? 'Automatisez vos ventes sur WhatsApp, encaissez par Mobile Money et développez votre chiffre d’affaires en toute simplicité.'
                  : 'Automate sales on WhatsApp, accept Mobile Money payments and scale your business effortlessly.'}
              </p>
            </div>

            {/* Responsive Grid 3 Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
              
              {/* Plan 1: Starter - 15 000 FCFA / mois */}
              <div className="feature-card-hover" style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {currentLang === 'FR' ? 'Starter / Débutant' : 'Starter'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', minHeight: '38px' }}>
                    {currentLang === 'FR' ? 'Pour les petites boutiques et créateurs qui se lancent.' : 'Ideal for small shops and new merchants.'}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>15 000</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#FF5500' }}>FCFA</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>/ {currentLang === 'FR' ? 'mois' : 'month'}</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px', marginBottom: '32px' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '13.5px', marginBottom: '16px' }}>
                      {currentLang === 'FR' ? 'Ce qui est inclus :' : 'What is included:'}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#cbd5e1' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Jusqu'à <strong>100 ventes conclues</strong> / mois</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Jusqu'à <strong>1 500 000 FCFA</strong> encaissés</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>1 Numéro WhatsApp Business connecté</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Assistant IA commercial 24/7 (GPT-4o)</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Catalogue jusqu'à 20 produits</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Reçus de paiement PDF certifiés</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Support par email & ticket</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan({ name: 'Starter', price: 15000 });
                    setAuthMode('signup');
                    setActiveView('auth');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {currentLang === 'FR' ? 'Choisir le plan Starter' : 'Choose Starter'}
                </button>
              </div>

              {/* Plan 2: Pro / Croissance - 50 000 FCFA / mois (POPULAIRE) */}
              <div className="feature-card-hover" style={{
                backgroundColor: '#0F172A',
                border: '2px solid #FF5500',
                borderRadius: '24px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 20px 45px rgba(255, 85, 0, 0.22)'
              }}>
                {/* Badge Populaire */}
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#FF5500',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 15px rgba(255, 85, 0, 0.45)',
                  whiteSpace: 'nowrap'
                }}>
                  {currentLang === 'FR' ? 'LE PLUS POPULAIRE' : 'MOST POPULAR'}
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FF5500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {currentLang === 'FR' ? 'Pro / Croissance' : 'Pro Growth'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px', minHeight: '38px' }}>
                    {currentLang === 'FR' ? 'Pour les PME actives voulant automatiser 100% de leurs ventes.' : 'For growing businesses automating 100% of sales.'}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '42px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>50 000</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#FF5500' }}>FCFA</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>/ {currentLang === 'FR' ? 'mois' : 'month'}</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 85, 0, 0.25)', paddingTop: '24px', marginBottom: '32px' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '13.5px', marginBottom: '16px' }}>
                      {currentLang === 'FR' ? 'Tout le plan Starter, plus :' : 'Everything in Starter, plus:'}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#ffffff' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span><strong>Ventes conclues illimitées</strong></span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Jusqu'à <strong>10 000 000 FCFA</strong> encaissements / mois</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Catalogue & produits <strong>illimités</strong></span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Prise en main humaine 1-clic dans l'Inbox Live</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Relances automatiques de paniers abandonnés</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Personnalisation du logo sur les reçus</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#FF5500" />
                        <span>Support prioritaire WhatsApp 7j/7</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan({ name: 'Pro', price: 50000 });
                    setAuthMode('signup');
                    setActiveView('auth');
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#FF5500',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(255, 85, 0, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                >
                  {currentLang === 'FR' ? 'Commencer le Plan Pro →' : 'Start Pro Plan →'}
                </button>
              </div>

              {/* Plan 3: Enterprise / Illimité - 100 000 FCFA / mois */}
              <div className="feature-card-hover" style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {currentLang === 'FR' ? 'Enterprise / Illimité' : 'Enterprise'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', minHeight: '38px' }}>
                    {currentLang === 'FR' ? 'Pour les réseaux de vente, franchises et grands comptes.' : 'For multi-location brands and large networks.'}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>100 000</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>FCFA</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>/ {currentLang === 'FR' ? 'mois' : 'month'}</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px', marginBottom: '32px' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '13.5px', marginBottom: '16px' }}>
                      {currentLang === 'FR' ? 'Fonctionnalités avancées :' : 'Advanced features:'}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#cbd5e1' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span><strong>Ventes & Encaissements illimités</strong></span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span>Multi-numéros WhatsApp (jusqu'à 5 numéros)</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span>Agrégation Mobile Money & Cartes sur mesure</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span>Paramétrage IA sur-mesure par un expert</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span>Intégrations API & Webhooks personnalisés</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span>Garantie de service SLA 99,9%</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color="#38bdf8" />
                        <span>Support VIP Dédié 24/7 & Account Manager</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan({ name: 'Enterprise', price: 100000 });
                    setAuthMode('signup');
                    setActiveView('auth');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {currentLang === 'FR' ? 'Choisir le plan Enterprise' : 'Choose Enterprise'}
                </button>
              </div>

            </div>
          </div>

          {/* INTERACTIVE FAQ ACCORDION SECTION */}
          <div id="faq" style={{ maxWidth: '880px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <span className="font-outfit" style={{ color: '#FF8800', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.faqTitle}</span>
              <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '8px' }}>
                {t.faqSub}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  q: t.faqQ1,
                  a: t.faqA1
                },
                {
                  q: t.faqQ2,
                  a: t.faqA2
                },
                {
                  q: t.faqQ3,
                  a: t.faqA3
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="faq-accordion-item"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  style={{ cursor: 'pointer', padding: '20px 24px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>
                    <span>{faq.q}</span>
                    {openFaqIndex === idx ? <ChevronUp size={18} color="#FF5500" /> : <ChevronDown size={18} color="#94a3b8" />}
                  </div>

                  {openFaqIndex === idx && (
                    <p style={{ marginTop: '12px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, margin: '12px 0 0 0' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RELAY MATCH CONVERSION CTA BANNER */}
          <div style={{ maxWidth: '1000px', margin: '0 auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{
              backgroundColor: '#0F172A',
              borderRadius: '24px',
              border: '1px solid rgba(255, 85, 0, 0.35)',
              padding: '60px 32px',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 0%, rgba(255, 85, 0, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
              <h2 className="font-outfit" style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', marginBottom: '16px', lineHeight: 1.25 }}>
                {currentLang === 'FR' ? 'Prêt à transformer votre entreprise ?' : 'Ready to Transform Your Business?'}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '16.5px', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                {currentLang === 'FR'
                  ? 'Rejoignez des centaines d’entrepreneurs qui utilisent Reflex pour développer leur activité sur WhatsApp — au Bénin et dans toute l’Afrique.'
                  : 'Join hundreds of entrepreneurs using Reflex to grow their businesses on WhatsApp — across Africa and beyond.'}
              </p>
              <button
                className="cta-design-button"
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                {currentLang === 'FR' ? 'Commencer à vendre sur WhatsApp dès aujourd’hui' : 'Start Selling on WhatsApp Today'}
              </button>
              <div style={{ color: '#64748b', fontSize: '13.5px', marginTop: '16px' }}>
                {currentLang === 'FR' ? 'Sans carte bancaire · Annulation à tout moment' : 'No credit card required · Cancel anytime'}
              </div>
            </div>
          </div>

          {/* DUAL DESKTOP & MOBILE RESPONSIVE FOOTER */}
          <footer className="landing-footer-section" style={{ borderTop: '1px solid rgba(255, 85, 0, 0.3)', backgroundColor: '#060911' }}>
            <div className="footer-glow-line" style={{ background: 'linear-gradient(90deg, #FF5500, #FF8800, #06b6d4)' }} />

            <div className="desktop-footer-only">
              <div className="grid-responsive-footer" style={{ maxWidth: '1140px', margin: '0 auto 40px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <img src="/logo.png" alt="Reflex Logo" style={{ height: '56px', width: 'auto', borderRadius: '10px' }} />
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '300px', marginBottom: '16px' }}>
                    {t.footerDesc}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ backgroundColor: 'rgba(255,85,0,0.12)', border: '1px solid rgba(255,85,0,0.3)', padding: '5px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#FF5500', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={12} color="#FF5500" /> Cotonou, Bénin
                    </span>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '5px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#06b6d4', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Zap size={12} color="#06b6d4" /> 24/7 Active
                    </span>
                  </div>
                </div>

                <div>
                  <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>{t.featuresNav}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#cbd5e1' }}>
                    <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('landing')}>{t.featuresNav}</li>
                    <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('payment-checkout')}>{t.featMobileMoneyTitle}</li>
                    <li style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}>{t.startFree}</li>
                  </ul>
                </div>

                <div>
                  <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>Paiements</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#cbd5e1' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF8800' }} /> MTN Mobile Money</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF5500' }} /> Moov Money</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#06b6d4' }} /> Wave & Cartes</li>
                  </ul>
                </div>

                <div>
                  <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>Contact</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#cbd5e1' }}>
                    <li style={{ color: '#FF5500', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> support@reflex.bj</li>
                    <li style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> +229 97 00 00 00</li>
                  </ul>
                </div>
              </div>

              <div style={{ maxWidth: '1140px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#94a3b8' }}>
                <div>© 2026 <strong>Reflex</strong>. {t.footerRights}</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ cursor: 'pointer', color: '#cbd5e1' }}>{t.footerSecurityNotice}</span>
                </div>
              </div>
            </div>

            <div className="mobile-footer-only">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <img src="/logo.png" alt="Reflex Logo" style={{ height: '48px', width: 'auto', borderRadius: '8px' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 auto 12px', maxWidth: '280px', lineHeight: 1.4 }}>
                  {t.footerDesc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                <div>© 2026 <strong>Reflex</strong>. {t.footerRights}</div>
              </div>
            </div>
          </footer>

          {/* Floating Back to Top Button */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                backgroundColor: '#FF5500',
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
                boxShadow: '0 10px 25px rgba(255, 85, 0, 0.45)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              aria-label="Remonter en haut"
            >
              ▲
            </button>
          )}



        </div>
      
    </>
  );
}
