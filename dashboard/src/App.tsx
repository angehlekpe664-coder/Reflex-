import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
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
  Shield,
  Receipt,
  LogOut,
  Sun,
  Moon,
  Search,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Smartphone,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { apiFetch } from './lib/api';
import { Turnstile } from '@marsidev/react-turnstile';
import { translations } from './translations';
import { LandingPage } from './components/LandingPage';



import { ReceiptModal } from './components/ReceiptModal';
import { SkeletonCard, SkeletonTable } from './components/SkeletonLoader';

type CatalogProduct = {
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
};

// Cloudflare Turnstile Captcha Component for Auth Modal
function TurnstileContainer({ onVerify, onError }: { onVerify?: (token: string) => void; onError?: (err: any) => void }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || '0x4AAAAAAEnLp3-m1biy8CGz';

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
    const isPlanSuccess = window.location.search.includes('plan_success=true');
    if (isOAuth || isPlanSuccess) return 'loading';
    if (window.location.hash.includes('pay') || window.location.pathname.includes('pay')) return 'payment-checkout';
    return 'landing';
  };

  // Navigation Flow State
  const [activeView, setActiveView] = useState<
    'landing' | 'auth' | 'onboarding-entreprise' | 'onboarding-catalogue' | 'onboarding-assistant' | 'onboarding-whatsapp' | 'onboarding-plan-payment' | 'dashboard' | 'mobile-dash' | 'payment-checkout' | 'loading'
  >(checkInitialView);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({ name: 'Pro', price: 50000 });

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

  // Onboarding Form States
  const [companyData, setCompanyData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('reflex_pme_phone');
      const savedName = localStorage.getItem('reflex_pme_name');
      const savedSector = localStorage.getItem('reflex_pme_sector');
      const savedDesc = localStorage.getItem('reflex_pme_description');
      if (savedPhone) {
        return {
          name: savedName || '',
          sector: savedSector || 'Mode & Vêtements',
          phone: savedPhone,
          description: savedDesc || ''
        };
      }
    }
    return {
      name: '',
      sector: 'Mode & Vêtements',
      phone: '+229 ',
      description: ''
    };
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const [productsList, setProductsList] = useState<CatalogProduct[]>([]);
  const [currentPmeId, setCurrentPmeId] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Mode', description: '' });

  const [assistantConfig, setAssistantConfig] = useState({
    tone: 'Chaleureux & Commercial',
    welcomeMessage: 'Bonjour ! Bienvenue. Que puis-je faire pour vous aujourd\'hui ?',
    deliveryInfo: 'Livraison sous 24h à Cotonou, Calavi et Porto-Novo.'
  });



  // Active Dashboard Sidebar Tab State
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'Vue d\'ensemble' | 'Commandes' | 'Catalogue' | 'Paramètres'
  >('Vue d\'ensemble');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const switchTab = (tab: 'Vue d\'ensemble' | 'Commandes' | 'Catalogue' | 'Paramètres') => {
    setIsTabLoading(true);
    setActiveSidebarTab(tab);
    setTimeout(() => setIsTabLoading(false), 220);
  };

  // WhatsApp Official Meta Connection State
  const [waConnectionStatus, setWaConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [connectedWabaId, setConnectedWabaId] = useState<string | null>(null);
  const [metaPrepStep, setMetaPrepStep] = useState<1 | 2>(1);
  const [metaProgressStep, setMetaProgressStep] = useState<1 | 2 | 3 | 4>(1);

  const handleLaunchMetaEmbeddedSignup = () => {
    const metaAppId = (import.meta.env.VITE_META_APP_ID as string | undefined) || '1875740770498760';
    const metaConfigId = (import.meta.env.VITE_META_CONFIG_ID as string | undefined);
    setWaConnectionStatus('CONNECTING');
    setMetaProgressStep(1);

    const redirectUri = encodeURIComponent(window.location.origin);
    const metaAuthUrl = metaConfigId
      ? `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${redirectUri}&config_id=${metaConfigId}&response_type=code`
      : `https://www.facebook.com/v20.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${redirectUri}&scope=whatsapp_business_management,whatsapp_business_messaging,public_profile&response_type=code`;

    const width = 600;
    const height = 750;
    const left = Math.max(0, Math.floor((window.screen.width - width) / 2));
    const top = Math.max(0, Math.floor((window.screen.height - height) / 2));

    const popup = window.open(
      metaAuthUrl,
      'FacebookLoginForBusiness',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = metaAuthUrl;
    }
  };

  const handleDemoNumberConnect = async () => {
    setWaConnectionStatus('CONNECTING');
    setMetaProgressStep(1);
    await new Promise(r => setTimeout(r, 600));
    setMetaProgressStep(2);
    await new Promise(r => setTimeout(r, 700));
    setMetaProgressStep(3);
    await new Promise(r => setTimeout(r, 700));
    setMetaProgressStep(4);
    await new Promise(r => setTimeout(r, 600));
    setWaConnectionStatus('CONNECTED');
    showToast('Numéro de démonstration WhatsApp connecté avec succès !', 'success');
  };

  // Mobile Navigation Drawer State
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashMobileMenuOpen, setDashMobileMenuOpen] = useState(false);



  // FAQ Accordion Open Index State
  // const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);



  // Load Products & PME Profile from Supabase DB on user sign-in
  useEffect(() => {
    const fetchSupabaseUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: pmeRows } = await supabase
            .from('pmes')
            .select('*')
            .eq('user_id', session.user.id)
            .limit(1);
          const pme = pmeRows?.[0];
          if (pme) {
            setCurrentPmeId(pme.id);
            setCompanyData(prev => ({
              name: pme.name || prev.name,
              sector: pme.business_type || pme.sector || prev.sector,
              phone: pme.whatsapp_phone_number || prev.phone,
              description: pme.description || prev.description
            }));
            if (session.user.email) {
              localStorage.setItem(`reflex_onboarded_${session.user.email.toLowerCase()}`, 'true');
            }
            if (pme.whatsapp_status === 'CONNECTED' || (typeof window !== 'undefined' && localStorage.getItem('reflex_wa_status') === 'CONNECTED')) {
              setWaConnectionStatus('CONNECTED');
              setConnectedWabaId(pme.waba_id || (typeof window !== 'undefined' ? localStorage.getItem('reflex_waba_id') : null));
            }
            if (pme.tone || pme.welcome_message || pme.delivery_info) {
              setAssistantConfig(prev => ({
                tone: pme.tone || prev.tone,
                welcomeMessage: pme.welcome_message || prev.welcomeMessage,
                deliveryInfo: pme.delivery_info || prev.deliveryInfo
              }));
            }
          }

          let productsQuery = supabase.from('products').select('*');
          if (pme?.id) {
            productsQuery = productsQuery.eq('pme_id', pme.id);
          }
          const { data: dbProds } = await productsQuery;
          if (dbProds && dbProds.length > 0) {
            setProductsList(dbProds.map(p => ({
              id: p.id,
              name: p.name,
              price: Number(p.price_xof || p.price || 0),
              category: p.category || 'Général',
              description: p.description || ''
            })));
          }

          let ordersQuery = supabase.from('orders').select('*');
          if (pme?.id) {
            ordersQuery = ordersQuery.eq('pme_id', pme.id);
          }
          const { data: dbOrders } = await ordersQuery;
          if (dbOrders && dbOrders.length > 0) {
            setRecentOrdersList(dbOrders.map(o => ({
              id: o.order_number || o.id,
              name: o.customer_name || 'Client WhatsApp',
              phone: o.customer_phone || '',
              time: new Date(o.created_at || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              status: o.status || 'PENDING',
              amount: Number(o.total_amount_xof || o.total_amount || o.amount || 0),
              item: o.items_description || o.item || 'Produit',
              avatar: o.customer_name ? o.customer_name.substring(0, 2).toUpperCase() : 'WA',
              chipText: o.status === 'PAID' ? 'Payé' : 'En attente',
              chipType: o.status === 'PAID' ? 'green' : 'amber',
              summary: o.summary || 'Commande enregistrée.'
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

  // Interactive Language Switcher State (FR, EN)
  const [currentLang, setCurrentLang] = useState<'FR' | 'EN'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reflex_language');
      return saved === 'EN' ? 'EN' : 'FR';
    }
    return 'FR';
  });
  const t = translations[currentLang] || translations.FR;
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any>({
    id: 'ORD-229-892',
    pmeName: 'Boutique Élégance Bénin',
    item: 'Perruque Brésilienne 18 pouces',
    amount: 45000,
    customerPhone: '97 45 12 89',
    customerName: 'Koffi Mensah',
    deliveryAddress: 'Cotonou, Quartier Cadjehoun'
  });

  const availableLanguages = [
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'EN', label: 'English', flag: '🇬🇧' },
  ];

  const handleSelectLanguage = (langCode: 'FR' | 'EN') => {
    setCurrentLang(langCode);
    localStorage.setItem('reflex_language', langCode);
    setLangMenuOpen(false);
    const langObj = availableLanguages.find(l => l.code === langCode);
    showToast(`Language: ${langObj?.flag} ${langObj?.label}`, 'info');
  };

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
        const response = await apiFetch('/api/dashboard/stats');
        if (!response.ok) return;
        const data = await response.json();
        if (data.stats) {
          setLiveStats({
            conversations: data.stats.totalMessages || 0,
            autoAiPercent: data.stats.totalMessages > 0 ? (data.stats.autoAiPercent || 100) : 0,
            commandes: data.recentOrders ? data.recentOrders.length : (data.stats.ordersCount || 0),
            revenusFcfa: data.stats.totalRevenue || 0,
            conversionPercent: data.stats.conversionRate || 0
          });
        }
        if (data.recentOrders && Array.isArray(data.recentOrders) && data.recentOrders.length > 0) {
          const mappedOrders = data.recentOrders.map((ord: any) => ({
            id: ord.id || '—',
            name: ord.customerName || 'Client WhatsApp',
            phone: ord.phone || '',
            time: ord.time || 'Récemment',
            amount: Number(ord.amount || 0),
            item: ord.item || 'Article',
            avatar: ord.customerName ? ord.customerName.substring(0, 2).toUpperCase() : 'WA',
            chipText: ord.status === 'PAID' ? 'Payé' : 'En attente',
            chipType: ord.status === 'PAID' ? 'green' : 'amber',
            summary: ord.summary?.conclusion || ord.lastMsg || 'Nouvelle commande.'
          }));
          setRecentOrdersList(mappedOrders);
        }
      } catch {
        /* conserver les dernières données connues */
      }
    };

    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Helper to determine if a user has already completed onboarding
  const checkUserIsOnboarded = (user?: any, userEmail?: string) => {
    if (user?.user_metadata?.onboarded === true || user?.user_metadata?.onboarded === 'true') return true;
    if (userEmail && localStorage.getItem(`reflex_onboarded_${userEmail.toLowerCase()}`) === 'true') return true;
    return false;
  };

  // Popup window auto-notify opener & listener for Meta Embedded Signup
  useEffect(() => {
    if (window.opener && (window.location.search.includes('code=') || window.location.hash.includes('code='))) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        window.opener.postMessage({ type: 'REFLEX_META_OAUTH_CODE', code }, '*');
        window.close();
      }
    }

    const handleMetaPopupMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'REFLEX_META_OAUTH_CODE' && event.data?.code) {
        const code = event.data.code;
        setMetaProgressStep(2);
        await new Promise(r => setTimeout(r, 700));
        setMetaProgressStep(3);
        await new Promise(r => setTimeout(r, 700));

        try {
          const res = await apiFetch('/api/auth/meta/callback', {
            method: 'POST',
            body: JSON.stringify({
              code,
              wabaId: 'mock-waba-' + Date.now(),
              pmePhone: companyData.phone
            })
          });
          const callbackData = await res.json().catch(() => ({}));
          setMetaProgressStep(4);
          await new Promise(r => setTimeout(r, 600));
          setWaConnectionStatus('CONNECTED');
          if (callbackData?.wabaId) setConnectedWabaId(callbackData.wabaId);
          if (typeof window !== 'undefined') {
            localStorage.setItem('reflex_wa_status', 'CONNECTED');
            if (callbackData?.wabaId) localStorage.setItem('reflex_waba_id', callbackData.wabaId);
          }
          if (currentPmeId) {
            await supabase.from('pmes').update({
              whatsapp_status: 'CONNECTED',
              waba_id: callbackData?.wabaId || 'mock-waba',
              is_ai_active: true
            }).eq('id', currentPmeId);
          }
          showToast('Compte WhatsApp Business connecté avec succès !', 'success');
        } catch {
          setMetaProgressStep(4);
          await new Promise(r => setTimeout(r, 600));
          setWaConnectionStatus('CONNECTED');
          if (typeof window !== 'undefined') {
            localStorage.setItem('reflex_wa_status', 'CONNECTED');
          }
        }
      }
    };

    window.addEventListener('message', handleMetaPopupMessage);
    return () => window.removeEventListener('message', handleMetaPopupMessage);
  }, [companyData.phone]);

  // Listen for Supabase OAuth return & session state changes
  useEffect(() => {
    const isOAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code');
    const isPlanSuccess = window.location.search.includes('plan_success=true');

    const routeUserAfterAuth = (user: any) => {
      const userEmail = user?.email || '';
      const userFullName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0] || '';
      
      setFullName(userFullName);
      setEmail(userEmail);
      localStorage.setItem('reflex_user_session', 'true');

      if (isPlanSuccess) {
        localStorage.setItem('reflex_onboarded_completed', 'true');
        localStorage.setItem(`reflex_onboarded_${userEmail.toLowerCase()}`, 'true');
      }

      // Clean OAuth or Plan Success URL params from browser history to avoid landing flash on reload
      if ((isOAuthReturn || isPlanSuccess) && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      setActiveView(currentView => {
        if (isPlanSuccess) return 'dashboard';
        if (isOAuthReturn || currentView === 'loading' || currentView === 'auth') {
          if (checkUserIsOnboarded(user, userEmail)) {
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

  // Submit Onboarding to Backend & Save PME Config
  const handleFinalizeOnboarding = async () => {
    setSaveLoading(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('reflex_pme_phone', companyData.phone);
      localStorage.setItem('reflex_pme_name', companyData.name);
      localStorage.setItem('reflex_pme_sector', companyData.sector);
      localStorage.setItem('reflex_pme_description', companyData.description);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await apiFetch('/api/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          companyData,
          productsList,
          assistantConfig,
          pmeId: currentPmeId,
          userId: user?.id
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        showToast(data.error || 'Enregistrement backend incomplet. Réessayez.', 'error');
        setSaveLoading(false);
        return;
      }
      if (data.config?.id) setCurrentPmeId(data.config.id);
      setWaConnectionStatus('CONNECTED');
      showToast(`Configuration enregistrée et WhatsApp activé pour ${companyData.name || companyData.phone}.`, 'success');
    } catch {
      showToast('Impossible d’enregistrer la configuration (réseau ou serveur).', 'error');
      setSaveLoading(false);
      return;
    } finally {
      setSaveLoading(false);
    }

    // Persist onboarded status in Supabase Cloud user metadata
    try {
      await supabase.auth.updateUser({
        data: {
          onboarded: true,
          company_name: companyData.name,
          phone: companyData.phone
        }
      });
    } catch (e) {
      console.log('Supabase user metadata sync error:', e);
    }

    localStorage.setItem('reflex_user_session', 'true');

    if (selectedPlan && selectedPlan.price > 0 && selectedPlan.name !== 'Free') {
      setActiveView('onboarding-plan-payment');
    } else {
      localStorage.setItem('reflex_onboarded_completed', 'true');
      if (email) localStorage.setItem(`reflex_onboarded_${email.toLowerCase()}`, 'true');
      setActiveView('dashboard');
    }
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
    const turnstileKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (turnstileKey && !captchaToken) {
      showToast('Veuillez valider le captcha avant de continuer.', 'error');
      return;
    }
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const signUpOptions: any = { data: { full_name: fullName } };
        if (captchaToken) signUpOptions.captchaToken = captchaToken;

        const res = await supabase.auth.signUp({
          email,
          password,
          options: signUpOptions
        });
        if (res.error) throw res.error;

        if (res.data?.session) {
          localStorage.setItem('reflex_user_session', 'true');
          showToast('Compte créé. Configurez votre PME.', 'success');
          setActiveView('onboarding-entreprise');
        } else {
          setShowOtpStep(true);
          showToast('Un code de confirmation a été envoyé par e-mail.', 'info');
        }
      } else {
        const signInOptions: any = {};
        if (captchaToken) signInOptions.captchaToken = captchaToken;

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: Object.keys(signInOptions).length ? signInOptions : undefined
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
      showToast(err?.message || 'Authentification impossible.', 'error');
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
    } catch (err: any) {
      showToast(err?.message || 'Connexion Google impossible.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };



  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      showToast('Nom et prix du produit requis.', 'error');
      return;
    }
    const prodItem: CatalogProduct = {
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'Général',
      description: newProduct.description || ''
    };

    if (!currentPmeId) {
      setProductsList(prev => [...prev, prodItem]);
      setNewProduct({ name: '', price: '', category: 'Mode', description: '' });
      showToast(`Produit "${prodItem.name}" ajouté. Il sera enregistré à la fin de l’onboarding.`, 'info');
      return;
    }

    try {
      const { data, error } = await supabase.from('products').insert({
        pme_id: currentPmeId,
        name: prodItem.name,
        price_xof: prodItem.price,
        category: prodItem.category,
        description: prodItem.description,
        is_active: true
      }).select('id').single();
      if (error) throw error;
      prodItem.id = data?.id;
      setProductsList(prev => [...prev, prodItem]);
      setNewProduct({ name: '', price: '', category: 'Mode', description: '' });
      showToast(`Produit "${prodItem.name}" enregistré.`, 'success');
    } catch {
      showToast('Impossible d’enregistrer le produit en base.', 'error');
    }
  };

  const handleDeleteProduct = async (index: number) => {
    const target = productsList[index];
    if (target?.id) {
      const { error } = await supabase.from('products').delete().eq('id', target.id);
      if (error) {
        showToast('Suppression en base impossible.', 'error');
        return;
      }
    }
    setProductsList(productsList.filter((_, i) => i !== index));
  };

  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  const handleProcessPayment = async () => {
    const phone = payerPhone.replace(/\D/g, '');
    if (phone.length < 8) {
      showToast('Numéro Mobile Money invalide (8 chiffres).', 'error');
      return;
    }
    setPaymentLoading(true);
    try {
      const res = await apiFetch('/api/payments/fedapay/create', {
        method: 'POST',
        body: JSON.stringify({
          amount: currentCheckoutOrder.amount,
          description: currentCheckoutOrder.item,
          customerName: currentCheckoutOrder.customerName,
          customerPhone: `229${phone}`,
          orderId: currentCheckoutOrder.id
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.paymentUrl) {
        showToast(data.error || 'Impossible de créer le lien de paiement.', 'error');
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      showToast('Erreur réseau lors de la création du paiement.', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };



  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-bg)', fontFamily: 'var(--font-geist)' }}>
      {toast && (
        <div className="toast-global toast-container">
          <div className={`toast-notification toast-${toast.type}`}>
            <CheckCircle size={18} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 0. SMOOTH LOADING SCREEN DURING OAUTH/SESSION INITIALIZATION */}
      {activeView === 'loading' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', color: '#ffffff' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '20px' }} />
          <div className="font-outfit" style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>Connexion en cours...</div>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '8px' }}>Validation de votre compte Reflex...</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STYLISH CONTEXTUAL LANDING PAGE WITH RELAY TECH EXACT DESIGN & LAYOUT */}
      {activeView === 'landing' && (
        <LandingPage 
          currentLang={currentLang}
          handleSelectLanguage={handleSelectLanguage}
          setActiveView={setActiveView}
          setAuthMode={setAuthMode}
          setSelectedPlan={setSelectedPlan}
          t={t}
          showScrollTop={showScrollTop}
          langMenuOpen={langMenuOpen}
          setLangMenuOpen={setLangMenuOpen}
          availableLanguages={availableLanguages}
        />
      )}
      
      {/* 2. AUTH PAGE (Compact Viewport Fit - Exact 50/50 Split Screen) */}
      {activeView === 'auth' && (
        <div className="auth-split-wrapper">
          
          {/* LEFT COLUMN: FORM SIDE (EXACT 50% Desktop, 100% Mobile) */}
          <div className="auth-split-left" style={{ backgroundColor: '#0B1727', color: '#ffffff' }}>
            {/* Top Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
                <img src="/logo.png" alt="Reflex Logo" style={{ height: '48px', width: 'auto' }} />
              </div>
            </div>

            {/* Main Form Center Content */}
            <div style={{ width: '100%', maxWidth: '420px', margin: 'auto 0' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.5px' }}>
                {authMode === 'signup' ? t.authWelcomeSignup : t.authWelcomeLogin}
              </h1>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
                {authMode === 'signup' 
                  ? t.authSubSignup
                  : t.authSubLogin}
              </p>

              {/* Social SSO Login Button (Google) */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                {t.googleAuthBtn}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#64748b' }}>
                <div style={{ flex: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                <span style={{ padding: '0 12px', fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.authOrSeparator}</span>
                <div style={{ flex: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
              </div>

              {/* Form Content: OTP Verification vs Standard Auth Form */}
              {showOtpStep ? (
                <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#FF5500', fontSize: '14px', marginBottom: '4px' }}>Code OTP Envoyé</div>
                    <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                      Un code de confirmation à 6 chiffres a été envoyé à <strong style={{ color: '#ffffff' }}>{email}</strong>.
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px', display: 'block', textAlign: 'center' }}>Entrez le code</label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      placeholder="12345678"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '2px solid #FF5500',
                        backgroundColor: 'rgba(11, 23, 39, 0.9)',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '22px',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        textAlign: 'center'
                      }}
                    />
                  </div>

                  <button type="submit" className="btn-primary-orange" style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '12px' }} disabled={authLoading}>
                    {authLoading ? 'Validation...' : 'Valider le Code →'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpStep(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12.5px', cursor: 'pointer', textAlign: 'center' }}
                  >
                    ← Modifier l'adresse e-mail ({email})
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSupabaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {authMode === 'signup' && (
                    <div>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px', display: 'block' }}>{t.fullNameLabel}</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input
                          type="text"
                          required
                          placeholder="Alex Mensah"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px', display: 'block' }}>{t.emailLabel}</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                      <input
                        type="email"
                        required
                        placeholder="alex@boutique.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px', display: 'block' }}>{t.passwordLabel}</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '11px 40px 11px 40px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '14px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}
                        aria-label="Afficher ou masquer le mot de passe"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Cloudflare Turnstile Captcha Widget */}
                  <TurnstileContainer onVerify={setCaptchaToken} onError={() => setCaptchaToken('')} />

                  {/* Primary Action Button (Vivid Cloudflare Orange Style CTA) */}
                  <button
                    type="submit"
                    className="btn-primary-orange"
                    disabled={authLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: 700,
                      marginTop: '4px'
                    }}
                  >
                    {authLoading 
                      ? '...' 
                      : (authMode === 'signup' ? t.submitSignup : t.submitLogin)}
                  </button>
                </form>
              )}

              {/* Switch Auth Mode Footer */}
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13.5px', color: '#94a3b8' }}>
                {authMode === 'signup' ? (
                  <span style={{ color: '#FF5500', fontWeight: 700, cursor: 'pointer' }} onClick={() => setAuthMode('login')}>{t.toggleToLogin}</span>
                ) : (
                  <span style={{ color: '#FF5500', fontWeight: 700, cursor: 'pointer' }} onClick={() => setAuthMode('signup')}>{t.toggleToSignup}</span>
                )}
              </div>
            </div>

            {/* Terms and Privacy Footer */}
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              En continuant, vous acceptez nos <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#cbd5e1' }}>Conditions</span> et <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#cbd5e1' }}>Politique de confidentialité</span>.
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
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.2)', padding: '5px 14px', borderRadius: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', userSelect: 'none' }}
                >
                  <Globe size={13} /> {availableLanguages.find((l: any) => l.code === currentLang)?.flag} {availableLanguages.find((l: any) => l.code === currentLang)?.label} ▾
                </div>

                {langMenuOpen && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, minWidth: '150px' }}>
                    {availableLanguages.map((l: any) => (
                      <div
                        key={l.code}
                        onClick={() => handleSelectLanguage(l.code as any)}
                        style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: currentLang === l.code ? '#FF5500' : '#ffffff', fontWeight: currentLang === l.code ? 700 : 500, backgroundColor: currentLang === l.code ? 'rgba(255,85,0,0.15)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </div>
                    ))}
                  </div>
                )}
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
      {/* 3. ONBOARDING STEP 1: ENTREPRISE */}
      
      {/* 3. ONBOARDING STEP 1: ENTREPRISE */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-entreprise' && (
        <div className="onboarding-flow" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px 140px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '720px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.png" alt="Reflex Logo" style={{ height: '52px', width: 'auto', borderRadius: '10px' }} />
            </div>
          </div>

          <div className="onboarding-card-dark" style={{ width: '100%', maxWidth: '720px', padding: '38px 34px' }}>
            {/* Onboarding Stepper Header */}
            <div style={{ width: '100%', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }}>
                  <div style={{ height: '100%', backgroundColor: '#FF5500', width: '0%', transition: 'width 0.3s ease', boxShadow: '0 0 10px rgba(255, 85, 0, 0.8)' }} />
                </div>
                {[
                  { step: 1, label: 'Entreprise' },
                  { step: 2, label: 'Catalogue' },
                  { step: 3, label: 'Assistant IA' },
                  { step: 4, label: 'WhatsApp' }
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, position: 'relative' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 1 >= s.step ? '#0B1727' : 'rgba(15, 23, 42, 0.9)',
                      border: 1 === s.step ? '2px solid #FF5500' : '2px solid rgba(255, 255, 255, 0.15)',
                      color: 1 === s.step ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      boxShadow: 1 === s.step ? '0 0 15px rgba(255, 85, 0, 0.5)' : 'none'
                    }}>
                      {s.step}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 1 === s.step ? 700 : 500, color: 1 === s.step ? '#FF5500' : '#64748B' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Building size={28} color="#FF5500" />
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Présentez votre entreprise
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                Reflex utilisera ces informations pour configurer l'IA et personnaliser toutes les réponses envoyées à vos clients WhatsApp.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setActiveView('onboarding-catalogue'); }} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Nom de l'entreprise / PME</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boutique Élégance Bénin"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Secteur d'activité</label>
                <select
                  value={companyData.sector}
                  onChange={(e) => setCompanyData({ ...companyData, sector: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                >
                  <option value="Mode & Vêtements">Mode & Vêtements</option>
                  <option value="Cosmétique & Beauté">Cosmétique & Beauté</option>
                  <option value="Électronique & High-Tech">Électronique & High-Tech</option>
                  <option value="Restauration & Alimentation">Restauration & Alimentation</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Numéro WhatsApp Business</label>
                <input
                  type="text"
                  required
                  placeholder="+229 97 00 00 00"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Description de vos services / produits</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez brièvement vos articles et les questions fréquentes..."
                  value={companyData.description}
                  onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary-orange" style={{ width: '100%', padding: '16px', fontSize: '15px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
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
        <div className="onboarding-flow" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px 140px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '720px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.png" alt="Reflex Logo" style={{ height: '52px', width: 'auto', borderRadius: '10px' }} />
            </div>
          </div>

          <div className="onboarding-card-dark" style={{ width: '100%', maxWidth: '720px', padding: '38px 34px' }}>
            {/* Onboarding Stepper Header */}
            <div style={{ width: '100%', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }}>
                  <div style={{ height: '100%', backgroundColor: '#FF5500', width: '33.3%', transition: 'width 0.3s ease', boxShadow: '0 0 10px rgba(255, 85, 0, 0.8)' }} />
                </div>
                {[
                  { step: 1, label: 'Entreprise' },
                  { step: 2, label: 'Catalogue' },
                  { step: 3, label: 'Assistant IA' },
                  { step: 4, label: 'WhatsApp' }
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, position: 'relative' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 2 >= s.step ? '#0B1727' : 'rgba(15, 23, 42, 0.9)',
                      border: 2 >= s.step ? '2px solid #FF5500' : '2px solid rgba(255, 255, 255, 0.15)',
                      color: 2 >= s.step ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      boxShadow: 2 === s.step ? '0 0 15px rgba(255, 85, 0, 0.5)' : 'none'
                    }}>
                      {1 > s.step ? s.step : 2 > s.step ? <Check size={18} color="#FF5500" /> : s.step}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 2 === s.step ? 700 : 500, color: 2 === s.step ? '#FF5500' : 2 > s.step ? '#FFFFFF' : '#64748B' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Store size={28} color="#FF5500" />
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Ajoutez vos premiers produits
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                L'IA Reflex utilisera votre catalogue pour répondre aux demandes de prix et prendre les commandes WhatsApp.
              </p>
            </div>

            {/* List of Products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {productsList.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '16px', color: '#94a3b8', fontSize: '13.5px' }}>
                  Aucun produit dans votre catalogue pour l'instant. Utilisez le formulaire ci-dessous pour en ajouter un.
                </div>
              ) : (
                productsList.map((prod, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#ffffff' }}>{prod.name}</div>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{prod.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#FF5500' }}>
                        {prod.price.toLocaleString()} FCFA
                      </div>
                      <button onClick={() => handleDeleteProduct(i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444', padding: '4px' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Product Box */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 85, 0, 0.4)', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="#FF5500" /> Ajouter un produit au catalogue
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Nom du produit (Ex: Perruque 18 pouces)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '13.5px' }}
                />
                <input
                  type="number"
                  placeholder="Prix en FCFA (Ex: 45000)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '13.5px' }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="btn-secondary-dark"
                style={{ width: '100%', padding: '10px', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={16} /> Ajouter cet article
              </button>
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                onClick={() => setActiveView('onboarding-entreprise')}
                className="btn-secondary-dark"
                style={{ flex: 1, padding: '14px', fontSize: '14px', fontWeight: 600 }}
              >
                ← Précédent
              </button>
              <button
                type="button"
                onClick={() => setActiveView('onboarding-assistant')}
                className="btn-primary-orange"
                style={{ flex: 2, padding: '14px', fontSize: '14.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                Suivant : Assistant IA <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ONBOARDING STEP 3: ASSISTANT IA */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-assistant' && (
        <div className="onboarding-flow" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px 140px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '720px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.png" alt="Reflex Logo" style={{ height: '52px', width: 'auto', borderRadius: '10px' }} />
            </div>
          </div>

          <div className="onboarding-card-dark" style={{ width: '100%', maxWidth: '720px', padding: '38px 34px' }}>
            {/* Onboarding Stepper Header */}
            <div style={{ width: '100%', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }}>
                  <div style={{ height: '100%', backgroundColor: '#FF5500', width: '66.6%', transition: 'width 0.3s ease', boxShadow: '0 0 10px rgba(255, 85, 0, 0.8)' }} />
                </div>
                {[
                  { step: 1, label: 'Entreprise' },
                  { step: 2, label: 'Catalogue' },
                  { step: 3, label: 'Assistant IA' },
                  { step: 4, label: 'WhatsApp' }
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, position: 'relative' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 3 >= s.step ? '#0B1727' : 'rgba(15, 23, 42, 0.9)',
                      border: 3 >= s.step ? '2px solid #FF5500' : '2px solid rgba(255, 255, 255, 0.15)',
                      color: 3 >= s.step ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      boxShadow: 3 === s.step ? '0 0 15px rgba(255, 85, 0, 0.5)' : 'none'
                    }}>
                      {2 >= s.step ? <Check size={18} color="#FF5500" /> : s.step}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 3 === s.step ? 700 : 500, color: 3 === s.step ? '#FF5500' : 3 > s.step ? '#FFFFFF' : '#64748B' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Sparkles size={28} color="#FF5500" />
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Personnalisez votre Assistant IA
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                Définissez le comportement et les règles de réponses automatiques de votre agent IA Reflex.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Ton de communication</label>
                <select
                  value={assistantConfig.tone}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, tone: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px' }}
                >
                  <option value="Chaleureux & Commercial">Chaleureux & Commercial</option>
                  <option value="Strictement Professionnel">Strictement Professionnel</option>
                  <option value="Décontracté & Jeune">Décontracté & Jeune</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Message de bienvenue automatique</label>
                <textarea
                  rows={3}
                  value={assistantConfig.welcomeMessage}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, welcomeMessage: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Informations de livraison & FAQ</label>
                <textarea
                  rows={2}
                  value={assistantConfig.deliveryInfo}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, deliveryInfo: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                onClick={() => setActiveView('onboarding-catalogue')}
                className="btn-secondary-dark"
                style={{ flex: 1, padding: '14px', fontSize: '14px', fontWeight: 600 }}
              >
                ← Précédent
              </button>
              <button
                type="button"
                onClick={() => setActiveView('onboarding-whatsapp')}
                className="btn-primary-orange"
                style={{ flex: 2, padding: '14px', fontSize: '14.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                Suivant : Connexion WhatsApp <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ONBOARDING STEP 4: CONNEXION WHATSAPP */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-whatsapp' && (
        <div className="onboarding-flow" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px 140px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '720px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.png" alt="Reflex Logo" style={{ height: '52px', width: 'auto', borderRadius: '10px' }} />
            </div>
          </div>

          <div className="onboarding-card-dark" style={{ width: '100%', maxWidth: '720px', padding: '38px 34px', textAlign: 'center' }}>
            {/* Onboarding Stepper Header */}
            <div style={{ width: '100%', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }}>
                  <div style={{ height: '100%', backgroundColor: '#FF5500', width: '100%', transition: 'width 0.3s ease', boxShadow: '0 0 10px rgba(255, 85, 0, 0.8)' }} />
                </div>
                {[
                  { step: 1, label: 'Entreprise' },
                  { step: 2, label: 'Catalogue' },
                  { step: 3, label: 'Assistant IA' },
                  { step: 4, label: 'WhatsApp' }
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, position: 'relative' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#0B1727',
                      border: '2px solid #FF5500',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      boxShadow: 4 === s.step ? '0 0 15px rgba(255, 85, 0, 0.5)' : 'none'
                    }}>
                      <Check size={18} color="#FF5500" />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF5500' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4 Content */}
            {waConnectionStatus !== 'CONNECTED' ? (
              <>
                {metaPrepStep === 1 ? (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <h2 style={{ color: '#ffffff', fontSize: '26px', fontWeight: 800, marginBottom: '10px' }}>
                        Petit détour chez Meta. On vous attend ici.
                      </h2>
                      <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto' }}>
                        L'étape suivante se passe chez Meta, pas chez nous. Quatre choses à avoir sous la main — comptez cinq minutes.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
                      {/* Item 1 */}
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          1
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px', marginBottom: '4px' }}>Un compte Facebook</div>
                          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                            Meta vous demandera de vous connecter. N'importe quel compte personnel convient ; il devient l'administrateur de votre compte WhatsApp Business.
                          </div>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          2
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px', marginBottom: '4px' }}>Le nom et les infos de votre entreprise</div>
                          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                            Si vous n'avez pas encore de portfolio Business Meta, Meta le crée avec vous en chemin — ayez sous la main le nom, l'adresse et le site de votre entreprise.
                          </div>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          3
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px', marginBottom: '4px' }}>Votre numéro — déjà sur WhatsApp Business, c'est bon</div>
                          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                            Gardez-le. Meta détecte un numéro qui tourne sur l'application WhatsApp Business et bascule en coexistence : l'application continue de fonctionner et vos conversations restent synchronisées. Mettez d'abord l'application à jour (2.24.17 ou plus). Seul un numéro sur WhatsApp classique doit être libéré — supprimez ce compte, ou utilisez un autre numéro.
                          </div>
                        </div>
                      </div>

                      {/* Item 4 */}
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          4
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '15px', marginBottom: '4px' }}>Ce téléphone, avec vous maintenant</div>
                          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                            Meta y envoie un code et la fenêtre attend que vous le saisissiez. Depuis l'application WhatsApp Business, vous recevez en plus une notification à toucher et un choix de partage de données à confirmer — le tout sur le téléphone.
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMetaPrepStep(2)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: 800,
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #FF5500 0%, #E63900 100%)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(255, 85, 0, 0.35)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Je suis prêt — ouvrir Meta
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <h2 style={{ color: '#ffffff', fontSize: '26px', fontWeight: 800, marginBottom: '10px' }}>
                        Petit détour chez Meta. On vous attend ici.
                      </h2>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 85, 0, 0.3)', borderRadius: '20px', padding: '32px 28px', marginBottom: '28px', textAlign: 'left' }}>
                      {waConnectionStatus === 'CONNECTING' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                          {/* Step 1: Connexion de votre numéro */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ width: '24px', height: '24px', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {metaProgressStep > 1 ? (
                                <CheckCircle size={22} color="#10b981" />
                              ) : metaProgressStep === 1 ? (
                                <Loader2 size={22} color="#FF5500" className="animate-spin" />
                              ) : (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: metaProgressStep >= 1 ? '#ffffff' : '#64748b', fontSize: '15px' }}>
                                Connexion de votre numéro...
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                                Gardez cette page ouverte — Meta nous transmet le numéro.
                              </div>
                            </div>
                          </div>

                          {/* Step 2: Autorisation Meta */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ width: '24px', height: '24px', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {metaProgressStep > 2 ? (
                                <CheckCircle size={22} color="#10b981" />
                              ) : metaProgressStep === 2 ? (
                                <Loader2 size={22} color="#FF5500" className="animate-spin" />
                              ) : (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: metaProgressStep >= 2 ? '#ffffff' : '#64748b', fontSize: '15px' }}>
                                Autorisation Meta
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                                Connexion et validation de l'accès dans la fenêtre Meta.
                              </div>
                            </div>
                          </div>

                          {/* Step 3: Compte WhatsApp Business */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ width: '24px', height: '24px', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {metaProgressStep > 3 ? (
                                <CheckCircle size={22} color="#10b981" />
                              ) : metaProgressStep === 3 ? (
                                <Loader2 size={22} color="#FF5500" className="animate-spin" />
                              ) : (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: metaProgressStep >= 3 ? '#ffffff' : '#64748b', fontSize: '15px' }}>
                                Compte WhatsApp Business
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                                Lecture du compte et du numéro que vous avez choisi.
                              </div>
                            </div>
                          </div>

                          {/* Step 4: Finalisation */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ width: '24px', height: '24px', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {metaProgressStep > 4 ? (
                                <CheckCircle size={22} color="#10b981" />
                              ) : metaProgressStep === 4 ? (
                                <Loader2 size={22} color="#FF5500" className="animate-spin" />
                              ) : (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: metaProgressStep >= 4 ? '#ffffff' : '#64748b', fontSize: '15px' }}>
                                Finalisation
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                                Enregistrement du numéro et synchronisation de ses templates.
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>
                            Votre compte Facebook, votre numéro. Et c'est parti.
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
                              <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>Connectez-vous avec le compte qui administre votre portefeuille Meta.</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
                              <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>Saisissez votre numéro dans la fenêtre Meta. Un numéro WhatsApp Business existant conserve l'app avec la coexistence.</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
                              <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>Autorisez Reflex à gérer les messages du numéro choisi.</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleLaunchMetaEmbeddedSignup}
                            style={{
                              width: '100%',
                              padding: '16px 24px',
                              fontSize: '16px',
                              fontWeight: 800,
                              borderRadius: '14px',
                              background: 'linear-gradient(135deg, #FF5500 0%, #E63900 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '12px',
                              boxShadow: '0 8px 24px rgba(255, 85, 0, 0.35)',
                              transition: 'all 0.2s ease',
                              marginBottom: '14px'
                            }}
                          >
                            Continuer avec Facebook ↗
                          </button>

                          <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#94a3b8' }}>
                            Une fenêtre pop-up Meta s'ouvre. Votre progression reste ici, bien au chaud.
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={handleDemoNumberConnect}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Essayer avec le numéro de démonstration
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWaConnectionStatus('DISCONNECTED'); setMetaPrepStep(1); }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13.5px', cursor: 'pointer' }}
                      >
                        ← Revoir les 4 prérequis
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={36} />
                  </div>
                  <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                    Connexion WhatsApp Réussie !
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                    Votre compte WhatsApp Business est désormais raccordé à Reflex. L'IA autonome est prête à gérer votre boutique.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-primary-orange"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: '#FF5500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onClick={handleFinalizeOnboarding}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Enregistrement...' : 'Valider & Accéder à mon Dashboard'} <ArrowRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6.5. ONBOARDING STEP 5: PAIEMENT DE L'ABONNEMENT FEDAPAY (BEFORE DASHBOARD) */}
      {/* ========================================================================= */}
      {activeView === 'onboarding-plan-payment' && (
        <div className="onboarding-plan-payment-container" style={{ minHeight: '100vh', backgroundColor: '#0B1727', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1727' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src="/logo.png" alt="Reflex Logo" style={{ height: '38px', width: 'auto', borderRadius: '8px' }} />
              <span className="font-outfit" style={{ fontWeight: 800, fontSize: '19px', color: '#ffffff' }}>Checkout</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '13px', fontWeight: 600 }}>
              <Shield size={16} /> Paiement 100% Sécurisé
            </div>
          </div>

          <div className="checkout-two-columns" style={{ flex: 1, display: 'flex', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            
            {/* Colonne Gauche: Informations et Formulaire */}
            <div className="checkout-left-col" style={{ flex: '1.5', padding: '32px 24px 60px 24px', boxSizing: 'border-box' }}>
              
              <div style={{ marginBottom: '32px' }}>
                <h2 className="font-outfit" style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Détails de Facturation</h2>
                <p style={{ color: '#94a3b8', fontSize: '15px' }}>Veuillez confirmer vos informations pour finaliser l'activation de votre abonnement.</p>
              </div>

              <div className="glass-card-dark" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>Prénom & Nom</label>
                    <input type="text" value={fullName || 'PME Reflex'} readOnly style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '14.5px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>Adresse Email</label>
                    <input type="email" value={email} readOnly style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '14.5px', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>Nom de l'entreprise</label>
                  <input type="text" value={companyData?.name || 'Ma Boutique'} readOnly style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '14.5px', outline: 'none' }} />
                </div>
              </div>

              <div className="glass-card-dark" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,85,0,0.3)', backgroundColor: 'rgba(255,85,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,85,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5500' }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Numéro Mobile Money (+229)</h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Sera utilisé pour le prélèvement FedaPay</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ padding: '16px 20px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '16px', fontWeight: 700, color: '#FF5500', display: 'flex', alignItems: 'center' }}>+229</div>
                  <input
                    type="text"
                    placeholder="Ex: 97 00 00 00"
                    value={payerPhone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
                      const formatted = raw.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
                      setPayerPhone(formatted);
                    }}
                    style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '18px', fontWeight: 800, letterSpacing: '0.05em' }}
                  />
                </div>
              </div>
            </div>

            {/* Colonne Droite: Résumé et Paiement */}
            <div className="checkout-right-col" style={{ flex: '1', backgroundColor: '#101B2A', padding: '36px 24px 80px 24px', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <h2 className="font-outfit" style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }}>Résumé de la commande</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Abonnement {selectedPlan.name}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Facturation mensuelle</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FF5500', fontFamily: 'var(--font-mono)' }}>
                  {selectedPlan.price.toLocaleString()} FCFA
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '24px 0', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ color: '#cbd5e1', fontSize: '14.5px' }}>Sous-total</div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{selectedPlan.price.toLocaleString()} FCFA</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#cbd5e1', fontSize: '14.5px' }}>Taxes</div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>0 FCFA</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700 }}>Total à payer</div>
                <div style={{ color: '#FF5500', fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{selectedPlan.price.toLocaleString()} FCFA</div>
              </div>

              <button
                type="button"
                className="cta-design-button"
                disabled={subscribingPlan === selectedPlan.name}
                onClick={async () => {
                  setSubscribingPlan(selectedPlan.name);
                  
                  // Configuration FedaPay JS Widget
                  const FedaPay = (window as any).FedaPay;
                  if (!FedaPay) {
                    showToast('Erreur: Le service de paiement est indisponible.', 'error');
                    setSubscribingPlan(null);
                    return;
                  }

                  try {
                    let widget = FedaPay.init({
                      public_key: import.meta.env.VITE_FEDAPAY_PUBLIC_KEY || 'pk_live_JVbKBkCuJMTpnwgwiKi09Hom',
                      transaction: {
                        amount: selectedPlan.price,
                        description: `Abonnement Reflex SaaS - Plan ${selectedPlan.name}`
                      },
                      customer: {
                        email: email,
                        lastname: companyData?.name || 'Reflex',
                        firstname: fullName || 'PME',
                        phone_number: {
                          number: payerPhone.replace(/\s/g, '') || '97000000',
                          country: 'bj'
                        }
                      },
                      onComplete: function(resp: any) {
                        if (resp.reason === 'FedaPay.Transaction.Complete' || resp.reason === 'CHECKOUT COMPLETE') {
                          localStorage.setItem('reflex_onboarded_completed', 'true');
                          if (email) localStorage.setItem(`reflex_onboarded_${email.toLowerCase()}`, 'true');
                          
                          // Notification au backend (optionnelle) pour sécuriser, mais le webhook s'en charge.
                          setActiveView('dashboard');
                          showToast('Paiement réussi. Bienvenue dans Reflex !', 'success');
                        }
                      }
                    });
                    
                    widget.open();
                  } catch (err) {
                    showToast('Impossible d\'ouvrir la fenêtre de paiement.', 'error');
                  } finally {
                    setSubscribingPlan(null);
                  }
                }}
                style={{ width: '100%', padding: '18px', fontSize: '16px', marginBottom: '24px' }}
              >
                Confirmer & Payer l'Abonnement
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', opacity: 0.7 }}>
                <img src="/mtn-momo.png" alt="MTN" style={{ height: '30px', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                <img src="/moov-money.png" alt="Moov" style={{ height: '30px', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                <img src="/visa.png" alt="Visa" style={{ height: '24px', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
                Vos transactions sont chiffrées et sécurisées par FedaPay.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DEDICATED HOSTED CHECKOUT PAYMENT PAGE FOR WHATSAPP CLIENTS */}
      {/* ========================================================================= */}
      {activeView === 'payment-checkout' && (
        <div className="payment-checkout-container" style={{ minHeight: '100vh', backgroundColor: '#0B1727', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '40px 16px 120px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
            <img src="/logo.png" alt="Reflex Logo" style={{ height: '54px', width: 'auto', borderRadius: '10px' }} />
            <span className="font-outfit" style={{ fontWeight: 800, fontSize: '24px', color: '#FF5500' }}>Pay</span>
          </div>

          <div className="glass-card-dark payment-card-responsive" style={{ width: '100%', maxWidth: '520px', padding: '36px', borderRadius: '24px', border: '1px solid rgba(255, 85, 0, 0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
            {!paymentSuccess ? (
              <>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '24px', textAlign: 'center' }}>
                  <span className="font-outfit" style={{ backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', padding: '5px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255, 85, 0, 0.3)' }}>
                    PROPULSÉ PAR REFLEX MOBILE MONEY
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

                {/* FedaPay Secure Info Badge */}
                <div style={{ backgroundColor: 'rgba(255, 85, 0, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 85, 0, 0.25)', padding: '14px', marginBottom: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>
                    Paiement Sécurisé via FedaPay
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                    MTN Mobile Money, Moov Money, Wave & Cartes bancaires acceptés.
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
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>Numéro Mobile Money du Payer (+229)</label>
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
                  disabled={paymentLoading}
                >
                  {paymentLoading ? 'Ouverture du paiement FedaPay...' : `Payer ${currentCheckoutOrder.amount.toLocaleString()} FCFA via FedaPay →`}
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
                  Votre règlement de <strong style={{ color: '#10B981' }}>{currentCheckoutOrder.amount.toLocaleString()} FCFA</strong> a été encaissé avec succès via Mobile Money. Le reçu officiel a été envoyé sur votre WhatsApp.
                </p>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,85,0,0.4)', borderRadius: '14px', padding: '18px', textAlign: 'left', marginBottom: '24px', fontSize: '12.5px' }}>
                  <div style={{ fontWeight: 800, color: '#FF5500', fontSize: '13.5px', marginBottom: '6px' }}>Reçu Officiel Reflex Mobile Money #{currentCheckoutOrder.id}</div>
                  <div style={{ color: '#ffffff', marginBottom: '3px' }}>Client : {currentCheckoutOrder.customerName} (+229 {payerPhone})</div>
                  <div style={{ color: '#cbd5e1', marginBottom: '3px' }}>Boutique : {currentCheckoutOrder.pmeName}</div>
                  <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>Date : {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ color: '#10B981', fontWeight: 700, marginTop: '8px', fontSize: '11.5px' }}>Référence commande : {currentCheckoutOrder.id}</div>
                </div>

                <button
                  className="btn-orange-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => {
                    setSelectedReceiptOrder(currentCheckoutOrder);
                    setReceiptModalOpen(true);
                  }}
                >
                  <Receipt size={18} /> Télécharger le Reçu PDF Certifié
                </button>

                <button
                  style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '12px', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: 600, marginBottom: '8px' }}
                  onClick={() => { setPaymentSuccess(false); setActiveView('landing'); }}
                >
                  Retourner à l'accueil
                </button>

                <button
                  style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '12px', color: '#94a3b8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
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
        <div className={`dashboard-view-root ${darkMode ? 'dark-theme' : 'light-theme'}`}>
          {/* Dashboard Mobile Header with Hamburger Menu */}
          <div className="dashboard-mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('landing')}>
              <img src={darkMode ? "/logo.png" : "/logo-light-bg.png"} alt="Reflex Logo" style={{ height: '46px', width: 'auto', borderRadius: '8px' }} />
              <span style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', display: 'block' }}>{companyData.name}</span>
            </div>

            <button
              style={{ background: 'transparent', border: '1px solid var(--dash-card-border)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', color: 'var(--dash-text-primary)', cursor: 'pointer' }}
              onClick={() => setDashMobileMenuOpen(!dashMobileMenuOpen)}
              aria-label="Toggle Dashboard Menu"
            >
              <Menu size={22} />
            </button>

            {dashMobileMenuOpen && (
              <div className="dashboard-mobile-drawer">
                {(['Vue d\'ensemble', 'Commandes', 'Catalogue', 'Paramètres'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`sidebar-link ${activeSidebarTab === tab ? 'active' : ''}`}
                    onClick={() => { setActiveSidebarTab(tab); setDashMobileMenuOpen(false); }}
                    style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
                  >
                    {tab}
                  </button>
                ))}
                <button className="sidebar-link" onClick={() => { setActiveView('landing'); setDashMobileMenuOpen(false); }} style={{ borderTop: '1px solid var(--dash-card-border)', paddingTop: '12px', marginTop: '6px' }}>
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
              <img src={darkMode ? "/logo.png" : "/logo-light-bg.png"} alt="Reflex Logo" style={{ height: '48px', width: 'auto', borderRadius: '8px' }} />
              <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>{companyData.name}</div>
            </div>

            <nav className="dashboard-sidebar-nav">
              <button
                className={`sidebar-link ${activeSidebarTab === 'Vue d\'ensemble' ? 'active' : ''}`}
                onClick={() => switchTab('Vue d\'ensemble')}
              >
                <LayoutDashboard size={18} /> {t.dashOverview}
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Commandes' ? 'active' : ''}`}
                onClick={() => switchTab('Commandes')}
              >
                <ShoppingBag size={18} /> {t.dashOrders}
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Catalogue' ? 'active' : ''}`}
                onClick={() => switchTab('Catalogue')}
              >
                <Grid size={18} /> {t.dashCatalog} ({productsList.length})
              </button>
              <button
                className={`sidebar-link ${activeSidebarTab === 'Paramètres' ? 'active' : ''}`}
                onClick={() => switchTab('Paramètres')}
              >
                <Settings size={18} /> {t.dashSettings}
              </button>
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="sidebar-link" onClick={() => setActiveView('landing')}>
                <Globe size={16} /> Page d'accueil
              </button>
              <button className="sidebar-link" onClick={toggleDarkMode}>
                {darkMode ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#6366F1" />}
                <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
              </button>
              <button className="sidebar-link" onClick={handleSignOut} style={{ color: '#ef4444' }}>
                <LogOut size={16} color="#ef4444" /> {t.logout}
              </button>
            </div>
          </aside>

          <main className="dashboard-main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <h1 style={{ color: 'var(--dash-text-primary)', marginBottom: '6px', fontSize: 'clamp(20px, 4.5vw, 30px)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                  {activeSidebarTab === 'Vue d\'ensemble' && `${t.dashOverview} — ${fullName || 'Merchant'}`}
                  {activeSidebarTab === 'Commandes' && t.ordersTitle}
                  {activeSidebarTab === 'Catalogue' && t.catalogTitle}
                  {activeSidebarTab === 'Paramètres' && t.settingsTitle}
                </h1>
                <p style={{ color: 'var(--dash-text-secondary)', fontSize: '13.5px', lineHeight: 1.4 }}>
                  {t.dashPmeActive} : <strong style={{ color: '#FF5500' }}>{companyData.name}</strong> ({companyData.phone})
                </p>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,85,0,0.12)', border: '1px solid rgba(255,85,0,0.35)', padding: '6px 14px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                <Radio size={14} color="#FF5500" />
                <span style={{ color: 'var(--dash-text-primary)', fontWeight: 600, fontSize: '12px' }}>
                  {t.dashAiActive}
                </span>
              </div>
            </div>

            {isTabLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
                <SkeletonTable />
              </div>
            ) : (
              <>
                {/* TAB 1: VUE D'ENSEMBLE */}
                {activeSidebarTab === 'Vue d\'ensemble' && (
              <div>
                <div className="grid-responsive-stats">
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--dash-text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>CONVERSATIONS</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--dash-text-primary)', fontFamily: 'var(--font-inter)' }}>{liveStats.conversations}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--dash-text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>AUTO (IA)</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#FF5500', fontFamily: 'var(--font-inter)' }}>{liveStats.autoAiPercent}%</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--dash-text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>COMMANDES</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--dash-text-primary)', fontFamily: 'var(--font-inter)' }}>{liveStats.commandes}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--dash-text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>REVENUS MOBILE MONEY (FCFA)</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--dash-text-primary)', fontFamily: 'var(--font-inter)' }}>{liveStats.revenusFcfa.toLocaleString()}</div>
                  </div>
                  <div className="reflex-card-base" style={{ padding: '20px' }}>
                    <div className="label-sm" style={{ color: 'var(--dash-text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>CONVERSION</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-inter)' }}>{liveStats.conversionPercent}%</div>
                  </div>
                </div>

                <div className="grid-responsive-main animate-fade-in">
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="reflex-card-ai" style={{ padding: '24px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid rgba(255, 85, 0, 0.3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Sparkles size={20} color="#FF5500" />
                        <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', fontSize: '18px' }}>Résumé intelligent de l'activité de {companyData.name}</h3>
                      </div>
                      <p className="body-md" style={{ color: 'var(--dash-text-secondary)', lineHeight: 1.6 }}>
                        Reflex a traité {liveStats.conversations} messages pour <strong style={{ color: 'var(--dash-text-primary)' }}>{companyData.name}</strong> avec un taux d'automatisation de {liveStats.autoAiPercent}%. L'IA utilise le ton <em>"{assistantConfig.tone}"</em> et présente vos {productsList.length} produits du catalogue avec les encaissements directs Mobile Money.
                      </p>
                    </div>

                    <div>
                      <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', marginBottom: '16px' }}>Commandes Récentes</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentOrdersList.map((ord, idx) => (
                          <div key={idx} className="reflex-card-base dashboard-order-card" style={{ padding: '16px 20px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                                {ord.avatar}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--dash-text-primary)' }}>{ord.name} ({ord.phone})</div>
                                <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', marginTop: '2px' }}>{ord.summary}</div>
                              </div>
                            </div>
                            <div className="dashboard-order-meta">
                              <div style={{ fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-inter)', whiteSpace: 'nowrap', fontSize: '15px' }}>{ord.amount.toLocaleString()} FCFA</div>
                              <span className={`chip-status ${ord.chipType === 'green' ? 'chip-green' : 'chip-amber'}`} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{ord.chipText}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="reflex-card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                      <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', fontSize: '18px' }}>Paramètres IA Actifs</h3>
                      <div style={{ borderBottom: '1px solid var(--dash-card-border)', paddingBottom: '16px' }}>
                        <div className="label-xs" style={{ color: 'var(--dash-text-secondary)', marginBottom: '6px' }}>TON IA</div>
                        <div style={{ fontWeight: 600, color: '#FF5500' }}>{assistantConfig.tone}</div>
                      </div>
                      <div style={{ borderBottom: '1px solid var(--dash-card-border)', paddingBottom: '16px' }}>
                        <div className="label-xs" style={{ color: 'var(--dash-text-secondary)', marginBottom: '6px' }}>DELAIS LIVRAISON</div>
                        <div style={{ fontSize: '13px', color: 'var(--dash-text-primary)' }}>{assistantConfig.deliveryInfo}</div>
                      </div>
                      <div>
                        <div className="label-xs" style={{ color: 'var(--dash-text-secondary)', marginBottom: '6px' }}>WELCOME MESSAGE</div>
                        <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', fontStyle: 'italic' }}>"{assistantConfig.welcomeMessage}"</div>
                      </div>
                    </div>

                    <div className="reflex-card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                      <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', fontSize: '18px' }}>Liens Rapides</h3>
                      <button
                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--dash-chip-bg)', color: '#FF5500', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', textAlign: 'left' }}
                        onClick={() => switchTab('Catalogue')}
                      >
                        <Grid size={18} /> Gérer mon catalogue produit
                      </button>
                      <button
                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', borderRadius: '12px', border: '1px solid var(--dash-card-border)', cursor: 'pointer', fontWeight: 600, fontSize: '14px', textAlign: 'left' }}
                        onClick={() => switchTab('Paramètres')}
                      >
                        <Settings size={18} /> Personnaliser l'assistant IA
                      </button>
                      <button
                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', borderRadius: '12px', border: '1px solid var(--dash-card-border)', cursor: 'pointer', fontWeight: 600, fontSize: '14px', textAlign: 'left' }}
                        onClick={() => switchTab('Commandes')}
                      >
                        <ShoppingBag size={18} /> Voir toutes les commandes
                      </button>
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
                    </div>
                  ) : (
                    <>
                      {/* Desktop & Tablet Table View */}
                      <div className="table-responsive-container desktop-table-only">
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--dash-text-secondary)', fontSize: '12px' }}>
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
                                <td style={{ padding: '16px 14px', fontWeight: 600, fontFamily: 'var(--font-inter)' }}>{ord.id}</td>
                                <td style={{ padding: '16px 14px' }}>
                                  <div style={{ fontWeight: 600 }}>{ord.name}</div>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>{ord.phone}</div>
                                </td>
                                <td style={{ padding: '16px 14px' }}>{ord.item}</td>
                                <td style={{ padding: '16px 14px', fontWeight: 700, color: '#4b41e1', fontFamily: 'var(--font-inter)' }}>{ord.amount.toLocaleString()} FCFA</td>
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
                              <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-inter)', color: '#4F46E5', backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
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
                              <span style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-inter)' }}>{ord.amount.toLocaleString()} FCFA</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* TAB 5: CATALOGUE */}
            {activeSidebarTab === 'Catalogue' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                  <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', marginBottom: '16px' }}>+ Ajouter un Produit</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Nom de l'article"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--dash-input-border)', backgroundColor: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', outline: 'none', fontSize: '14px' }}
                    />
                    <input
                      type="number"
                      placeholder="Prix en FCFA"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--dash-input-border)', backgroundColor: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', outline: 'none', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      placeholder="Catégorie"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--dash-input-border)', backgroundColor: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <button className="btn-orange-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={handleAddProduct}>
                    Ajouter au Catalogue
                  </button>
                </div>

                <div className="reflex-card-base" style={{ padding: '24px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                  <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', marginBottom: '16px' }}>Catalogue Actif ({productsList.length} articles)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {productsList.map((prod, idx) => (
                      <div key={idx} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--dash-text-primary)', marginBottom: '4px' }}>{prod.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)' }}>{prod.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '18px', color: '#FF5500', fontFamily: 'var(--font-inter)' }}>{prod.price.toLocaleString()} FCFA</div>
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
                <div className="reflex-card-base" style={{ padding: '28px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                  <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={20} color="#FF5500" /> Paramètres Général de {companyData.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: '6px', display: 'block' }}>Nom de la PME</label>
                      <input
                        type="text"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--dash-input-border)', backgroundColor: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: '6px', display: 'block' }}>Numéro WhatsApp Business PME</label>
                      <input
                        type="text"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--dash-input-border)', backgroundColor: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: '6px', display: 'block' }}>Ton de l'Assistant IA</label>
                      <select
                        value={assistantConfig.tone}
                        onChange={(e) => setAssistantConfig({ ...assistantConfig, tone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--dash-input-border)', backgroundColor: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)', outline: 'none', fontSize: '14px' }}
                      >
                        <option value="Chaleureux & Commercial">Chaleureux & Commercial</option>
                        <option value="Strictement Professionnel">Strictement Professionnel</option>
                        <option value="Décontracté & Jeune">Décontracté & Jeune</option>
                      </select>
                    </div>
                  </div>
                </div>



                {/* OFFICIAL META EMBEDDED SIGNUP CONNECTION CARD */}
                <div className="reflex-card-base" style={{ padding: '28px', backgroundColor: 'var(--dash-card-bg)', border: '1px solid rgba(255, 85, 0, 0.35)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: waConnectionStatus === 'CONNECTED' ? '#10b981' : '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dash-text-primary)' }}>
                        <Radio size={24} />
                      </div>
                      <div>
                        <h3 className="title-md" style={{ color: 'var(--dash-text-primary)', fontSize: '18px' }}>Connexion Officielle WhatsApp Business (Meta)</h3>
                        <p style={{ fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                          PME : <strong style={{ color: 'var(--dash-text-primary)' }}>{companyData.name}</strong> — Numéro : {companyData.phone || '+229 -- -- -- --'}
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

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', fontSize: '13.5px', color: 'var(--dash-text-secondary)', lineHeight: 1.6 }}>
                    <Lock size={16} color="#10b981" style={{ verticalAlign: 'middle', marginRight: '6px' }} /> <strong style={{ color: 'var(--dash-text-primary)' }}>Autorisation Sécurisée Meta (0 Saisie Technique) :</strong><br />
                    Cliquez ci-dessous pour autoriser Reflex via la fenêtre officielle Meta. Votre compte WhatsApp Business sera associé instantanément à votre espace PME.
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {waConnectionStatus !== 'CONNECTED' ? (
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: '#1877F2',
                          color: 'var(--dash-text-primary)',
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

                    <button
                      type="button"
                      disabled={saveLoading}
                      onClick={handleFinalizeOnboarding}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#FF5500',
                        color: 'var(--dash-text-primary)',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        cursor: saveLoading ? 'wait' : 'pointer',
                        boxShadow: '0 4px 18px rgba(255, 85, 0, 0.4)',
                        transition: 'all 0.2s ease',
                        opacity: saveLoading ? 0.7 : 1
                      }}
                    >
                      {saveLoading ? (
                        <>
                          <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          <span>Enregistrement en cours...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          <span>Enregistrer la configuration PME</span>
                        </>
                      )}
                    </button>
                    <button style={{ padding: '12px 20px', fontSize: '14px', backgroundColor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: 'var(--dash-text-primary)', fontWeight: 600, cursor: 'pointer' }} onClick={loadSampleDemoData}>
                      Charger données démo
                    </button>
                  </div>
                  {connectedWabaId && (
                    <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
                      ID WABA Actif : <code style={{ backgroundColor: '#1E293B', padding: '2px 6px', borderRadius: '4px', color: '#FF5500' }}>{connectedWabaId}</code>
                    </div>
                  )}
                </div>
              </div>
            )}
            </>
            )}

          </main>
        </div>
      </div>
    )}

    {/* Global Receipt PDF Modal */}
    <ReceiptModal
      isOpen={receiptModalOpen}
      onClose={() => setReceiptModalOpen(false)}
      currentLang={currentLang}
      order={selectedReceiptOrder}
    />
  </div>
  );
}
