import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  Grid,
  Settings,
  Sparkles,
  Send,
  AlertTriangle,
  Bell,
  Home,
  Menu,
  ArrowRight,
  Bot,
  Radio,
  User,
  Mail,
  Lock,
  Building,
  Store,
  Globe,
  Smartphone,
  Plus,
  Trash2,
  CheckCircle,
  Zap,
  Play,
  Shield,
  Receipt
} from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  // Navigation Flow State
  const [activeView, setActiveView] = useState<
    'landing' | 'auth' | 'onboarding-entreprise' | 'onboarding-catalogue' | 'onboarding-assistant' | 'onboarding-whatsapp' | 'dashboard' | 'mobile-dash' | 'payment-checkout'
  >('landing');

  // Selected Order for Checkout Payment
  const [currentCheckoutOrder] = useState({
    id: 'ORD-229-892',
    pmeName: 'Boutique Élégance Bénin',
    item: 'Perruque Brésilienne 18 pouces',
    amount: 45000,
    customerPhone: '+229 97 45 12 89',
    customerName: 'Koffi Mensah'
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMomoProvider, setSelectedMomoProvider] = useState<'mtn' | 'moov' | 'wave' | 'kkiapay'>('mtn');
  const [payerPhone, setPayerPhone] = useState('97451289');

  // Supabase Auth Form State
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  // Onboarding Form States
  const [companyData, setCompanyData] = useState({
    name: 'Boutique Élégance Bénin',
    sector: 'Mode & Vêtements',
    phone: '+229 97 00 00 00',
    description: 'Vente de vêtements de luxe, perruques et accessoires de mode à Cotonou.'
  });

  const [productsList, setProductsList] = useState([
    { name: 'Perruque Brésilienne 18 pouces', price: 45000, category: 'Perruques', description: 'Cheveux 100% naturels' },
    { name: 'Sac à main en cuir artisanal', price: 25000, category: 'Accessoires', description: 'Fait main au Bénin' }
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Mode', description: '' });

  const [assistantConfig, setAssistantConfig] = useState({
    tone: 'Chaleureux & Commercial',
    welcomeMessage: 'Bonjour ! Bienvenue chez Boutique Élégance. Que puis-je faire pour vous aujourd\'hui ?',
    deliveryInfo: 'Livraison sous 24h à Cotonou, Calavi et Porto-Novo.'
  });

  // Active Dashboard Sidebar Tab State
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'Vue d\'ensemble' | 'Activité WhatsApp' | 'Commandes' | 'Paiements' | 'Catalogue' | 'Paramètres'
  >('Vue d\'ensemble');

  // Live WhatsApp Simulator State
  const [simUserMessage, setSimUserMessage] = useState('');
  const [simChatHistory, setSimChatHistory] = useState<Array<{ sender: 'client' | 'bot'; text: string; time: string }>>([
    { sender: 'client', text: 'Bonjour, est-ce que vos perruques sont disponibles et quels sont vos prix ?', time: '14:20' },
    { sender: 'bot', text: 'Bonjour ! Bienvenue chez Boutique Élégance Bénin. 😊 Oui ! Nous avons la "Perruque Brésilienne 18 pouces" à 45 000 FCFA. Souhaitez-vous passer commande ?\n\n💳 Lien de paiement Mobile Money : http://localhost:5173/pay/ORD-229-892', time: '14:20' }
  ]);
  const [simLoading, setSimLoading] = useState(false);

  // Backend Integration State
  const [backendConnected, setBackendConnected] = useState(false);
  const [liveStats, setLiveStats] = useState({
    conversations: 4302,
    autoAiPercent: 87,
    commandes: 34,
    revenusFcfa: 1245000,
    conversionPercent: 25
  });

  const [recentOrdersList, setRecentOrdersList] = useState<any[]>([
    {
      id: 'ORD-229-892',
      name: 'Koffi Mensah',
      phone: '+229 97 45 12 89',
      time: '10:42 AM',
      status: 'PAID',
      amount: 45000,
      item: 'Perruque Brésilienne 18 pouces',
      avatar: 'KM',
      chipText: 'Commande prête',
      chipType: 'green',
      summary: 'Paiement Kkiapay Mobile Money confirmé (45,000 FCFA). Livraison prévue cet après-midi à Cotonou Ganhi.'
    },
    {
      id: 'ORD-229-410',
      name: 'Aminata Diallo',
      phone: '+229 96 11 22 33',
      time: 'Il y a 10 min',
      avatar: 'AM',
      chipText: 'À suivre',
      chipType: 'amber',
      amount: 25000,
      item: 'Sac à main en cuir artisanal',
      summary: 'Intéressée par le sac en cuir. A besoin d\'informations sur la livraison avant d\'effectuer le paiement.'
    }
  ]);

  // Real-time Backend API Polling
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setBackendConnected(true);
          if (data.stats) {
            setLiveStats({
              conversations: data.stats.totalMessages || 4302,
              autoAiPercent: 87,
              commandes: data.recentOrders ? data.recentOrders.length + 33 : 34,
              revenusFcfa: data.stats.totalRevenue || 1245000,
              conversionPercent: Math.min(Math.round(data.stats.conversionRate * 3), 100) || 25
            });
          }
          if (data.recentOrders && data.recentOrders.length > 0) {
            const mappedOrders = data.recentOrders.map((ord: any) => ({
              id: ord.id || `ORD-${Math.floor(Math.random() * 1000)}`,
              name: ord.customerName || 'Client WhatsApp',
              phone: ord.phone || '+229 97 00 00 00',
              time: ord.time || 'Récemment',
              amount: ord.amount || 25000,
              item: ord.item || 'Article Catalogue',
              avatar: ord.customerName ? ord.customerName.substring(0, 2).toUpperCase() : 'WA',
              chipText: ord.status === 'PAID' ? 'Commande prête' : 'À suivre',
              chipType: ord.status === 'PAID' ? 'green' : 'amber',
              summary: ord.summary?.conclusion || ord.lastMsg || 'Nouvelle commande enregistrée par l\'IA.'
            }));
            setRecentOrdersList(mappedOrders);
          }
        }
      } catch {
        setBackendConnected(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen ONLY for explicit Supabase OAuth redirect (Google Sign-In return)
  useEffect(() => {
    const isOAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code');
    
    if (isOAuthReturn) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setFullName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '');
          setEmail(session.user.email || '');
          setActiveView('onboarding-entreprise');
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && isOAuthReturn) {
        setFullName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '');
        setEmail(session.user.email || '');
        setActiveView('onboarding-entreprise');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Submit Onboarding to Backend
  const handleFinalizeOnboarding = async () => {
    try {
      await fetch('http://localhost:3000/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyData,
          productsList,
          assistantConfig
        })
      });
    } catch {
      console.log('Mode démo local activé');
    }
    setActiveView('dashboard');
  };

  // Supabase Signup / Login Handler with Email Inbox Notice
  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setEmailSentNotice(false);

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setEmailSentNotice(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setActiveView('onboarding-entreprise');
      }
    } catch {
      setActiveView('onboarding-entreprise');
    } finally {
      setAuthLoading(false);
    }
  };

  // Supabase Google Auth Handler
  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch {
      setActiveView('onboarding-entreprise');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    setProductsList([...productsList, {
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'Général',
      description: newProduct.description || ''
    }]);
    setNewProduct({ name: '', price: '', category: 'Mode', description: '' });
  };

  const handleDeleteProduct = (index: number) => {
    setProductsList(productsList.filter((_, i) => i !== index));
  };

  // Test WhatsApp Simulator Message Send
  const handleSendSimMessage = async () => {
    if (!simUserMessage.trim()) return;
    const msgText = simUserMessage;
    const timeNow = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    setSimChatHistory(prev => [...prev, { sender: 'client', text: msgText, time: timeNow }]);
    setSimUserMessage('');
    setSimLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/test-wa-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText: msgText })
      });
      if (response.ok) {
        const data = await response.json();
        setSimChatHistory(prev => [...prev, { sender: 'bot', text: data.aiResponse, time: timeNow }]);
      } else {
        const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
        setSimChatHistory(prev => [...prev, {
          sender: 'bot',
          text: `Parfait ! Voici le récapitulatif pour ${companyData.name}.\n\n💳 *Lien de règlement Mobile Money sécurisé* :\nhttp://localhost:5173/pay/${orderId}`,
          time: timeNow
        }]);
      }
    } catch {
      const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
      setSimChatHistory(prev => [...prev, {
        sender: 'bot',
        text: `Parfait ! Voici votre lien de paiement :\n💳 http://localhost:5173/pay/${orderId}`,
        time: timeNow
      }]);
    } finally {
      setSimLoading(false);
    }
  };

  // Process Mobile Money Checkout Payment
  const handleProcessPayment = () => {
    setPaymentSuccess(true);
    // Add to recent orders list
    setRecentOrdersList(prev => [
      {
        id: currentCheckoutOrder.id,
        name: currentCheckoutOrder.customerName,
        phone: `+229 ${payerPhone}`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'PAID',
        amount: currentCheckoutOrder.amount,
        item: currentCheckoutOrder.item,
        avatar: currentCheckoutOrder.customerName.substring(0, 2).toUpperCase(),
        chipText: 'Commande prête',
        chipType: 'green',
        summary: `Paiement ${selectedMomoProvider.toUpperCase()} réussi. Reçu généré et envoyé sur WhatsApp.`
      },
      ...prev
    ]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-bg)', fontFamily: 'var(--font-geist)' }}>

      {/* ========================================================================= */}
      {/* 1. ENRICHED RICH LANDING PAGE WITH DEMO & FOOTER */}
      {/* ========================================================================= */}
      {activeView === 'landing' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', position: 'relative', overflowX: 'hidden' }}>

          {/* Dancing WhatsApp background logos */}
          <div className="whatsapp-motion-container">
            <svg className="wa-float-icon wa-float-1" width="56" height="56" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <svg className="wa-float-icon wa-float-2" width="68" height="68" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </div>

          {/* Clean Top Navigation Bar */}
          <header style={{ padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '38px', width: 'auto', borderRadius: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30', letterSpacing: '-0.02em' }}>Reflex</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: backendConnected ? '#10B981' : '#F59E0B' }}>
                <Radio size={14} />
                <span>{backendConnected ? 'Backend API En Ligne' : 'Mode Démo Standalone'}</span>
              </div>

              <span
                style={{ fontSize: '14px', fontWeight: 500, color: '#45464d', cursor: 'pointer' }}
                onClick={() => { setAuthMode('login'); setActiveView('auth'); }}
              >
                Se connecter
              </span>

              <button
                className="btn-secondary-purple"
                style={{ borderRadius: '8px', padding: '9px 20px' }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Commencer gratuitement
              </button>
            </div>
          </header>

          {/* Hero Section with "Voir la Démo" button */}
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '70px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.jpg" alt="Reflex Intelligent Automation" className="hero-logo-img" />
            </div>

            <h1 className="display-lg" style={{ color: '#0b1c30', fontSize: '48px', lineHeight: 1.15, marginBottom: '20px' }}>
              Votre WhatsApp devient votre <br />meilleur commercial 24/7.
            </h1>

            <p className="body-lg" style={{ color: '#45464d', maxWidth: '720px', margin: '0 auto 36px', lineHeight: 1.6, fontSize: '18px' }}>
              Reflex automatise vos réponses clients, présente vos produits et encaisse par Mobile Money (MTN MoMo, Moov, Wave, Kkiapay) directement sur WhatsApp avec reçus numériques certifiés.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '56px' }}>
              <button
                className="btn-primary-black"
                style={{ padding: '15px 34px', fontSize: '16px' }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Commencer gratuitement <ArrowRight size={18} />
              </button>
              
              <a
                href="#demo-showcase"
                className="btn-outline-white"
                style={{ padding: '15px 30px', fontSize: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Play size={18} color="#4b41e1" /> Voir la Démo
              </a>
            </div>
          </div>

          {/* 4 KEY FEATURES GRID */}
          <div style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px' }}>
            <h2 className="headline-lg" style={{ textAlign: 'center', color: '#0b1c30', marginBottom: '40px' }}>
              Tout ce dont votre PME a besoin pour exploser ses ventes sur WhatsApp
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff4ff', color: '#4b41e1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Zap size={24} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0b1c30', marginBottom: '8px' }}>IA Commerciale 24/7</h3>
                <p style={{ fontSize: '13px', color: '#45464d', lineHeight: 1.5 }}>
                  Réponses instantanées en moins de 3 secondes adaptées au ton de votre boutique.
                </p>
              </div>

              <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <CreditCard size={24} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0b1c30', marginBottom: '8px' }}>Paiement Mobile Money</h3>
                <p style={{ fontSize: '13px', color: '#45464d', lineHeight: 1.5 }}>
                  Envoie automatiquement un lien de paiement MTN MoMo, Moov Money et Wave à la conclusion de l'accord.
                </p>
              </div>

              <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Receipt size={24} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0b1c30', marginBottom: '8px' }}>Reçus SHA-256</h3>
                <p style={{ fontSize: '13px', color: '#45464d', lineHeight: 1.5 }}>
                  Reçus digitaux valides et certifiés générés instantanément après chaque encaissement.
                </p>
              </div>

              <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <LayoutDashboard size={24} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0b1c30', marginBottom: '8px' }}>Dashboard PME</h3>
                <p style={{ fontSize: '13px', color: '#45464d', lineHeight: 1.5 }}>
                  Suivi des revenus, des commandes et des taux de conversion en temps réel depuis votre écran.
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE DEMO SHOWCASE SECTION */}
          <div id="demo-showcase" style={{ maxWidth: '1000px', margin: '0 auto 90px', padding: '0 24px' }}>
            <div className="reflex-card-base" style={{ padding: '40px', backgroundColor: '#ffffff', border: '1px solid #c4b5fd' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="label-xs" style={{ backgroundColor: '#eff4ff', color: '#4b41e1', padding: '4px 12px', borderRadius: '9999px', fontWeight: 600 }}>DÉMO EN DIRECT</span>
                <h2 className="headline-lg" style={{ color: '#0b1c30', marginTop: '12px', marginBottom: '8px' }}>
                  Découvrez comment Reflex conclut les ventes pour vous
                </h2>
                <p style={{ fontSize: '14px', color: '#45464d' }}>
                  Testez un échange client réel et la redirection vers la page de règlement Mobile Money.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
                {/* Mobile Phone Mockup */}
                <div style={{ backgroundColor: '#0b1c30', borderRadius: '24px', padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', minHeight: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0b1c30' }}>Assistant Boutique Élégance</div>
                        <div style={{ fontSize: '10px', color: '#10B981' }}>En ligne sur WhatsApp</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
                      <div style={{ backgroundColor: '#eff4ff', padding: '10px 12px', borderRadius: '12px 12px 12px 2px', fontSize: '12px', color: '#0b1c30', maxWidth: '85%' }}>
                        Bonjour ! Vos perruques 18 pouces sont-elles disponibles à Cotonou ?
                      </div>

                      <div style={{ backgroundColor: '#4b41e1', color: '#ffffff', padding: '10px 12px', borderRadius: '12px 12px 2px 12px', fontSize: '12px', alignSelf: 'flex-end', maxWidth: '88%' }}>
                        Oui tout à fait ! 😊 La "Perruque Brésilienne 18 pouces" est à 45 000 FCFA. Livraison rapide sous 24h.
                        <br /><br />
                        💳 <strong>Lien de paiement Mobile Money :</strong>
                        <div style={{ marginTop: '6px', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }} onClick={() => setActiveView('payment-checkout')}>
                          pay/ORD-229-892 →
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-primary-black"
                      style={{ width: '100%', padding: '10px', fontSize: '12px', textAlign: 'center' }}
                      onClick={() => setActiveView('payment-checkout')}
                    >
                      💳 Tester la Page de Paiement Client →
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0b1c30', marginBottom: '16px' }}>
                    Du premier message au paiement en 2 minutes
                  </h3>
                  <ol style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#45464d', paddingLeft: '20px', margin: 0 }}>
                    <li><strong>Le client pose une question</strong> sur un article du catalogue sur WhatsApp.</li>
                    <li><strong>Reflex réponds avec le ton choisi</strong> et propose le prix exact en FCFA.</li>
                    <li><strong>L'IA génère le lien de paiement</strong> sécurisé dès que l'accord est conclu.</li>
                    <li><strong>Le client règle via MTN MoMo / Wave</strong> et reçoit son reçu numérique certifié.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* PME TESTIMONIALS SECTION */}
          <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '60px 24px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 className="headline-lg" style={{ textAlign: 'center', color: '#0b1c30', marginBottom: '40px' }}>
                Adopté par les PMEs leaders au Bénin et en Afrique de l'Ouest
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: '#f8f9ff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '14px', color: '#45464d', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>
                    "Reflex réponds à nos clientes même à 23h. Nos ventes de perruques ont augmenté de 35% grâce au lien de paiement MoMo automatique."
                  </p>
                  <div style={{ fontWeight: 700, color: '#0b1c30', fontSize: '13px' }}>Boutique Élégance Bénin</div>
                  <div style={{ fontSize: '11px', color: '#76777d' }}>Cotonou, Bénin</div>
                </div>

                <div style={{ padding: '24px', backgroundColor: '#f8f9ff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '14px', color: '#45464d', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>
                    "La génération automatique de reçu certifié rassure énormément nos acheteurs. C'est un gain de temps incroyable !"
                  </p>
                  <div style={{ fontWeight: 700, color: '#0b1c30', fontSize: '13px' }}>Chez Marie Cosmétiques</div>
                  <div style={{ fontSize: '11px', color: '#76777d' }}>Porto-Novo, Bénin</div>
                </div>

                <div style={{ padding: '24px', backgroundColor: '#f8f9ff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '14px', color: '#45464d', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>
                    "Le tableau de bord me permet de voir exactement combien l'IA m'a fait gagner chaque jour. Indispensable pour ma boutique."
                  </p>
                  <div style={{ fontWeight: 700, color: '#0b1c30', fontSize: '13px' }}>ElectroBenin Tech</div>
                  <div style={{ fontSize: '11px', color: '#76777d' }}>Calavi, Bénin</div>
                </div>
              </div>
            </div>
          </div>

          {/* COMPLETE LANDING FOOTER */}
          <footer style={{ backgroundColor: '#0b1c30', color: '#ffffff', padding: '60px 48px 30px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '6px' }} />
                  <span style={{ fontWeight: 800, fontSize: '22px', color: '#ffffff' }}>Reflex</span>
                </div>
                <p style={{ fontSize: '13px', color: '#a0aec0', lineHeight: 1.6, maxWidth: '300px' }}>
                  La plateforme intelligente d'automatisation commerciale WhatsApp et d'encaissement Mobile Money pour les PMEs africaines.
                </p>
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>Produit</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a0aec0' }}>
                  <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('landing')}>Fonctionnalités</li>
                  <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('landing')}>Simulateur IA</li>
                  <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('payment-checkout')}>Page de paiement</li>
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>Intégrations</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a0aec0' }}>
                  <li>WhatsApp Business API</li>
                  <li>MTN Mobile Money</li>
                  <li>Moov Money / Wave</li>
                  <li>Kkiapay Gateway</li>
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>Support & Contact</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a0aec0' }}>
                  <li>support@reflex.bj</li>
                  <li>+229 97 00 00 00</li>
                  <li>Cotonou, Bénin</li>
                  <li>Mentions Légales</li>
                </ul>
              </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a0aec0' }}>
              <div>© 2026 Reflex Intelligent Automation. Tous droits réservés.</div>
              <div>Fait avec ❤️ au Bénin pour l'Afrique de l'Ouest.</div>
            </div>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUTH PAGE (Supabase Auth & Email Inbox Confirmation Notice) */}
      {/* ========================================================================= */}
      {activeView === 'auth' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '40px', width: 'auto', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#0b1c30' }}>Reflex</span>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '460px', padding: '40px', backgroundColor: '#ffffff' }}>
            <h2 className="headline-lg-mobile" style={{ color: '#0b1c30', textAlign: 'center', marginBottom: '8px' }}>
              {authMode === 'signup' ? 'Créer votre compte Reflex' : 'Bon retour parmi nous'}
            </h2>
            <p className="body-md" style={{ color: '#45464d', textAlign: 'center', fontSize: '13px', marginBottom: '28px' }}>
              {authMode === 'signup' ? 'Inscrivez votre PME et commencez à automatiser vos ventes WhatsApp.' : 'Accédez à votre tableau de bord commercial.'}
            </p>

            <button
              onClick={handleGoogleAuth}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#ffffff',
                color: '#0b1c30',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continuer avec Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#c6c6cd' }}>
              <div style={{ flex: 1, borderBottom: '1px solid #E2E8F0' }}></div>
              <span style={{ padding: '0 10px', fontSize: '12px', color: '#76777d' }}>ou avec votre email</span>
              <div style={{ flex: 1, borderBottom: '1px solid #E2E8F0' }}></div>
            </div>

            <form onSubmit={handleSupabaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authMode === 'signup' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Nom & Prénom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#76777d" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder="Alex Mensah"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Adresse Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#76777d" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    placeholder="alex@boutique.bj"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#76777d" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                  />
                </div>
              </div>

              {emailSentNotice && (
                <div style={{ backgroundColor: '#eff4ff', border: '1px solid #c4b5fd', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#0b1c30', lineHeight: 1.5 }}>
                  <strong>📧 Confirmation requise !</strong><br />
                  Un e-mail de confirmation vient d'être envoyé à <strong>{email}</strong>. Veuillez vérifier votre boîte de réception (et vos spams), puis cliquez sur le lien pour valider votre compte.
                </div>
              )}

              <button className="btn-primary-black" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }} disabled={authLoading}>
                {authLoading ? 'Traitement Supabase...' : authMode === 'signup' ? 'Créer mon compte →' : 'Se connecter →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#45464d' }}>
              {authMode === 'signup' ? (
                <>Déjà un compte ? <span style={{ color: '#4b41e1', fontWeight: 600, cursor: 'pointer' }} onClick={() => setAuthMode('login')}>Se connecter</span></>
              ) : (
                <>Pas encore de compte ? <span style={{ color: '#4b41e1', fontWeight: 600, cursor: 'pointer' }} onClick={() => setAuthMode('signup')}>S'inscrire</span></>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ONBOARDING STEP 1: ENTREPRISE */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-entreprise' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '540px', padding: '40px', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <Building size={32} color="#4b41e1" style={{ marginBottom: '12px' }} />
              <h2 className="headline-lg-mobile" style={{ color: '#0b1c30', marginBottom: '8px' }}>
                Présentez votre entreprise
              </h2>
              <p className="body-md" style={{ color: '#45464d', fontSize: '13px' }}>
                Reflex utilisera ces informations pour personnaliser les réponses envoyées à vos clients WhatsApp.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setActiveView('onboarding-catalogue'); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Nom de l'entreprise / PME</label>
                <input
                  type="text"
                  required
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Secteur d'activité</label>
                <select
                  value={companyData.sector}
                  onChange={(e) => setCompanyData({ ...companyData, sector: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="Mode & Vêtements">Mode & Vêtements</option>
                  <option value="Cosmétique & Beauté">Cosmétique & Beauté</option>
                  <option value="Électronique & High-Tech">Électronique & High-Tech</option>
                  <option value="Restauration & Alimentation">Restauration & Alimentation</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Numéro WhatsApp Business</label>
                <input
                  type="text"
                  required
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Description de vos services / produits</label>
                <textarea
                  rows={3}
                  value={companyData.description}
                  onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <button className="btn-primary-black" style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '8px' }}>
                Suivant : Ajouter votre catalogue <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ONBOARDING STEP 2: CATALOGUE */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-catalogue' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '580px', padding: '40px', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <Store size={32} color="#4b41e1" style={{ marginBottom: '12px' }} />
              <h2 className="headline-lg-mobile" style={{ color: '#0b1c30', marginBottom: '8px' }}>
                Ajoutez vos premiers produits
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {productsList.map((prod, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8f9ff', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0b1c30' }}>{prod.name}</div>
                    <span className="label-xs" style={{ color: '#45464d' }}>{prod.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>
                      {prod.price.toLocaleString()} FCFA
                    </div>
                    <button onClick={() => handleDeleteProduct(i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px dashed #c4b5fd', padding: '16px', borderRadius: '10px', marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '12px' }}>+ Ajouter un article</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Nom de l'article"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '13px' }}
                />
                <input
                  type="number"
                  placeholder="Prix FCFA"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '13px' }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="btn-outline-white"
                style={{ width: '100%', padding: '8px', fontSize: '13px' }}
              >
                Ajouter ce produit
              </button>
            </div>

            <button
              onClick={() => setActiveView('onboarding-assistant')}
              className="btn-primary-black"
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              Suivant : Configurer l'Assistant IA <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ONBOARDING STEP 3: ASSISTANT IA */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-assistant' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '540px', padding: '40px', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <Sparkles size={32} color="#4b41e1" style={{ marginBottom: '12px' }} />
              <h2 className="headline-lg-mobile" style={{ color: '#0b1c30', marginBottom: '8px' }}>
                Personnalisez votre Assistant IA
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Ton de communication</label>
                <select
                  value={assistantConfig.tone}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, tone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="Chaleureux & Commercial">Chaleureux & Commercial</option>
                  <option value="Strictement Professionnel">Strictement Professionnel</option>
                  <option value="Décontracté & Jeune">Décontracté & Jeune</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Message de bienvenue automatique</label>
                <textarea
                  rows={3}
                  value={assistantConfig.welcomeMessage}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, welcomeMessage: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Informations de livraison & FAQ</label>
                <textarea
                  rows={2}
                  value={assistantConfig.deliveryInfo}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, deliveryInfo: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveView('onboarding-whatsapp')}
              className="btn-primary-black"
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              Suivant : Connexion WhatsApp <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ONBOARDING STEP 4: CONNEXION WHATSAPP */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-whatsapp' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '520px', padding: '40px', backgroundColor: '#ffffff', textAlign: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={36} />
              </div>
              <h2 className="headline-lg-mobile" style={{ color: '#0b1c30', marginBottom: '8px' }}>
                Votre Assistant Reflex est Prêt !
              </h2>
              <p className="body-md" style={{ color: '#45464d', fontSize: '13.5px', lineHeight: 1.6 }}>
                Les informations de <strong>{companyData.name}</strong> et votre catalogue ({productsList.length} articles) ont été enregistrées avec succès.
              </p>
            </div>

            <div style={{ backgroundColor: '#eff4ff', border: '1px solid #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#4b41e1', fontSize: '13px', marginBottom: '6px' }}>
                <Zap size={16} /> Synchronisation IA Active
              </div>
              <p style={{ fontSize: '12px', color: '#45464d', margin: 0, lineHeight: 1.4 }}>
                Numéro WhatsApp : <strong>{companyData.phone}</strong>. Reflex répondra directement aux questions sur votre catalogue.
              </p>
            </div>

            <button
              className="btn-primary-black"
              style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 600 }}
              onClick={handleFinalizeOnboarding}
            >
              Accéder à mon Dashboard <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DEDICATED CHECKOUT PAYMENT PAGE FOR WHATSAPP CLIENTS */}
      {/* ========================================================================= */}
      {activeView === 'payment-checkout' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex Pay</span>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '480px', padding: '36px', backgroundColor: '#ffffff' }}>
            {!paymentSuccess ? (
              <>
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '20px', textAlign: 'center' }}>
                  <span className="label-xs" style={{ backgroundColor: '#eff4ff', color: '#4b41e1', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>RÈGLEMENT SÉCURISÉ</span>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0b1c30', marginTop: '10px', marginBottom: '4px' }}>{currentCheckoutOrder.pmeName}</h2>
                  <div style={{ fontSize: '13px', color: '#45464d' }}>Commande Ref : <strong>{currentCheckoutOrder.id}</strong></div>
                </div>

                <div style={{ backgroundColor: '#f8f9ff', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0b1c30' }}>{currentCheckoutOrder.item}</div>
                    <div style={{ fontSize: '12px', color: '#45464d' }}>Client: {currentCheckoutOrder.customerName}</div>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>
                    {currentCheckoutOrder.amount.toLocaleString()} FCFA
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '10px', display: 'block' }}>Choisissez votre moyen de paiement Mobile Money</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div
                      onClick={() => setSelectedMomoProvider('mtn')}
                      style={{ padding: '12px', border: `2px solid ${selectedMomoProvider === 'mtn' ? '#4b41e1' : '#E2E8F0'}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center', backgroundColor: selectedMomoProvider === 'mtn' ? '#eff4ff' : '#ffffff' }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b1c30' }}>MTN Mobile Money</div>
                      <div style={{ fontSize: '11px', color: '#10B981' }}>Bénin (*139#)</div>
                    </div>

                    <div
                      onClick={() => setSelectedMomoProvider('moov')}
                      style={{ padding: '12px', border: `2px solid ${selectedMomoProvider === 'moov' ? '#4b41e1' : '#E2E8F0'}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center', backgroundColor: selectedMomoProvider === 'moov' ? '#eff4ff' : '#ffffff' }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b1c30' }}>Moov Money</div>
                      <div style={{ fontSize: '11px', color: '#10B981' }}>Bénin (*155#)</div>
                    </div>

                    <div
                      onClick={() => setSelectedMomoProvider('wave')}
                      style={{ padding: '12px', border: `2px solid ${selectedMomoProvider === 'wave' ? '#4b41e1' : '#E2E8F0'}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center', backgroundColor: selectedMomoProvider === 'wave' ? '#eff4ff' : '#ffffff' }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b1c30' }}>Wave Senegal/CI</div>
                      <div style={{ fontSize: '11px', color: '#3B82F6' }}>Direct App</div>
                    </div>

                    <div
                      onClick={() => setSelectedMomoProvider('kkiapay')}
                      style={{ padding: '12px', border: `2px solid ${selectedMomoProvider === 'kkiapay' ? '#4b41e1' : '#E2E8F0'}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center', backgroundColor: selectedMomoProvider === 'kkiapay' ? '#eff4ff' : '#ffffff' }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b1c30' }}>Kkiapay Gateway</div>
                      <div style={{ fontSize: '11px', color: '#8B5CF6' }}>Carte / All MoMo</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Numéro de téléphone Mobile Money</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ padding: '10px', backgroundColor: '#f8f9ff', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0b1c30' }}>+229</span>
                    <input
                      type="text"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <button
                  className="btn-primary-black"
                  style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 700 }}
                  onClick={handleProcessPayment}
                >
                  Payer {currentCheckoutOrder.amount.toLocaleString()} FCFA par {selectedMomoProvider.toUpperCase()} →
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#76777d', marginTop: '16px' }}>
                  <Shield size={14} color="#10B981" /> Transaction sécurisée avec reçu numérique certifié SHA-256
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={40} />
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0b1c30', marginBottom: '8px' }}>Paiement Confirmé !</h2>
                <p style={{ fontSize: '13.5px', color: '#45464d', marginBottom: '24px' }}>
                  Votre règlement de <strong>{currentCheckoutOrder.amount.toLocaleString()} FCFA</strong> a été validé. Un reçu officiel a été transmis à la boutique et sur votre WhatsApp.
                </p>

                <div style={{ backgroundColor: '#f8f9ff', border: '1px border-dashed #E2E8F0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#0b1c30', marginBottom: '4px' }}>Reçu Numérique Reflex #KKIAPAY-TXN-88902</div>
                  <div style={{ color: '#45464d' }}>Date : {new Date().toLocaleDateString('fr-FR')} • {new Date().toLocaleTimeString('fr-FR')}</div>
                  <div style={{ color: '#45464d' }}>Moyen : {selectedMomoProvider.toUpperCase()} (+229 {payerPhone})</div>
                  <div style={{ color: '#10B981', fontWeight: 600, marginTop: '4px' }}>Hash SHA-256 : 8f9a2e1d0c4b...certifié</div>
                </div>

                <button
                  className="btn-outline-white"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', marginBottom: '10px' }}
                  onClick={() => { setPaymentSuccess(false); setActiveView('landing'); }}
                >
                  Retourner à l'accueil
                </button>

                <button
                  className="btn-primary-black"
                  style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                  onClick={() => { setPaymentSuccess(false); setActiveView('dashboard'); }}
                >
                  Voir le Dashboard Marchand →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DASHBOARD DESKTOP WITH ALL FUNCTIONAL TABS */}
      {/* ========================================================================= */}
      {activeView === 'dashboard' && (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9ff' }}>

          <aside style={{ width: '240px', backgroundColor: '#ffffff', borderRight: '1px solid #E2E8F0', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '4px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#0b1c30', lineHeight: 1.1 }}>Reflex</div>
                <div style={{ fontSize: '12px', color: '#45464d', fontWeight: 500 }}>{companyData.name}</div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Vue d\'ensemble' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Vue d\'ensemble')}
              >
                <LayoutDashboard size={18} /> Vue d'ensemble
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Activité WhatsApp' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Activité WhatsApp')}
              >
                <MessageSquare size={18} /> Activité WhatsApp
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Commandes' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Commandes')}
              >
                <ShoppingBag size={18} /> Commandes
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Paiements' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Paiements')}
              >
                <CreditCard size={18} /> Paiements
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Catalogue' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Catalogue')}
              >
                <Grid size={18} /> Catalogue ({productsList.length})
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Paramètres' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Paramètres')}
              >
                <Settings size={18} /> Paramètres
              </button>
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="sidebar-link" onClick={() => setActiveView('landing')}>
                <Globe size={16} /> Page d'accueil
              </button>
              <button className="sidebar-link" onClick={() => setActiveView('mobile-dash')}>
                <Smartphone size={16} /> Vue Mobile
              </button>
            </div>
          </aside>

          <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 className="headline-lg" style={{ color: '#0b1c30', marginBottom: '4px' }}>
                  {activeSidebarTab === 'Vue d\'ensemble' && `Bonjour ${fullName || 'Alex'}, voici votre activité aujourd'hui.`}
                  {activeSidebarTab === 'Activité WhatsApp' && 'Simulateur & Historique WhatsApp IA'}
                  {activeSidebarTab === 'Commandes' && 'Gestion des Commandes Clients'}
                  {activeSidebarTab === 'Paiements' && 'Transactions & Reçus Mobile Money'}
                  {activeSidebarTab === 'Catalogue' && 'Gestion du Catalogue Produit'}
                  {activeSidebarTab === 'Paramètres' && 'Configuration de la PME & Assistant IA'}
                </h1>
                <p className="body-md" style={{ color: '#45464d' }}>
                  PME active : <strong>{companyData.name}</strong> ({companyData.phone})
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: '9999px' }}>
                <Radio size={14} color={backendConnected ? '#10B981' : '#F59E0B'} />
                <span className="label-xs" style={{ color: '#0b1c30' }}>
                  {backendConnected ? 'Backend API En Ligne' : 'Mode Démo Standalone'}
                </span>
              </div>
            </div>

            {/* TAB 1: VUE D'ENSEMBLE */}
            {activeSidebarTab === 'Vue d\'ensemble' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '8px', textTransform: 'uppercase' }}>CONVERSATIONS</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0b1c30', fontFamily: 'var(--font-mono)' }}>{liveStats.conversations}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '8px', textTransform: 'uppercase' }}>AUTO (IA)</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>{liveStats.autoAiPercent}%</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '8px', textTransform: 'uppercase' }}>COMMANDES</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0b1c30', fontFamily: 'var(--font-mono)' }}>{liveStats.commandes}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '8px', textTransform: 'uppercase' }}>REVENUS (FCFA)</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0b1c30', fontFamily: 'var(--font-mono)' }}>{liveStats.revenusFcfa.toLocaleString()}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '8px', textTransform: 'uppercase' }}>CONVERSION</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{liveStats.conversionPercent}%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="reflex-card-ai" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Sparkles size={20} color="#4b41e1" />
                        <h3 className="title-md" style={{ color: '#0b1c30', fontSize: '18px' }}>Résumé intelligent de l'activité de {companyData.name}</h3>
                      </div>
                      <p className="body-md" style={{ color: '#45464d', lineHeight: 1.6 }}>
                        Reflex a traité {liveStats.conversations} messages pour <strong>{companyData.name}</strong> avec un taux d'automatisation de {liveStats.autoAiPercent}%. L'IA utilise le ton <em>"{assistantConfig.tone}"</em> et présente vos {productsList.length} produits du catalogue.
                      </p>
                    </div>

                    <div>
                      <h3 className="title-md" style={{ color: '#0b1c30', marginBottom: '16px' }}>Commandes Récentes</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentOrdersList.map((ord, idx) => (
                          <div key={idx} className="reflex-card-base" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5eeff', color: '#0b1c30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                {ord.avatar}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '15px', color: '#0b1c30' }}>{ord.name} ({ord.phone})</div>
                                <div style={{ fontSize: '12px', color: '#45464d' }}>{ord.summary}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>{ord.amount.toLocaleString()} FCFA</div>
                              <span className={`chip-status ${ord.chipType === 'green' ? 'chip-green' : 'chip-amber'}`}>{ord.chipText}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="reflex-card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 className="title-md" style={{ color: '#0b1c30', fontSize: '18px' }}>Paramètres IA Actifs</h3>
                    <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                      <div className="label-xs" style={{ color: '#45464d', marginBottom: '6px' }}>TON IA</div>
                      <div style={{ fontWeight: 600, color: '#4b41e1' }}>{assistantConfig.tone}</div>
                    </div>
                    <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                      <div className="label-xs" style={{ color: '#45464d', marginBottom: '6px' }}>DELAIS LIVRAISON</div>
                      <div style={{ fontSize: '13px', color: '#0b1c30' }}>{assistantConfig.deliveryInfo}</div>
                    </div>
                    <div>
                      <div className="label-xs" style={{ color: '#45464d', marginBottom: '6px' }}>WELCOME MESSAGE</div>
                      <div style={{ fontSize: '12px', color: '#45464d', fontStyle: 'italic' }}>"{assistantConfig.welcomeMessage}"</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACTIVITÉ WHATSAPP & SIMULATEUR */}
            {activeSidebarTab === 'Activité WhatsApp' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
                <div className="reflex-card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#ffffff' }}>
                  <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#10B981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0b1c30' }}>Simulateur WhatsApp - {companyData.name}</div>
                        <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>● Bot IA actif en temps réel</div>
                      </div>
                    </div>
                    <button className="btn-outline-white" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setSimChatHistory([])}>
                      Effacer chat
                    </button>
                  </div>

                  <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {simChatHistory.map((chat, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: chat.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '75%',
                          padding: '12px 16px',
                          borderRadius: chat.sender === 'client' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          backgroundColor: chat.sender === 'client' ? '#4b41e1' : '#eff4ff',
                          color: chat.sender === 'client' ? '#ffffff' : '#0b1c30',
                          fontSize: '13.5px',
                          lineHeight: 1.5
                        }}>
                          {chat.text}
                          <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{chat.time}</div>
                        </div>
                      </div>
                    ))}
                    {simLoading && (
                      <div style={{ fontSize: '12px', color: '#4b41e1', fontStyle: 'italic' }}>Reflex génère la réponse IA...</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                    <input
                      type="text"
                      placeholder="Tapez un message client pour tester votre bot..."
                      value={simUserMessage}
                      onChange={(e) => setSimUserMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendSimMessage()}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                    <button className="btn-primary-black" style={{ padding: '12px 20px' }} onClick={handleSendSimMessage}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                  <h3 className="title-md" style={{ color: '#0b1c30', marginBottom: '16px' }}>Directives IA</h3>
                  <p style={{ fontSize: '13px', color: '#45464d', lineHeight: 1.6, marginBottom: '16px' }}>
                    Vos clients WhatsApp reçoivent des réponses générées avec les données de votre entreprise :
                  </p>
                  <ul style={{ fontSize: '13px', color: '#0b1c30', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
                    <li><strong>Boutique :</strong> {companyData.name}</li>
                    <li><strong>Ton :</strong> {assistantConfig.tone}</li>
                    <li><strong>Livraison :</strong> {assistantConfig.deliveryInfo}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: COMMANDES */}
            {activeSidebarTab === 'Commandes' && (
              <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 className="title-md" style={{ color: '#0b1c30' }}>Toutes les Commandes ({recentOrdersList.length})</h3>
                  <button className="btn-primary-black" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <Plus size={16} /> Ajouter une Commande
                  </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#45464d', fontSize: '12px' }}>
                      <th style={{ padding: '12px' }}>RÉFÉRENCE</th>
                      <th style={{ padding: '12px' }}>CLIENT</th>
                      <th style={{ padding: '12px' }}>ARTICLE</th>
                      <th style={{ padding: '12px' }}>MONTANT</th>
                      <th style={{ padding: '12px' }}>STATUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrdersList.map((ord, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8f9ff' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{ord.id}</td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontWeight: 600, color: '#0b1c30' }}>{ord.name}</div>
                          <div style={{ fontSize: '12px', color: '#45464d' }}>{ord.phone}</div>
                        </td>
                        <td style={{ padding: '16px 12px', color: '#0b1c30' }}>{ord.item}</td>
                        <td style={{ padding: '16px 12px', fontWeight: 700, color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>{ord.amount.toLocaleString()} FCFA</td>
                        <td style={{ padding: '16px 12px' }}>
                          <span className={`chip-status ${ord.chipType === 'green' ? 'chip-green' : 'chip-amber'}`}>{ord.chipText}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: PAIEMENTS */}
            {activeSidebarTab === 'Paiements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '6px' }}>TOTAL ENCAISSÉ</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>1 245 000 FCFA</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '6px' }}>TRANSACTIONS</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0b1c30', fontFamily: 'var(--font-mono)' }}>34 Réussies</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#45464d', marginBottom: '6px' }}>OPÉRATEUR</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#4b41e1' }}>MTN / Moov / Wave</div>
                  </div>
                </div>

                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                  <h3 className="title-md" style={{ color: '#0b1c30', marginBottom: '16px' }}>Historique des Paiements Encaissés</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0b1c30' }}>Transaction #KKIAPAY-TXN-88902</div>
                      <div style={{ fontSize: '12px', color: '#45464d' }}>Client: Koffi Mensah • MTN Mobile Money (+229 97 45 12 89)</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#10B981', fontSize: '16px' }}>+45 000 FCFA</div>
                      <div style={{ fontSize: '11px', color: '#45464d' }}>Reçu SHA-256 Validé</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CATALOGUE */}
            {activeSidebarTab === 'Catalogue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                  <h3 className="title-md" style={{ color: '#0b1c30', marginBottom: '16px' }}>+ Ajouter un Produit</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Nom de l'article"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                    <input
                      type="number"
                      placeholder="Prix en FCFA"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      placeholder="Catégorie"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <button className="btn-primary-black" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={handleAddProduct}>
                    Ajouter au Catalogue
                  </button>
                </div>

                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                  <h3 className="title-md" style={{ color: '#0b1c30', marginBottom: '16px' }}>Catalogue Actif ({productsList.length} articles)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {productsList.map((prod, idx) => (
                      <div key={idx} style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', color: '#0b1c30', marginBottom: '4px' }}>{prod.name}</div>
                          <div style={{ fontSize: '12px', color: '#45464d' }}>{prod.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '18px', color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>{prod.price.toLocaleString()} FCFA</div>
                          <button onClick={() => handleDeleteProduct(idx)} style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', marginTop: '6px' }}>
                            <Trash2 size={16} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: PARAMÈTRES PME */}
            {activeSidebarTab === 'Paramètres' && (
              <div className="reflex-card-base" style={{ padding: '32px', backgroundColor: '#ffffff', maxWidth: '640px' }}>
                <h3 className="title-md" style={{ color: '#0b1c30', marginBottom: '24px' }}>Paramètres & IA de {companyData.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Nom de la PME</label>
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Numéro WhatsApp Business</label>
                    <input
                      type="text"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#0b1c30', marginBottom: '6px', display: 'block' }}>Ton de l'Assistant IA</label>
                    <select
                      value={assistantConfig.tone}
                      onChange={(e) => setAssistantConfig({ ...assistantConfig, tone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Chaleureux & Commercial">Chaleureux & Commercial</option>
                      <option value="Strictement Professionnel">Strictement Professionnel</option>
                      <option value="Décontracté & Jeune">Décontracté & Jeune</option>
                    </select>
                  </div>
                  <button className="btn-primary-black" style={{ padding: '12px', fontSize: '14px', marginTop: '12px' }} onClick={handleFinalizeOnboarding}>
                    Enregistrer les Paramètres & Synchroniser l'IA
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. DASHBOARD MOBILE */}
      {/* ========================================================================= */}
      {activeView === 'mobile-dash' && (
        <div style={{ maxWidth: '440px', margin: '20px auto', backgroundColor: '#f8f9ff', minHeight: '840px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 className="headline-lg-mobile" style={{ color: '#0b1c30', marginBottom: '2px' }}>Vue d'ensemble</h1>
              <p className="body-md" style={{ color: '#45464d', fontSize: '13px' }}>{companyData.name}</p>
            </div>
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#0b1c30" />
            </button>
          </div>

          <div style={{ padding: '0 20px 80px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="reflex-card-base" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="label-sm" style={{ color: '#45464d', textTransform: 'uppercase' }}>CHIFFRE D'AFFAIRES</span>
                <span className="label-sm" style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: '12px' }}>↗ +12%</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#0b1c30' }}>1 245 000 FCFA</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="reflex-card-base" style={{ padding: '16px' }}>
                <div className="label-sm" style={{ color: '#45464d', marginBottom: '6px', textTransform: 'uppercase' }}>COMMANDES</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0b1c30' }}>34</div>
              </div>
              <div className="reflex-card-base" style={{ padding: '16px' }}>
                <div className="label-sm" style={{ color: '#45464d', marginBottom: '6px', textTransform: 'uppercase' }}>MESSAGES AUTO</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0b1c30' }}>4302</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff5f5', border: '1px solid #ffdad6', borderRadius: '1rem', padding: '16px', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={22} color="#ba1a1a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: '#ba1a1a', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>Intervention nécessaire</h4>
                <p className="body-md" style={{ color: '#45464d', fontSize: '13px', lineHeight: 1.4 }}>
                  3 clients attendent une confirmation manuelle pour la livraison.
                </p>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px', backgroundColor: '#ffffff', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px' }}>
            <button style={{ background: '#645efb', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '6px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }} onClick={() => setActiveView('dashboard')}>
              <Home size={18} />
              <span style={{ fontSize: '10px', fontWeight: 600 }}>Dashboard</span>
            </button>
            <button style={{ background: 'transparent', color: '#45464d', border: 'none', padding: '6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <Menu size={18} />
              <span style={{ fontSize: '10px', fontWeight: 500 }}>Menu</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
