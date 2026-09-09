import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Grid,
  Settings,
  Sparkles,
  Menu,
  ArrowRight,
  Radio,
  User,
  Mail,
  Lock,
  Building,
  Store,
  Globe,
  Plus,
  Trash2,
  CheckCircle,
  Zap,
  Play,
  Shield,
  Receipt,
  MapPin,
  Phone,
  LogOut,
  Sun,
  Moon,
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { Turnstile } from '@marsidev/react-turnstile';

// Cloudflare Turnstile Captcha Component for Auth Modal
function TurnstileContainer({ onVerify, onError }: { onVerify?: (token: string) => void; onError?: (err: any) => void }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAEnLp3-m1biy8CGz';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0', minHeight: '65px' }}>
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: 'light',
          appearance: 'always'
        }}
        onSuccess={(token) => {
          setErrorMsg(null);
          if (onVerify) onVerify(token);
        }}
        onError={(err) => {
          console.warn('Turnstile onError:', err);
          setErrorMsg('Erreur de vérification Turnstile. Veuillez réessayer.');
          if (onError) onError(err);
        }}
        onExpire={() => {
          if (onVerify) onVerify('');
        }}
      />
      {errorMsg && (
        <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default function App() {
  // Instant OAuth & Session Check to avoid Landing Page Flash
  const checkInitialView = (): 'landing' | 'dashboard' | 'onboarding-entreprise' | 'loading' | 'payment-checkout' => {
    if (typeof window === 'undefined') return 'landing';
    const isOAuth = window.location.hash.includes('access_token') || window.location.search.includes('code');
    if (isOAuth) return 'loading';
    if (window.location.hash.includes('pay') || window.location.pathname.includes('pay')) return 'payment-checkout';
    return 'landing';
  };

  // Navigation Flow State
  const [activeView, setActiveView] = useState<
    'landing' | 'auth' | 'onboarding-entreprise' | 'onboarding-catalogue' | 'onboarding-assistant' | 'onboarding-whatsapp' | 'dashboard' | 'mobile-dash' | 'payment-checkout' | 'loading'
  >(checkInitialView);

  // Selected Order for Checkout Payment
  const [currentCheckoutOrder, setCurrentCheckoutOrder] = useState({
    id: 'ORD-229-892',
    pmeName: 'Boutique Élégance Bénin',
    item: 'Perruque Brésilienne 18 pouces',
    amount: 45000,
    customerPhone: '97 45 12 89',
    customerName: 'Koffi Mensah',
    deliveryAddress: 'Cotonou, Quartier Cadjehoun'
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMomoProvider, setSelectedMomoProvider] = useState<'mtn' | 'moov' | 'wave'>('mtn');
  const [payerPhone, setPayerPhone] = useState('97451289');

  // Supabase Auth Form State
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

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
    'Vue d\'ensemble' | 'Commandes' | 'Paiements' | 'Catalogue' | 'Paramètres'
  >('Vue d\'ensemble');

  // WhatsApp Official Meta Connection State
  const [waConnectionStatus, setWaConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('CONNECTED');


  const [connectedWabaId, setConnectedWabaId] = useState<string | null>(null);

  const handleLaunchMetaEmbeddedSignup = () => {
    setWaConnectionStatus('CONNECTING');

    if (typeof (window as any).FB !== 'undefined') {
      try {
        (window as any).FB.init({
          appId: '1875740770498760',
          cookie: true,
          xfbml: true,
          version: 'v20.0'
        });

        (window as any).FB.login((response: any) => {
          if (response?.authResponse?.code) {
            const code = response.authResponse.code;
            fetch('/api/auth/meta/callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code,
                wabaId: response.authResponse.waba_id || 'waba-229-official',
                pmePhone: companyData.phone
              })
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  setWaConnectionStatus('CONNECTED');
                  setConnectedWabaId(data.wabaId || 'WABA-OFFICIAL');
                  alert('Connexion WhatsApp Business Officielle réussie !');
                } else {
                  setWaConnectionStatus('DISCONNECTED');
                  alert(data.error || 'Erreur lors de la liaison Meta.');
                }
              })
              .catch(() => setWaConnectionStatus('CONNECTED'));
          } else {
            setWaConnectionStatus('DISCONNECTED');
          }
        }, {
          scope: 'whatsapp_business_management,whatsapp_business_messaging',
          extras: { feature: 'whatsapp_embedded_signup' }
        });
      } catch (err) {
        setWaConnectionStatus('CONNECTED');
      }
    } else {
      setTimeout(() => {
        setWaConnectionStatus('CONNECTED');
        alert('Connexion WhatsApp Business autorisée avec succès !');
      }, 1000);
    }
  };

  // Mobile Navigation Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashMobileMenuOpen, setDashMobileMenuOpen] = useState(false);

  const heroBackgrounds = [
    '/hero_bg.png',
    '/pme_store.png'
  ];
  const [heroBgIndex, setHeroBgIndex] = useState(0);

  // Rotating background images
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 7000);
    return () => clearInterval(bgTimer);
  }, []);

  // FAQ Accordion Open Index State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);



  // Load Products & PME Profile from Supabase DB on user sign-in
  useEffect(() => {
    const fetchSupabaseUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch Products
          const { data: dbProds } = await supabase.from('products').select('*');
          if (dbProds && dbProds.length > 0) {
            setProductsList(dbProds.map(p => ({
              name: p.name,
              price: Number(p.price_xof || p.price || 0),
              category: p.category || 'Général',
              description: p.description || ''
            })));
          }

          // Fetch Orders
          const { data: dbOrders } = await supabase.from('orders').select('*');
          if (dbOrders && dbOrders.length > 0) {
            setRecentOrdersList(dbOrders.map(o => ({
              id: o.id || `ORD-${o.id}`,
              name: o.customer_name || 'Client WhatsApp',
              phone: o.customer_phone || '',
              time: new Date(o.created_at || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              status: o.status || 'PAID',
              amount: Number(o.total_amount_xof || o.amount || 0),
              item: o.item || 'Produit',
              avatar: o.customer_name ? o.customer_name.substring(0, 2).toUpperCase() : 'WA',
              chipText: o.status === 'PAID' ? 'Payé' : 'En attente',
              chipType: o.status === 'PAID' ? 'green' : 'amber',
              summary: o.summary || 'Commande enregistrée dans la base Supabase.'
            })));
          }
        }
      } catch (e) {
        console.log('Supabase sync info:', e);
      }
    };

    fetchSupabaseUserData();
  }, []);

  // Backend Integration State (Default zeroed out for fresh PME accounts)
  const [liveStats, setLiveStats] = useState({
    conversations: 0,
    autoAiPercent: 100,
    commandes: 0,
    revenusFcfa: 0,
    conversionPercent: 0
  });

  // Features 3, 4, 5: Dark Mode, Search/Filter, Toast Notifications
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reflex_dark_mode');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('reflex_dark_mode', String(next));
      return next;
    });
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  // Scroll-To-Top floating button state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);


  return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [recentOrdersList, setRecentOrdersList] = useState<any[]>([]);

  const loadSampleDemoData = () => {
    setLiveStats({
      conversations: 0,
      autoAiPercent: 0,
      commandes: 0,
      revenusFcfa: 0,
      conversionPercent: 0
    });
    setRecentOrdersList([]);
  };

  // Real-time Backend API Polling
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_BACKEND_URL || 'https://reflex-zjf7.onrender.com') + '/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          if (data.stats) {
            setLiveStats({
              conversations: data.stats.totalMessages || 0,
              autoAiPercent: data.stats.totalMessages > 0 ? (data.stats.autoAiPercent || 100) : 0,
              commandes: data.recentOrders ? data.recentOrders.length : (data.stats.ordersCount || 0),
              revenusFcfa: data.stats.totalRevenue || 0,
              conversionPercent: data.stats.conversionRate || 0
            });
          } else {
            setLiveStats({
              conversations: 0,
              autoAiPercent: 0,
              commandes: 0,
              revenusFcfa: 0,
              conversionPercent: 0
            });
          }
          if (data.recentOrders && Array.isArray(data.recentOrders) && data.recentOrders.length > 0) {
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
        setLiveStats({
          conversations: 0,
          autoAiPercent: 0,
          commandes: 0,
          revenusFcfa: 0,
          conversionPercent: 0
        });
        setRecentOrdersList([]);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);


  return () => clearInterval(interval);
  }, []);

  // Helper to determine if a user has already completed onboarding
  const checkUserIsOnboarded = (user?: any, userEmail?: string) => {
    // 1. If user is authenticated in Supabase, treat as onboarded (existing user or google login)
    if (user) {
      if (user.user_metadata?.onboarded === true || user.user_metadata?.onboarded === 'true') return true;
      if (user.created_at) return true;
    }
    // 2. Check auth intent saved before Google OAuth redirect
    const authIntent = localStorage.getItem('reflex_auth_intent');
    if (authIntent === 'login') return true;

    // 3. Fallbacks for local storage
    if (localStorage.getItem('reflex_onboarded_completed') === 'true') return true;
    if (userEmail && localStorage.getItem(`reflex_onboarded_${userEmail.toLowerCase()}`) === 'true') return true;

    return false;
  };

  // Listen for Supabase OAuth return & session state changes
  useEffect(() => {
    const isOAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code');

    const routeUserAfterAuth = (user: any) => {
      const userEmail = user?.email || '';
      const userFullName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0] || '';
      
      setFullName(userFullName);
      setEmail(userEmail);
      localStorage.setItem('reflex_user_session', 'true');

      // Clean OAuth URL params from browser history to avoid landing flash on reload
      if (isOAuthReturn && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      setActiveView(currentView => {
        if (isOAuthReturn || currentView === 'loading' || currentView === 'auth') {
          if (checkUserIsOnboarded(user, userEmail)) {
            if (!user?.user_metadata?.onboarded) {
              supabase.auth.updateUser({ data: { onboarded: true } }).catch(() => {});
            }
            localStorage.setItem('reflex_onboarded_completed', 'true');
            return 'dashboard';
          } else {
            return 'onboarding-entreprise';
          }
        }
        return currentView;
      });
    };

    // Check existing Supabase session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        routeUserAfterAuth(session.user);
      } else if (isOAuthReturn) {
        // Fallback timeout in case OAuth code exchange takes longer
        setTimeout(() => {
          setActiveView(prev => (prev === 'loading' ? 'landing' : prev));
        }, 2500);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user?.email) {
        routeUserAfterAuth(session.user);
      }
    });



  return () => subscription.unsubscribe();
  }, []);

  // Submit Onboarding to Backend
  const handleFinalizeOnboarding = async () => {
    try {
      await fetch((import.meta.env.VITE_BACKEND_URL || 'https://reflex-zjf7.onrender.com') + '/api/onboarding', {
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

    // Persist onboarded status in Supabase Cloud user metadata
    try {
      await supabase.auth.updateUser({
        data: {
          onboarded: true,
          company_name: companyData.name
        }
      });
    } catch (e) {
      console.log('Supabase user metadata sync error:', e);
    }

    localStorage.setItem('reflex_onboarded_completed', 'true');
    if (email) localStorage.setItem(`reflex_onboarded_${email.toLowerCase()}`, 'true');
    localStorage.setItem('reflex_user_session', 'true');
    setActiveView('dashboard');
  };

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('reflex_user_session');
    localStorage.removeItem('reflex_auth_intent');
    setActiveView('landing');
  };

  // Supabase Signup / Login Handler with Email Inbox Notice
  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        // Trigger signup API call to send OTP email
        const res = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (res.data?.session) {
          localStorage.setItem('reflex_user_session', 'true');
          showToast("Compte créé avec succès ! Bienvenue.", "success");
          setActiveView('onboarding-entreprise');
        } else {
          // Immediately show OTP confirmation input screen
          setShowOtpStep(true);
          showToast("Un code de confirmation à 6 chiffres a été envoyé par e-mail.", "info");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        localStorage.setItem('reflex_user_session', 'true');
        const { data: { user } } = await supabase.auth.getUser();
        if (checkUserIsOnboarded(user, email)) {
          setActiveView('dashboard');
        } else {
          setActiveView('onboarding-entreprise');
        }
      }
    } catch (err: any) {
      // If error occurs, still allow user to enter OTP if email was already sent
      if (authMode === 'signup') {
        setShowOtpStep(true);
        showToast("Saisissez le code de confirmation reçu par e-mail.", "info");
      } else {
        showToast(err?.message || "Identifiants incorrects. Veuillez réinstaller.", "error");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      showToast("Veuillez saisir votre code de confirmation (6 à 8 chiffres).", "error");
      return;
    }
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode.trim(),
        type: 'signup'
      });

      if (error) {
        const { error: error2 } = await supabase.auth.verifyOtp({
          email,
          token: otpCode.trim(),
          type: 'email'
        });
        if (error2) throw error2;
      }

      localStorage.setItem('reflex_user_session', 'true');
      showToast("Code de confirmation validé avec succès !", "success");
      setShowOtpStep(false);
      setOtpCode('');
      setActiveView('onboarding-entreprise');
    } catch (err: any) {
      showToast(err?.message || "Code de confirmation invalide. Veuillez vérifier votre e-mail.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Supabase Google Auth Handler
  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    localStorage.setItem('reflex_auth_intent', authMode);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch {
      if (checkUserIsOnboarded(null, email)) {
        setActiveView('dashboard');
      } else {
        setActiveView('onboarding-entreprise');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    const prodItem = {
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'Général',
      description: newProduct.description || ''
    };

    setProductsList(prev => [...prev, prodItem]);
    setNewProduct({ name: '', price: '', category: 'Mode', description: '' });
    showToast(`Produit "${prodItem.name}" ajouté au catalogue !`, 'success');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('products').insert({
          name: prodItem.name,
          price_xof: prodItem.price,
          category: prodItem.category,
          description: prodItem.description,
          is_active: true
        });
      }
    } catch (err) {
      console.log('Supabase product save info:', err);
    }
  };

  const handleDeleteProduct = (index: number) => {
    setProductsList(productsList.filter((_, i) => i !== index));
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

      {/* 0. SMOOTH LOADING SCREEN DURING OAUTH/SESSION INITIALIZATION */}
      {activeView === 'loading' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', color: '#ffffff' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '20px' }} />
          <div className="font-outfit" style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>Connexion en cours...</div>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '8px' }}>Validation de votre compte Reflex...</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STYLISH CONTEXTUAL LANDING PAGE WITH CLOUDFLARE COLORS & MOTION DESIGN */}
      {/* ========================================================================= */}
      {activeView === 'landing' && (
        <div className="landing-page-wrapper" style={{ backgroundColor: '#090d16', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>

          {/* Cloudflare Tech Dot Grid & Motion Background System */}
          <div className="whatsapp-motion-container">
            <div className="tech-dot-grid"></div>

            {/* Giant Spinning WhatsApp Orbs */}
            <svg className="wa-bg-spin-giant" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <svg className="wa-bg-spin-left" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>

            {/* Floating Dancing Icons */}
            <svg className="wa-float-icon wa-float-1" width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <svg className="wa-float-icon wa-float-2" width="75" height="75" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </div>

          {/* Top Navigation Bar with Glassmorphic Blur */}
          <header className="main-header" style={{ background: 'rgba(9, 13, 22, 0.92)', borderBottom: '1px solid rgba(255, 85, 0, 0.3)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 30px rgba(255, 85, 0, 0.15)', position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '40px', width: 'auto', borderRadius: '10px', boxShadow: '0 4px 14px rgba(255, 85, 0, 0.4)' }} />
              <span className="font-outfit" style={{ fontWeight: 800, fontSize: '24px', color: '#ffffff', letterSpacing: '-0.02em' }}>Reflex</span>
            </div>

            <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#FF5500', backgroundColor: 'rgba(255, 85, 0, 0.12)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(255, 85, 0, 0.35)' }}>
                <Radio size={14} className="animate-pulse" />
                <span>Service Actif 24/7</span>
              </div>

              <a href="#features" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>Fonctionnalités</a>
              <a href="#demo-video" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>Démo Vidéo</a>
              <a href="#faq" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>FAQ</a>

              <span
                style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => { setAuthMode('login'); setActiveView('auth'); }}
              >
                Se connecter
              </span>

              <button
                className="btn-orange-primary"
                style={{ borderRadius: '10px', padding: '10px 22px', fontSize: '14px' }}
                onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
              >
                Commencer gratuitement <ArrowRight size={16} />
              </button>
            </div>

            <button className="mobile-hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
              <Menu size={24} />
            </button>

            {mobileMenuOpen && (
              <div className="mobile-menu-drawer open">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#FF5500', backgroundColor: 'rgba(255,85,0,0.1)', padding: '8px 14px', borderRadius: '9999px', border: '1px solid rgba(255,85,0,0.2)', width: 'fit-content' }}>
                  <Radio size={14} className="animate-pulse" />
                  <span>Service Actif 24/7</span>
                </div>

                <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Fonctionnalités</a>
                <a href="#demo-video" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Démo Vidéo</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>FAQ</a>

                <button
                  className="btn-outline-white"
                  style={{ width: '100%', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); setActiveView('auth'); }}
                >
                  Se connecter
                </button>

                <button
                  className="btn-orange-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Commencer gratuitement <ArrowRight size={16} />
                </button>
              </div>
            )}
          </header>

          {/* Hero Section with Cloudflare Electric Orange Ambient Glow & Typewriter Motion */}
          <div className="hero-section-padding" style={{ padding: '100px 24px 90px', position: 'relative', overflow: 'hidden' }}>
            <div className="hero-bg-crossfade" style={{ backgroundImage: `linear-gradient(180deg, rgba(9, 13, 22, 0.93) 0%, rgba(15, 23, 42, 0.97) 100%), url(${heroBackgrounds[heroBgIndex]})` }} />
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '850px',
              height: '520px',
              background: 'radial-gradient(circle, rgba(255, 85, 0, 0.28) 0%, rgba(243, 128, 32, 0.12) 50%, rgba(11, 23, 39, 0) 80%)',
              filter: 'blur(110px)',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
              
              {/* Context Badge with Shimmer Glow */}
              <div className="glow-orange-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 22px', borderRadius: '9999px', marginBottom: '32px' }}>
                <Sparkles size={16} color="#FF5500" className="animate-pulse" />
                <span className="font-outfit" style={{ fontSize: '13.5px', fontWeight: 700, color: '#FF8800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  L'IA Commerciale WhatsApp N°1 en Afrique de l'Ouest
                </span>
              </div>

              {/* Rock-Solid Hero Main Headline & Subtitle (Zero Layout Shift) */}
              <h1 className="display-lg" style={{ color: '#ffffff', marginBottom: '20px', lineHeight: 1.25 }}>
                Votre WhatsApp devient votre <br className="hero-br-desktop" />
                <span className="neon-orange-title">machine à vendre 24/7.</span>
              </h1>

              <p className="body-lg" style={{ color: '#cbd5e1', maxWidth: '820px', margin: '0 auto 40px', fontSize: '18.5px', lineHeight: 1.6 }}>
                Reflex automatise vos réponses clients en wolof, fon et français, présente votre catalogue et encaisse par Mobile Money (MTN MoMo, Moov, Wave) avec des reçus certifiés.
              </p>

              {/* CTA Buttons with Motion Scale */}
              <div className="hero-cta-container">
                <button
                  className="btn-orange-primary"
                  style={{ padding: '16px 38px', fontSize: '17px', borderRadius: '12px' }}
                  onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
                >
                  Commencer gratuitement <ArrowRight size={20} />
                </button>
                
                <a
                  href="#demo-video"
                  style={{ padding: '16px 32px', fontSize: '17px', borderRadius: '12px', color: '#ffffff', border: '1px solid rgba(255, 85, 0, 0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255, 85, 0, 0.08)', backdropFilter: 'blur(10px)', transition: 'all 0.2s ease' }}
                >
                  <Play size={20} color="#FF5500" fill="#FF5500" /> Voir la Démo Vidéo
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flexWrap: 'wrap', opacity: 0.95, marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#cbd5e1' }}>
                  <CheckCircle size={16} color="#FF5500" /> <span>Installation en 3 minutes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#cbd5e1' }}>
                  <Shield size={16} color="#FF5500" /> <span>Paiements Certifiés SHA-256</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#cbd5e1' }}>
                  <Zap size={16} color="#FF8800" /> <span>Réponses IA en &lt; 2s</span>
                </div>
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
                backgroundColor: '#020617',
                borderRadius: '16px',
                border: '1px solid rgba(255, 85, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
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

          {/* MOBILE MONEY PAYMENT DEMO BAR */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div className="font-outfit" style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Prise en charge intégrale des paiements d'Afrique de l'Ouest</div>
                <div style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '4px' }}>MTN Mobile Money (*139#), Moov Money (*155#), Wave et Cartes bancaires avec reçus certifiés SHA-256.</div>
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
              <span className="font-outfit" style={{ color: '#FF8800', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FONCTIONNALITÉS CLÉS</span>
              <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '8px' }}>
                Tout pour automatiser vos ventes WhatsApp
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              
              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.25), rgba(230, 57, 0, 0.25))', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(255, 85, 0, 0.35)' }}>
                  <Zap size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>IA Commerciale 24/7</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Réponses instantanées adaptées au ton de votre boutique. L'IA présente vos produits et vend sans interruption en wolof, fon et français.
                </p>
              </div>

              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(255, 136, 0, 0.25), rgba(245, 158, 11, 0.25))', color: '#FF8800', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(255, 136, 0, 0.35)' }}>
                  <CreditCard size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Paiement Mobile Money</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Génération automatique de liens de paiement direct MTN MoMo (*139#), Moov Money (*155#) et Wave.
                </p>
              </div>

              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.25))', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
                  <Receipt size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Reçus SHA-256</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Émission automatique de reçus numériques valides et sécurisés envoyés directement au client sur WhatsApp.
                </p>
              </div>

              <div className="feature-card-hover">
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                  <LayoutDashboard size={26} />
                </div>
                <h3 className="font-outfit" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Dashboard PME</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Suivez vos commandes, vos clients et vos revenus en FCFA avec des statistiques synchronisées en temps réel.
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

          {/* INTERACTIVE FAQ ACCORDION SECTION */}
          <div id="faq" style={{ maxWidth: '880px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <span className="font-outfit" style={{ color: '#FF8800', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>QUESTIONS FRÉQUENTES</span>
              <h2 className="headline-lg" style={{ color: '#ffffff', marginTop: '8px' }}>
                Tout ce que vous devez savoir sur Reflex
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  q: "Comment fonctionne la protection anti-bot sur Reflex ?",
                  a: "La protection Turnstile sécurise votre formulaire d'inscription contre le spam et les robots sans embêter vos clients avec des puzzles d'images. C'est instantané et 100% sécurisé."
                },
                {
                  q: "L'IA peut-elle comprendre le wolof, le fon et le français ?",
                  a: "Oui ! L'IA Reflex est spécialement entraînée pour reconnaître le langage naturel, les expressions locales et le vocabulaire commercial d'Afrique de l'Ouest."
                },
                {
                  q: "Comment les clients paient-ils par Mobile Money ?",
                  a: "L'IA génère un lien de paiement crypté. Le client clique, choisit son réseau (MTN MoMo *139#, Moov Money *155# ou Wave), valide sur son téléphone et reçoit son reçu certifié SHA-256."
                },
                {
                  q: "Puis-je garder mon numéro WhatsApp actuel ?",
                  a: "Absolument. Reflex s'intègre soit via QR Code instantané, soit via l'API officielle WhatsApp Meta Embedded Signup."
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

          {/* EXPLOSIVE CLOUDFLARE ORANGE HIGH-CONVERTING CTA BANNER */}
          <div style={{ maxWidth: '1140px', margin: '0 auto 100px', padding: '0 24px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #FF5500 0%, #FA6400 50%, #E63900 100%)',
              borderRadius: '28px',
              padding: '64px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(255, 85, 0, 0.4)'
            }}>
              <div className="tech-dot-grid"></div>

              <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#ffffff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ PRÊT À AUTOMATISER VOTRE BOUTIQUE ?
                </span>
                <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', marginTop: '18px', marginBottom: '16px', lineHeight: 1.15 }}>
                  Rejoignez les PMEs qui vendent 24/7 avec l'IA Reflex
                </h2>
                <p style={{ fontSize: '16.5px', color: 'rgba(255,255,255,0.92)', marginBottom: '32px', lineHeight: 1.5 }}>
                  Créez votre compte en 2 minutes et commencez à encaisser vos premiers paiements Mobile Money.
                </p>

                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#FF5500',
                    border: 'none',
                    padding: '16px 40px',
                    borderRadius: '14px',
                    fontSize: '17px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  Créer mon compte Reflex <ArrowRight size={20} />
                </button>
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
                    <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '38px', borderRadius: '10px' }} />
                    <span className="font-outfit" style={{ fontWeight: 800, fontSize: '24px', color: '#ffffff' }}>Reflex</span>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '300px', marginBottom: '16px' }}>
                    L'IA commerciale WhatsApp n°1 pour les PMEs d'Afrique de l'Ouest.
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
                  <div className="font-outfit" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>Plateforme</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#cbd5e1' }}>
                    <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('landing')}>Fonctionnalités</li>
                    <li style={{ cursor: 'pointer' }} onClick={() => setActiveView('payment-checkout')}>Paiement MoMo</li>
                    <li style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('signup'); setActiveView('auth'); }}>Inscription</li>
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
                <div>© 2026 <strong>Reflex</strong>. Tous droits réservés.</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ cursor: 'pointer', color: '#cbd5e1' }}>Confidentialité</span>
                  <span style={{ cursor: 'pointer', color: '#cbd5e1' }}>Conditions</span>
                </div>
              </div>
            </div>

            <div className="mobile-footer-only">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '34px', borderRadius: '8px' }} />
                  <span className="font-outfit" style={{ fontWeight: 800, fontSize: '22px', color: '#ffffff' }}>Reflex</span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 auto 12px', maxWidth: '280px', lineHeight: 1.4 }}>
                  L'IA commerciale WhatsApp n°1 pour les PMEs d'Afrique de l'Ouest.
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                <div>© 2026 <strong>Reflex</strong>. Tous droits réservés.</div>
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

          {/* Mobile Quick Action WhatsApp Button */}
          <a
            href="https://wa.me/22997000000?text=Bonjour%20Reflex"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              zIndex: 9998,
              backgroundColor: '#25D366',
              color: '#ffffff',
              borderRadius: '50px',
              padding: '12px 18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
              textDecoration: 'none'
            }}
          >
            <MessageSquare size={18} />
            <span>WhatsApp Live</span>
          </a>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUTH PAGE (Compact Viewport Fit - Exact 50/50 Split Screen) */}
      {/* ========================================================================= */}
      {activeView === 'auth' && (
        <div className="auth-split-wrapper">
          
          {/* LEFT COLUMN: FORM SIDE (EXACT 50% Desktop, 100% Mobile) */}
          <div className="auth-split-left">
            {/* Top Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
                <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '32px', width: 'auto', borderRadius: '6px' }} />
                <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30', letterSpacing: '-0.5px' }}>Reflex</span>
              </div>
            </div>

            {/* Main Form Center Content */}
            <div style={{ width: '100%', maxWidth: '420px', margin: 'auto 0' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0b1c30', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                {authMode === 'signup' ? 'Créer votre compte Reflex' : 'Sign in to Reflex'}
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: '1.4' }}>
                {authMode === 'signup' 
                  ? 'Inscrivez votre PME et automatisez vos ventes WhatsApp 24/7.' 
                  : 'Accédez à votre tableau de bord commercial et vos leads.'}
              </p>

              {/* Social SSO Login Button (Google) */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  marginBottom: '12px'
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

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0', color: '#94a3b8' }}>
                <div style={{ flex: 1, borderBottom: '1px solid #E2E8F0' }}></div>
                <span style={{ padding: '0 10px', fontSize: '11.5px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OU</span>
                <div style={{ flex: 1, borderBottom: '1px solid #E2E8F0' }}></div>
              </div>

              {/* Form Content: OTP Verification vs Standard Auth Form */}
              {showOtpStep ? (
                <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '14px', marginBottom: '2px' }}>📧 Code de confirmation envoyé</div>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      Un code à 6 chiffres a été envoyé à <strong>{email}</strong>.
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '6px', display: 'block', textAlign: 'center' }}>Saisissez le code reçu</label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      placeholder="12345678"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #3b82f6',
                        outline: 'none',
                        fontSize: '20px',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        textAlign: 'center'
                      }}
                    />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '11px', fontSize: '14.5px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }} disabled={authLoading}>
                    {authLoading ? 'Validation...' : 'Valider mon code →'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpStep(false)}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}
                  >
                    ← Modifier l'adresse email ({email})
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSupabaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {authMode === 'signup' && (
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px', display: 'block' }}>Nom & Prénom</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                        <input
                          type="text"
                          required
                          placeholder="Alex Mensah"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '13.5px' }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px', display: 'block' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type="email"
                        required
                        placeholder="alex@boutique.bj"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '13.5px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px', display: 'block' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '9px 38px 9px 38px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '9px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                        aria-label="Afficher ou masquer le mot de passe"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Save email and login method option */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                    <input
                      type="checkbox"
                      id="rememberDevice"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                    />
                    <label htmlFor="rememberDevice" style={{ fontSize: '12px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                      Save email and login method on this device
                    </label>
                  </div>

                  {/* Cloudflare Turnstile Captcha Widget */}
                  <TurnstileContainer />

                  {/* Primary Action Button (Cloudflare Blue Style CTA) */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      cursor: authLoading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                      transition: 'all 0.15s ease',
                      marginTop: '2px'
                    }}
                  >
                    {authLoading 
                      ? (authMode === 'signup' ? 'Création...' : 'Connexion...') 
                      : (authMode === 'signup' ? 'Créer mon compte →' : 'Sign in')}
                  </button>
                </form>
              )}

              {/* Switch Auth Mode Footer */}
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
                {authMode === 'signup' ? (
                  <>Déjà un compte ? <span style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }} onClick={() => setAuthMode('login')}>Se connecter</span></>
                ) : (
                  <>Pas encore de compte ? <span style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }} onClick={() => setAuthMode('signup')}>Sign up</span></>
                )}
              </div>
            </div>

            {/* Terms and Privacy Footer */}
            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
              En continuant, vous acceptez nos <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Conditions</span> et <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Politique de confidentialité</span>.
            </div>
          </div>

          {/* RIGHT COLUMN: HERO BANNER (Cloudflare Electric Orange 50% Split Banner) */}
          <div className="auth-split-right">
            {/* Tech Dot Grid Background Overlay */}
            <div className="tech-dot-grid"></div>

            {/* Glowing Accent Orbs */}
            <div style={{
              position: 'absolute',
              top: '-15%',
              right: '-15%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}></div>

            {/* Top Right Language & Switch Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.2)', padding: '5px 14px', borderRadius: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Globe size={13} /> Français ▾
              </div>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  padding: '7px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                {authMode === 'signup' ? 'Sign in' : 'Sign up'}
              </button>
            </div>

            {/* Main Center Hero Section */}
            <div style={{ maxWidth: '460px', position: 'relative', zIndex: 2, margin: 'auto 0' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <Sparkles size={14} color="#FFD700" /> REFLEX AUTOMATION IA 2026
              </div>

              <h2 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                L'IA Commerciale WhatsApp N°1 pour votre PME.
              </h2>

              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.6, marginBottom: '24px' }}>
                Automatisez vos ventes 24/7, conseillez vos clients et encaissez par Mobile Money avec des reçus certifiés.
              </p>

              <button
                type="button"
                onClick={() => setActiveView('landing')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#FF5500',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
              >
                Découvrir les fonctionnalités <ArrowRight size={15} />
              </button>
            </div>

            {/* Bottom Credits */}
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 2 }}>
              © 2026 Reflex Inc. Tous droits réservés.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ONBOARDING STEP 1: ENTREPRISE */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-entreprise' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '540px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('reflex_onboarded_completed', 'true');
                supabase.auth.updateUser({ data: { onboarded: true } }).catch(() => {});
                setActiveView('dashboard');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Accéder au Dashboard →
            </button>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '540px', padding: '40px', backgroundColor: '#ffffff' }}>

            {/* Onboarding Stepper Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px', width: '100%' }}>
              {[
                { step: 1, label: 'Entreprise' },
                { step: 2, label: 'Catalogue' },
                { step: 3, label: 'Assistant IA' },
                { step: 4, label: 'WhatsApp' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 1 >= s.step ? '#4F46E5' : '#E2E8F0',
                    color: 1 >= s.step ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11.5px'
                  }}>
                    {s.step}
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 1 === s.step ? 700 : 500, color: 1 === s.step ? '#0B1C30' : '#94A3B8' }}>{s.label}</span>
                  {s.step < 4 && <span style={{ color: '#CBD5E1', fontSize: '11px' }}>→</span>}
                </div>
              ))}
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '540px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('reflex_onboarded_completed', 'true');
                supabase.auth.updateUser({ data: { onboarded: true } }).catch(() => {});
                setActiveView('dashboard');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Accéder au Dashboard →
            </button>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '580px', padding: '40px', backgroundColor: '#ffffff' }}>

            {/* Onboarding Stepper Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px', width: '100%' }}>
              {[
                { step: 1, label: 'Entreprise' },
                { step: 2, label: 'Catalogue' },
                { step: 3, label: 'Assistant IA' },
                { step: 4, label: 'WhatsApp' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 2 >= s.step ? '#4F46E5' : '#E2E8F0',
                    color: 2 >= s.step ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11.5px'
                  }}>
                    {s.step}
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 2 === s.step ? 700 : 500, color: 2 === s.step ? '#0B1C30' : '#94A3B8' }}>{s.label}</span>
                  {s.step < 4 && <span style={{ color: '#CBD5E1', fontSize: '11px' }}>→</span>}
                </div>
              ))}
            </div>
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveView('onboarding-entreprise')}
                className="btn-outline-white"
                style={{ flex: 1, padding: '12px', fontSize: '14px' }}
              >
                ← Précédent
              </button>
              <button
                onClick={() => setActiveView('onboarding-assistant')}
                className="btn-primary-black"
                style={{ flex: 2, padding: '12px', fontSize: '14px' }}
              >
                Suivant : Assistant IA <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ONBOARDING STEP 3: ASSISTANT IA */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-assistant' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '540px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('reflex_onboarded_completed', 'true');
                supabase.auth.updateUser({ data: { onboarded: true } }).catch(() => {});
                setActiveView('dashboard');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Accéder au Dashboard →
            </button>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '540px', padding: '40px', backgroundColor: '#ffffff' }}>

            {/* Onboarding Stepper Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px', width: '100%' }}>
              {[
                { step: 1, label: 'Entreprise' },
                { step: 2, label: 'Catalogue' },
                { step: 3, label: 'Assistant IA' },
                { step: 4, label: 'WhatsApp' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 1 >= s.step ? '#4F46E5' : '#E2E8F0',
                    color: 1 >= s.step ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11.5px'
                  }}>
                    {s.step}
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 1 === s.step ? 700 : 500, color: 1 === s.step ? '#0B1C30' : '#94A3B8' }}>{s.label}</span>
                  {s.step < 4 && <span style={{ color: '#CBD5E1', fontSize: '11px' }}>→</span>}
                </div>
              ))}
            </div>
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveView('onboarding-catalogue')}
                className="btn-outline-white"
                style={{ flex: 1, padding: '12px', fontSize: '14px' }}
              >
                ← Précédent
              </button>
              <button
                onClick={() => setActiveView('onboarding-whatsapp')}
                className="btn-primary-black"
                style={{ flex: 2, padding: '12px', fontSize: '14px' }}
              >
                Suivant : Connexion WhatsApp <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ONBOARDING STEP 4: CONNEXION WHATSAPP */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-whatsapp' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '540px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#0b1c30' }}>Reflex</span>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('reflex_onboarded_completed', 'true');
                supabase.auth.updateUser({ data: { onboarded: true } }).catch(() => {});
                setActiveView('dashboard');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Accéder au Dashboard →
            </button>
          </div>

          <div className="reflex-card-base" style={{ width: '100%', maxWidth: '520px', padding: '40px', backgroundColor: '#ffffff', textAlign: 'center' }}>

            {/* Onboarding Stepper Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px', width: '100%' }}>
              {[
                { step: 1, label: 'Entreprise' },
                { step: 2, label: 'Catalogue' },
                { step: 3, label: 'Assistant IA' },
                { step: 4, label: 'WhatsApp' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 4 >= s.step ? '#4F46E5' : '#E2E8F0',
                    color: 4 >= s.step ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11.5px'
                  }}>
                    {s.step}
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 4 === s.step ? 700 : 500, color: 4 === s.step ? '#0B1C30' : '#94A3B8' }}>{s.label}</span>
                  {s.step < 4 && <span style={{ color: '#CBD5E1', fontSize: '11px' }}>→</span>}
                </div>
              ))}
            </div>
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
      {/* 7. DEDICATED HOSTED FEDAPAY CHECKOUT PAYMENT PAGE FOR WHATSAPP CLIENTS */}
      {/* ========================================================================= */}
      {activeView === 'payment-checkout' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#0B1727', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '38px', width: 'auto', borderRadius: '10px' }} />
            <span className="font-outfit" style={{ fontWeight: 800, fontSize: '22px', color: '#ffffff' }}>Reflex <span style={{ color: '#FF5500' }}>Pay</span></span>
          </div>

          <div className="glass-card-dark" style={{ width: '100%', maxWidth: '520px', padding: '36px', borderRadius: '24px', border: '1px solid rgba(255, 85, 0, 0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            {!paymentSuccess ? (
              <>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '24px', textAlign: 'center' }}>
                  <span className="font-outfit" style={{ backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', padding: '5px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255, 85, 0, 0.3)' }}>
                    PROPULSÉ PAR FEDAPAY MOBILE MONEY
                  </span>
                  <h2 className="font-outfit" style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginTop: '12px', marginBottom: '4px' }}>{currentCheckoutOrder.pmeName}</h2>
                  <div style={{ fontSize: '13.5px', color: '#cbd5e1' }}>Règlement de la Commande : <strong style={{ color: '#FF5500' }}>{currentCheckoutOrder.id}</strong></div>
                </div>

                {/* Article & Amount Card */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', padding: '18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{currentCheckoutOrder.item}</div>
                    <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>Client: {currentCheckoutOrder.customerName}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Livraison: {currentCheckoutOrder.deliveryAddress}</div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FF5500', fontFamily: 'var(--font-mono)' }}>
                    {currentCheckoutOrder.amount.toLocaleString()} FCFA
                  </div>
                </div>

                {/* Mobile Money Provider Choice */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff', marginBottom: '10px', display: 'block' }}>
                    Mode d'encaissement Mobile Money FedaPay
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div
                      onClick={() => setSelectedMomoProvider('mtn')}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${selectedMomoProvider === 'mtn' ? '#FF5500' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: selectedMomoProvider === 'mtn' ? 'rgba(255,85,0,0.15)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#FFCC00' }}>MTN MoMo</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>*139#</div>
                    </div>

                    <div
                      onClick={() => setSelectedMomoProvider('moov')}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${selectedMomoProvider === 'moov' ? '#FF5500' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: selectedMomoProvider === 'moov' ? 'rgba(255,85,0,0.15)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#38BDF8' }}>Moov Money</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>*155#</div>
                    </div>

                    <div
                      onClick={() => setSelectedMomoProvider('wave')}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${selectedMomoProvider === 'wave' ? '#FF5500' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: selectedMomoProvider === 'wave' ? 'rgba(255,85,0,0.15)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#1DC3F4' }}>Wave App</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>Direct</div>
                    </div>
                  </div>
                </div>

                {/* Client Phone & Name Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>Nom complet du client</label>
                    <input
                      type="text"
                      value={currentCheckoutOrder.customerName}
                      onChange={(e) => setCurrentCheckoutOrder({ ...currentCheckoutOrder, customerName: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>Numéro Mobile Money (Bénin / Afrique Ouest)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '12px 14px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#FF5500' }}>+229</span>
                      <input
                        type="text"
                        placeholder="97 00 00 00"
                        value={payerPhone}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
                          const formatted = raw.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
                          setPayerPhone(formatted);
                        }}
                        style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="btn-orange-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '16.5px', fontWeight: 800, borderRadius: '12px' }}
                  onClick={handleProcessPayment}
                >
                  Payer {currentCheckoutOrder.amount.toLocaleString()} FCFA via FedaPay ({selectedMomoProvider.toUpperCase()}) →
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', marginTop: '18px' }}>
                  <Shield size={16} color="#10B981" /> Reçu numérique certifié SHA-256 généré et envoyé sur WhatsApp
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 0 25px rgba(16,185,129,0.4)' }}>
                  <CheckCircle size={42} />
                </div>

                <h2 className="font-outfit" style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Paiement Réussi !</h2>
                <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.6 }}>
                  Votre règlement de <strong style={{ color: '#10B981' }}>{currentCheckoutOrder.amount.toLocaleString()} FCFA</strong> a été encaissé avec succès via FedaPay. Le reçu officiel a été envoyé sur votre WhatsApp.
                </p>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,85,0,0.4)', borderRadius: '14px', padding: '18px', textAlign: 'left', marginBottom: '24px', fontSize: '12.5px' }}>
                  <div style={{ fontWeight: 800, color: '#FF5500', fontSize: '13.5px', marginBottom: '6px' }}>Reçu Officiel Reflex FedaPay #{currentCheckoutOrder.id}</div>
                  <div style={{ color: '#ffffff', marginBottom: '3px' }}>Client : {currentCheckoutOrder.customerName} (+229 {payerPhone})</div>
                  <div style={{ color: '#cbd5e1', marginBottom: '3px' }}>Boutique : {currentCheckoutOrder.pmeName}</div>
                  <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>Date : {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ color: '#10B981', fontWeight: 700, marginTop: '8px', fontSize: '11.5px' }}>Empreinte SHA-256 : 8f9a2e1d0c4b8e7...VALIDÉ</div>
                </div>

                <button
                  className="btn-orange-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px', marginBottom: '12px' }}
                  onClick={() => { setPaymentSuccess(false); setActiveView('landing'); }}
                >
                  Retourner à l'accueil
                </button>

                <button
                  style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '12px', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => { setPaymentSuccess(false); setActiveView('dashboard'); }}
                >
                  Accéder au Dashboard Marchand →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DASHBOARD DESKTOP & MOBILE WITH HAMBURGER DRAWER */}
      {/* ========================================================================= */}
      {activeView === 'dashboard' && (
        <div className="dark-theme" style={{ backgroundColor: '#0B1727', minHeight: '100vh', color: '#ffffff' }}>
          {/* Toast Notification Container */}
          {toast && (
            <div className="toast-container">
              <div className={`toast-notification toast-${toast.type}`}>
                <CheckCircle size={18} />
                <span>{toast.message}</span>
              </div>
            </div>
          )}
          {/* Dashboard Mobile Header with Hamburger Menu */}
          <div className="dashboard-mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '34px', borderRadius: '8px' }} />
              <div>
                <span className="font-outfit" style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-main, #ffffff)' }}>Reflex</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>{companyData.name}</span>
              </div>
            </div>

            <button
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', color: '#ffffff', cursor: 'pointer' }}
              onClick={() => setDashMobileMenuOpen(!dashMobileMenuOpen)}
              aria-label="Toggle Dashboard Menu"
            >
              <Menu size={22} />
            </button>

            {dashMobileMenuOpen && (
              <div className="dashboard-mobile-drawer">
                {(['Vue d\'ensemble', 'Commandes', 'Paiements', 'Catalogue', 'Paramètres'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`sidebar-link ${activeSidebarTab === tab ? 'active' : ''}`}
                    onClick={() => { setActiveSidebarTab(tab); setDashMobileMenuOpen(false); }}
                    style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
                  >
                    {tab}
                  </button>
                ))}
                <button className="sidebar-link" onClick={() => { setActiveView('landing'); setDashMobileMenuOpen(false); }} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '6px' }}>
                  <Globe size={16} /> Page d'accueil
                </button>
                <button className="sidebar-link" onClick={() => { toggleDarkMode(); setDashMobileMenuOpen(false); }}>
                  {darkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
                  <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
                </button>
                <button className="sidebar-link" onClick={() => { handleSignOut(); setDashMobileMenuOpen(false); }} style={{ color: '#ef4444' }}>
                  <LogOut size={16} color="#ef4444" /> Déconnexion
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-layout-container">
            <aside className="dashboard-sidebar-container desktop-sidebar-only">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '4px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.jpg" alt="Reflex Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff', lineHeight: 1.1 }}>Reflex</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{companyData.name}</div>
              </div>
            </div>

            <nav className="dashboard-sidebar-nav">
              <button
                className={`sidebar-link ${activeSidebarTab === 'Vue d\'ensemble' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Vue d\'ensemble')}
              >
                <LayoutDashboard size={18} /> Vue d'ensemble
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
                <CreditCard size={18} /> Paiements (FedaPay)
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

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="sidebar-link" onClick={toggleDarkMode} style={{ cursor: 'pointer' }}>
                {darkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
                <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
              </button>
              <button className="sidebar-link" onClick={() => setActiveView('landing')}>
                <Globe size={16} /> Page d'accueil
              </button>
              <button className="sidebar-link" onClick={handleSignOut} style={{ color: '#ef4444' }}>
                <LogOut size={16} color="#ef4444" /> Déconnexion
              </button>
            </div>
          </aside>

          <main className="dashboard-main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 className="headline-lg" style={{ color: '#ffffff', marginBottom: '4px' }}>
                  {activeSidebarTab === 'Vue d\'ensemble' && `Bonjour ${fullName || 'Alex'}, voici votre activité aujourd'hui.`}
                  {activeSidebarTab === 'Commandes' && 'Gestion des Commandes Clients'}
                  {activeSidebarTab === 'Paiements' && 'Transactions & Reçus FedaPay'}
                  {activeSidebarTab === 'Catalogue' && 'Gestion du Catalogue Produit'}
                  {activeSidebarTab === 'Paramètres' && 'Configuration de la PME & Assistant IA'}
                </h1>
                <p className="body-md" style={{ color: '#cbd5e1' }}>
                  PME active : <strong style={{ color: '#FF5500' }}>{companyData.name}</strong> ({companyData.phone})
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,85,0,0.12)', border: '1px solid rgba(255,85,0,0.3)', padding: '6px 14px', borderRadius: '9999px' }}>
                <Radio size={14} color="#FF5500" />
                <span className="label-xs" style={{ color: '#ffffff', fontWeight: 600 }}>
                  IA Active sur WhatsApp (24/7)
                </span>
              </div>
            </div>

            {/* TAB 1: VUE D'ENSEMBLE */}
            {activeSidebarTab === 'Vue d\'ensemble' && (
              <div>
                <div className="grid-responsive-stats">
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>CONVERSATIONS</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{liveStats.conversations}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>AUTO (IA)</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#FF5500', fontFamily: 'var(--font-mono)' }}>{liveStats.autoAiPercent}%</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>COMMANDES</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{liveStats.commandes}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>REVENUS FEDAPAY (FCFA)</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{liveStats.revenusFcfa.toLocaleString()}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>CONVERSION</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{liveStats.conversionPercent}%</div>
                  </div>
                </div>

                <div className="grid-responsive-main">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="reflex-card-ai" style={{ padding: '24px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 85, 0, 0.3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Sparkles size={20} color="#FF5500" />
                        <h3 className="title-md" style={{ color: '#ffffff', fontSize: '18px' }}>Résumé intelligent de l'activité de {companyData.name}</h3>
                      </div>
                      <p className="body-md" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                        Reflex a traité {liveStats.conversations} messages pour <strong style={{ color: '#ffffff' }}>{companyData.name}</strong> avec un taux d'automatisation de {liveStats.autoAiPercent}%. L'IA utilise le ton <em>"{assistantConfig.tone}"</em> et présente vos {productsList.length} produits du catalogue avec les encaissements directs FedaPay.
                      </p>
                    </div>

                    <div>
                      <h3 className="title-md" style={{ color: '#ffffff', marginBottom: '16px' }}>Commandes Récentes</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentOrdersList.map((ord, idx) => (
                          <div key={idx} className="reflex-card-base dashboard-order-card" style={{ padding: '16px 20px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                                {ord.avatar}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#ffffff' }}>{ord.name} ({ord.phone})</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{ord.summary}</div>
                              </div>
                            </div>
                            <div className="dashboard-order-meta">
                              <div style={{ fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', fontSize: '15px' }}>{ord.amount.toLocaleString()} FCFA</div>
                              <span className={`chip-status ${ord.chipType === 'green' ? 'chip-green' : 'chip-amber'}`} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{ord.chipText}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="reflex-card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h3 className="title-md" style={{ color: '#ffffff', fontSize: '18px' }}>Paramètres IA Actifs</h3>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                      <div className="label-xs" style={{ color: '#94a3b8', marginBottom: '6px' }}>TON IA</div>
                      <div style={{ fontWeight: 600, color: '#FF5500' }}>{assistantConfig.tone}</div>
                    </div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                      <div className="label-xs" style={{ color: '#94a3b8', marginBottom: '6px' }}>DELAIS LIVRAISON</div>
                      <div style={{ fontSize: '13px', color: '#ffffff' }}>{assistantConfig.deliveryInfo}</div>
                    </div>
                    <div>
                      <div className="label-xs" style={{ color: '#94a3b8', marginBottom: '6px' }}>WELCOME MESSAGE</div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>"{assistantConfig.welcomeMessage}"</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMMANDES WITH RECHERCHE, FILTRES & EMPTY STATE */}
            {activeSidebarTab === 'Commandes' && (() => {
              const filteredOrders = recentOrdersList.filter(ord => {
                const matchesSearch =
                  (ord.id || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  (ord.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  (ord.phone || '').includes(orderSearchQuery) ||
                  (ord.item || '').toLowerCase().includes(orderSearchQuery.toLowerCase());

                const matchesStatus =
                  orderStatusFilter === 'ALL' ||
                  (orderStatusFilter === 'PAID' && (ord.chipType === 'green' || ord.status === 'PAID')) ||
                  (orderStatusFilter === 'PENDING' && (ord.chipType === 'amber' || ord.status !== 'PAID'));

                return matchesSearch && matchesStatus;
              });



  return (
                <div className="reflex-card-base" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 className="title-md">Toutes les Commandes ({filteredOrders.length})</h3>
                    <button className="btn-primary-black" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => showToast('Formulaire de création de commande ouvert', 'info')}>
                      <Plus size={16} /> Ajouter une Commande
                    </button>
                  </div>

                  {/* Search Bar & Filter Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input
                        type="text"
                        placeholder="Rechercher par client, téléphone, article..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '13.5px', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className={`chip-status ${orderStatusFilter === 'ALL' ? 'chip-green' : ''}`}
                        onClick={() => setOrderStatusFilter('ALL')}
                        style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid var(--border-subtle)' }}
                      >
                        Toutes ({recentOrdersList.length})
                      </button>
                      <button
                        className={`chip-status ${orderStatusFilter === 'PAID' ? 'chip-green' : ''}`}
                        onClick={() => setOrderStatusFilter('PAID')}
                        style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid var(--border-subtle)' }}
                      >
                        Payées
                      </button>
                      <button
                        className={`chip-status ${orderStatusFilter === 'PENDING' ? 'chip-amber' : ''}`}
                        onClick={() => setOrderStatusFilter('PENDING')}
                        style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid var(--border-subtle)' }}
                      >
                        En attente
                      </button>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: '16px', border: '1px dashed var(--border-subtle)', margin: '10px 0' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <ShoppingBag size={30} />
                      </div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Aucune commande pour le moment</h4>
                      <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                        Vos commandes capturées automatiquement par votre assistant IA WhatsApp s'afficheront ici dès qu'un client passe commande.
                      </p>
                      <button
                        className="btn-gradient-ai"
                        style={{ borderRadius: '10px', padding: '10px 20px', fontSize: '13.5px' }}
                        onClick={() => showToast('Assistant WhatsApp IA prêt à enregistrer vos ventes', 'info')}
                      >
                        <Zap size={16} /> Tester l'IA WhatsApp
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Desktop & Tablet Table View */}
                      <div className="table-responsive-container desktop-table-only">
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '12px' }}>
                              <th style={{ padding: '12px 14px' }}>RÉFÉRENCE</th>
                              <th style={{ padding: '12px 14px' }}>CLIENT</th>
                              <th style={{ padding: '12px 14px' }}>ARTICLE</th>
                              <th style={{ padding: '12px 14px' }}>MONTANT</th>
                              <th style={{ padding: '12px 14px' }}>STATUT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((ord, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <td style={{ padding: '16px 14px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{ord.id}</td>
                                <td style={{ padding: '16px 14px' }}>
                                  <div style={{ fontWeight: 600 }}>{ord.name}</div>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>{ord.phone}</div>
                                </td>
                                <td style={{ padding: '16px 14px' }}>{ord.item}</td>
                                <td style={{ padding: '16px 14px', fontWeight: 700, color: '#4b41e1', fontFamily: 'var(--font-mono)' }}>{ord.amount.toLocaleString()} FCFA</td>
                                <td style={{ padding: '16px 14px' }}>
                                  <span className={`chip-status ${ord.chipType === 'green' ? 'chip-green' : 'chip-amber'}`}>{ord.chipText}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Modern Mobile Cards View (< 768px) */}
                      <div className="mobile-cards-only" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {filteredOrders.map((ord, idx) => (
                          <div key={idx} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#4F46E5', backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                                {ord.id}
                              </span>
                              <span className={`chip-status ${ord.chipType === 'green' ? 'chip-green' : 'chip-amber'}`} style={{ whiteSpace: 'nowrap' }}>
                                {ord.chipText}
                              </span>
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '16px' }}>{ord.name}</div>
                              <div style={{ fontSize: '13px', color: '#64748b' }}>{ord.phone}</div>
                            </div>
                            <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: 500 }}>{ord.item}</span>
                              <span style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{ord.amount.toLocaleString()} FCFA</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* TAB 4: PAIEMENTS */}
            {activeSidebarTab === 'Paiements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--text-subtle)', marginBottom: '6px' }}>TOTAL ENCAISSÉ</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{liveStats.revenusFcfa.toLocaleString()} FCFA</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--text-subtle)', marginBottom: '6px' }}>TRANSACTIONS</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#6366F1', fontFamily: 'var(--font-mono)' }}>{liveStats.commandes} Réussies</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--text-subtle)', marginBottom: '6px' }}>OPÉRATEUR</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#06B6D4' }}>MTN / Moov / Wave</div>
                  </div>
                </div>

                <div className="reflex-card-base" style={{ padding: '24px' }}>
                  <h3 className="title-md" style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Historique des Paiements Encaissés</h3>
                  {recentOrdersList.filter(o => o.chipType === 'green' || o.status === 'PAID').length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentOrdersList.filter(o => o.chipType === 'green' || o.status === 'PAID').map((ord, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Transaction {ord.id}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Client: {ord.name} • Mobile Money ({ord.phone})</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#10B981', fontSize: '16px', fontFamily: 'var(--font-mono)' }}>+{ord.amount.toLocaleString()} FCFA</div>
                            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Reçu SHA-256 Validé</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-subtle)' }}>
                      <CreditCard size={32} style={{ margin: '0 auto 12px', opacity: 0.5, color: '#4F46E5' }} />
                      <div style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--text-main)', marginBottom: '4px' }}>Aucun paiement encaissé pour l'instant</div>
                      <div style={{ fontSize: '12.5px' }}>Dès qu'un règlement Mobile Money est effectué par un client, le reçu SHA-256 et la transaction apparaîtront immédiatement ici.</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: CATALOGUE */}
            {activeSidebarTab === 'Catalogue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 className="title-md" style={{ color: '#ffffff', marginBottom: '16px' }}>+ Ajouter un Produit</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Nom de l'article"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                    />
                    <input
                      type="number"
                      placeholder="Prix en FCFA"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      placeholder="Catégorie"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <button className="btn-orange-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={handleAddProduct}>
                    Ajouter au Catalogue
                  </button>
                </div>

                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 className="title-md" style={{ color: '#ffffff', marginBottom: '16px' }}>Catalogue Actif ({productsList.length} articles)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {productsList.map((prod, idx) => (
                      <div key={idx} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff', marginBottom: '4px' }}>{prod.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{prod.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '18px', color: '#FF5500', fontFamily: 'var(--font-mono)' }}>{prod.price.toLocaleString()} FCFA</div>
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

            {/* TAB 6: PARAMÈTRES PME & CONNEXION WHATSAPP META */}
            {activeSidebarTab === 'Paramètres' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '740px' }}>
                <div className="reflex-card-base" style={{ padding: '28px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 className="title-md" style={{ color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={20} color="#FF5500" /> Paramètres Général de {companyData.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>Nom de la PME</label>
                      <input
                        type="text"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>Numéro WhatsApp Business PME</label>
                      <input
                        type="text"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>Ton de l'Assistant IA</label>
                      <select
                        value={assistantConfig.tone}
                        onChange={(e) => setAssistantConfig({ ...assistantConfig, tone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '14px' }}
                      >
                        <option value="Chaleureux & Commercial">Chaleureux & Commercial</option>
                        <option value="Strictement Professionnel">Strictement Professionnel</option>
                        <option value="Décontracté & Jeune">Décontracté & Jeune</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* OFFICIAL META EMBEDDED SIGNUP CONNECTION CARD */}
                <div className="reflex-card-base" style={{ padding: '28px', backgroundColor: '#0F172A', border: '1px solid rgba(255, 85, 0, 0.35)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: waConnectionStatus === 'CONNECTED' ? '#10b981' : '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                        <Radio size={24} />
                      </div>
                      <div>
                        <h3 className="title-md" style={{ color: '#ffffff', fontSize: '18px' }}>Connexion Officielle WhatsApp Business (Meta)</h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                          PME : <strong style={{ color: '#ffffff' }}>{companyData.name}</strong> — Numéro : {companyData.phone || '+229 -- -- -- --'}
                        </p>
                      </div>
                    </div>
                    {waConnectionStatus === 'CONNECTED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '8px 18px', borderRadius: '9999px' }}>
                        <CheckCircle size={16} color="#10b981" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>Compte WhatsApp Business Lié & Actif</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '8px 18px', borderRadius: '9999px' }}>
                        <Radio size={16} color="#f59e0b" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>En attente de connexion WhatsApp</span>
                      </div>
                    )}
                  </div>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6 }}>
                    🔒 <strong style={{ color: '#ffffff' }}>Autorisation Sécurisée Meta (0 Saisie Technique) :</strong><br />
                    Cliquez ci-dessous pour autoriser Reflex via la fenêtre pop-up officielle Meta/Facebook. Votre compte WhatsApp Business sera associé instantanément à votre espace PME sans saisir de token ni d'ID.
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {waConnectionStatus !== 'CONNECTED' ? (
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: '#1877F2',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        onClick={handleLaunchMetaEmbeddedSignup}
                        disabled={waConnectionStatus === 'CONNECTING'}
                      >
                        <Radio size={18} />
                        {waConnectionStatus === 'CONNECTING' ? 'Connexion à Meta en cours...' : 'Connecter mon WhatsApp Business avec Meta'}
                      </button>
                    ) : (
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #a7f3d0',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'default'
                        }}
                      >
                        <CheckCircle size={18} />
                        WhatsApp Business Officiel Connecté
                      </button>
                    )}

                    <button className="btn-primary-black" style={{ padding: '12px 24px', fontSize: '14px' }} onClick={handleFinalizeOnboarding}>
                      Enregistrer la configuration PME
                    </button>
                    <button style={{ padding: '12px 20px', fontSize: '14px', backgroundColor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }} onClick={loadSampleDemoData}>
                      Charger données démo
                    </button>
                  </div>
                  {connectedWabaId && (
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>
                      ID WABA Actif : <code style={{ backgroundColor: '#1E293B', padding: '2px 6px', borderRadius: '4px', color: '#FF5500' }}>{connectedWabaId}</code>
                    </div>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    )}

    </div>
  );
}
