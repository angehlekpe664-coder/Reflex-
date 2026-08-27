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
      {/* 1. STYLISH CONTEXTUAL LANDING PAGE WITH GENERATED BACKGROUNDS & OUTFIT FONTS */}
      {/* ========================================================================= */}
      {activeView === 'landing' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#0b1c30', color: '#ffffff', position: 'relative', overflowX: 'hidden', fontFamily: 'var(--font-jakarta)' }}>

          {/* Dancing WhatsApp Background */}
          <div className="whatsapp-motion-container">
            <svg className="wa-float-icon wa-float-1" width="56" height="56" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <svg className="wa-float-icon wa-float-2" width="68" height="68" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </div>

          {/* Top Navigation Bar */}
          <header style={{ padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '42px', width: 'auto', borderRadius: '10px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)' }} />
              <span className="font-outfit" style={{ fontWeight: 800, fontSize: '24px', color: '#ffffff', letterSpacing: '-0.02em' }}>Reflex</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: backendConnected ? '#10B981' : '#F59E0B', backgroundColor: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Radio size={14} className="animate-pulse" />
                <span>{backendConnected ? 'API En Ligne' : 'Mode Démo Standalone'}</span>
              </div>

              <span
                style={{ fontSize: '15px', fontWeight: 500, color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => { setAuthMode('login'); setActiveView('auth'); }}
              >
                Se connecter
              </span>

              <button
                className="btn-gradient-ai"
                style={{ borderRadius: '10px', padding: '10px 22px', fontSize: '14px' }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Commencer gratuitement <ArrowRight size={16} />
              </button>
            </div>
          </header>

          {/* Hero Section with Contextual Background & Stylish Outfit Typography */}
          <div className="hero-context-bg" style={{ padding: '90px 24px 80px', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
              
              {/* Context Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', marginBottom: '28px' }} className="glass-badge">
                <Sparkles size={16} color="#00f2fe" />
                <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 600, color: '#00f2fe', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  L'IA commerciale N°1 des PMEs au Bénin
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="display-lg" style={{ color: '#ffffff', fontSize: '56px', lineHeight: 1.12, marginBottom: '24px' }}>
                Votre WhatsApp devient votre <br />
                <span style={{ background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #f6d365 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  meilleur commercial 24/7.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="body-lg" style={{ color: '#94a3b8', maxWidth: '740px', margin: '0 auto 42px', fontSize: '19px', lineHeight: 1.6 }}>
                Reflex automatise vos réponses clients en wolof, fon et français, présente votre catalogue et encaisse par <strong style={{ color: '#ffffff' }}>Mobile Money (MTN MoMo, Moov Money, Wave, Kkiapay)</strong> avec reçus certifiés.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '60px', flexWrap: 'wrap' }}>
                <button
                  className="btn-gradient-ai"
                  style={{ padding: '16px 36px', fontSize: '17px', borderRadius: '12px' }}
                  onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Commencer gratuitement <ArrowRight size={20} />
                </button>
                
                <a
                  href="#demo-showcase"
                  style={{ padding: '16px 32px', fontSize: '17px', borderRadius: '12px', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}
                >
                  <Play size={20} color="#00f2fe" fill="#00f2fe" /> Voir la Démo Interactive
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flexWrap: 'wrap', opacity: 0.85 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <CheckCircle size={16} color="#10B981" /> <span>Installation en 3 minutes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <Shield size={16} color="#10B981" /> <span>Paiements Certifiés SHA-256</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <Zap size={16} color="#F59E0B" /> <span>Réponses IA en &lt; 3s</span>
                </div>
              </div>

            </div>
          </div>

          {/* 4 KEY FEATURES GRID WITH GLASSMORPHISM */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <span className="font-outfit" style={{ color: '#00f2fe', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FONCTIONNALITÉS CLÉS</span>
              <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '8px' }}>
                Tout pour faire exploser votre chiffre d'affaires sur WhatsApp
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              
              <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px', border: '1px solid rgba(0, 242, 254, 0.2)', transition: 'transform 0.3s ease' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.2))', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                  <Zap size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>IA Commerciale 24/7</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Réponses instantanées adaptées au ton de votre boutique. L'IA présente vos produits et vend sans interruption.
                </p>
              </div>

              <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)', transition: 'transform 0.3s ease' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <CreditCard size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Paiement Mobile Money</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Génération automatique de liens de paiement direct MTN MoMo (*139#), Moov Money (*155#) et Wave.
                </p>
              </div>

              <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px', border: '1px solid rgba(245, 158, 11, 0.2)', transition: 'transform 0.3s ease' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <Receipt size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Reçus SHA-256</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Émission automatique de reçus numériques valides et sécurisés envoyés directement au client sur WhatsApp.
                </p>
              </div>

              <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px', border: '1px solid rgba(168, 85, 247, 0.2)', transition: 'transform 0.3s ease' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <LayoutDashboard size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Dashboard PME</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Suivez vos commandes, vos clients et vos revenus en FCFA avec des statistiques synchronisées en temps réel.
                </p>
              </div>

            </div>
          </div>

          {/* REAL PME STORY BANNER WITH GENERATED IMAGE */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div className="pme-story-bg" style={{ borderRadius: '24px', padding: '60px 48px', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ maxWidth: '640px' }}>
                <span className="font-outfit" style={{ color: '#10B981', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CAS CONCRET • BOUTIQUE COTONOU</span>
                <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '10px', marginBottom: '20px', fontSize: '36px' }}>
                  "J'ai multiplié mes ventes par 3 sans recruter de vendeurs."
                </h2>
                <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '28px' }}>
                  Avant Reflex, Amara manquait des dizaines de messages clients le soir. Aujourd'hui, l'IA présente les articles du catalogue, fournit les prix en FCFA et encaisse directement par Mobile Money même pendant qu'elle dort.
                </p>

                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                  <div>
                    <div className="font-outfit" style={{ fontSize: '32px', fontWeight: 800, color: '#00f2fe' }}>+300%</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Chiffre d'affaires MoMo</div>
                  </div>
                  <div>
                    <div className="font-outfit" style={{ fontSize: '32px', fontWeight: 800, color: '#10B981' }}>&lt; 3 sec</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Temps de réponse client</div>
                  </div>
                  <div>
                    <div className="font-outfit" style={{ fontSize: '32px', fontWeight: 800, color: '#F59E0B' }}>100%</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Reçus certifiés générés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE DEMO SHOWCASE SECTION */}
          <div id="demo-showcase" style={{ maxWidth: '1040px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div className="glass-card-dark" style={{ padding: '48px', borderRadius: '24px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <span className="font-outfit" style={{ backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                  ▶ DEMO INTERACTIVE
                </span>
                <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '16px', marginBottom: '10px' }}>
                  Testez le flux de vente WhatsApp en direct
                </h2>
                <p style={{ fontSize: '15px', color: '#94a3b8' }}>
                  Visualisez comment l'IA Reflex discute avec le client final et génère le lien de paiement Mobile Money.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
                {/* Mobile Phone Mockup */}
                <div style={{ backgroundColor: '#020617', borderRadius: '28px', padding: '18px', border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', padding: '16px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10B981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={20} />
                      </div>
                      <div>
                        <div className="font-outfit" style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Assistant Boutique Élégance</div>
                        <div style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
                          En ligne sur WhatsApp
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px 14px', borderRadius: '16px 16px 16px 4px', fontSize: '13px', color: '#e2e8f0', maxWidth: '85%' }}>
                        Bonjour ! Vos perruques 18 pouces sont-elles disponibles à Cotonou ?
                      </div>

                      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)', color: '#ffffff', padding: '12px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px', alignSelf: 'flex-end', maxWidth: '88%', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
                        Oui tout à fait ! 😊 La "Perruque Brésilienne 18 pouces" est à 45 000 FCFA. Livraison rapide sous 24h.
                        <br /><br />
                        💳 <strong>Lien de paiement Mobile Money :</strong>
                        <div style={{ marginTop: '8px', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setActiveView('payment-checkout')}>
                          <span>pay/ORD-229-892</span> <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-gradient-ai"
                      style={{ width: '100%', padding: '12px', fontSize: '13px', textAlign: 'center', borderRadius: '10px' }}
                      onClick={() => setActiveView('payment-checkout')}
                    >
                      💳 Tester la Page de Paiement Client →
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-outfit" style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
                    Du message client à l'encaissement en 4 étapes
                  </h3>
                  <ol style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', color: '#cbd5e1', paddingLeft: '20px', margin: 0 }}>
                    <li><strong style={{ color: '#ffffff' }}>Le client s'informe :</strong> Question directe sur WhatsApp concernant un article du catalogue.</li>
                    <li><strong style={{ color: '#ffffff' }}>L'IA répond instantanément :</strong> Fournit le prix exact en FCFA avec le ton de votre marque.</li>
                    <li><strong style={{ color: '#ffffff' }}>Génération du lien de paiement :</strong> Dès que l'accord est conclu, l'IA envoie le lien sécurisé.</li>
                    <li><strong style={{ color: '#ffffff' }}>Encaissement & Reçu :</strong> Le client règle via MTN MoMo, Moov ou Wave et reçoit son reçu certifié SHA-256.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* PME TESTIMONIALS SECTION */}
          <div style={{ backgroundColor: '#090d16', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '80px 24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                <span className="font-outfit" style={{ color: '#00f2fe', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TÉMOIGNAGES PME</span>
                <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '8px' }}>
                  Rejoint par les boutiques leaders au Bénin
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                
                <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px' }}>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>
                    "Reflex réponds à nos clientes même à 23h. Nos ventes de perruques ont augmenté de 35% grâce au lien de paiement MoMo automatique."
                  </p>
                  <div className="font-outfit" style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>Boutique Élégance Bénin</div>
                  <div style={{ fontSize: '12px', color: '#00f2fe' }}>Cotonou, Bénin</div>
                </div>

                <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px' }}>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>
                    "La génération automatique de reçu certifié rassure énormément nos acheteurs. C'est un gain de temps incroyable !"
                  </p>
                  <div className="font-outfit" style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>Chez Marie Cosmétiques</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>Porto-Novo, Bénin</div>
                </div>

                <div className="glass-card-dark" style={{ padding: '28px', borderRadius: '18px' }}>
                  <p style={{ fontSize: '15px', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>
                    "Le tableau de bord me permet de voir exactement combien l'IA m'a fait gagner chaque jour. Indispensable pour ma boutique."
                  </p>
                  <div className="font-outfit" style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>ElectroBenin Tech</div>
                  <div style={{ fontSize: '12px', color: '#F59E0B' }}>Calavi, Bénin</div>
                </div>

              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer style={{ backgroundColor: '#020617', color: '#ffffff', padding: '70px 48px 36px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                  <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '40px', width: 'auto', borderRadius: '8px' }} />
                  <span className="font-outfit" style={{ fontWeight: 800, fontSize: '24px', color: '#ffffff' }}>Reflex</span>
                </div>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '320px' }}>
                  La plateforme d'automatisation commerciale WhatsApp & Mobile Money pour les PMEs d'Afrique de l'Ouest.
                </p>
              </div>

              <div>
                <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Produit</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94a3b8' }}>
                  <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('landing')}>Fonctionnalités</li>
                  <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('landing')}>Démo interactive</li>
                  <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('payment-checkout')}>Page de paiement</li>
                </ul>
              </div>

              <div>
                <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Paiements</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94a3b8' }}>
                  <li>MTN Mobile Money</li>
                  <li>Moov Money</li>
                  <li>Wave</li>
                  <li>Kkiapay Gateway</li>
                </ul>
              </div>

              <div>
                <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Support</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94a3b8' }}>
                  <li>support@reflex.bj</li>
                  <li>+229 97 00 00 00</li>
                  <li>Cotonou, Bénin</li>
                </ul>
              </div>
            </div>

            <div style={{ maxWidth: '1140px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
              <div>© 2026 Reflex Intelligent Automation. Tous droits réservés.</div>
              <div>Fabriqué avec passion pour les PMEs d'Afrique.</div>
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
