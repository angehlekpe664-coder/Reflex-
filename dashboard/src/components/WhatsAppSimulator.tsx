import { useState } from 'react';
import { Send, CheckCheck, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { translations, type LanguageCode } from '../translations';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  paymentLink?: {
    amount: number;
    item: string;
  };
}

export function WhatsAppSimulator({ currentLang, onCheckout }: { currentLang: LanguageCode; onCheckout: () => void }) {
  const t = translations[currentLang] || translations.FR;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      text: 'Bonjour ! Est-ce que les perruques 18 pouces sont en stock ?',
      time: '14:32'
    },
    {
      id: '2',
      sender: 'bot',
      text: 'Bonjour 👋 ! Oui, la Perruque Brésilienne 18" est disponible (Reste 4 en stock). Prix: 45.000 FCFA.',
      time: '14:32'
    },
    {
      id: '3',
      sender: 'user',
      text: 'Super ! Je veux commander et payer par Mobile Money.',
      time: '14:33'
    },
    {
      id: '4',
      sender: 'bot',
      text: 'Parfait ! Voici votre reçu et lien d’encaissement sécurisé Reflex Mobile Money :',
      time: '14:33',
      paymentLink: {
        amount: 45000,
        item: 'Perruque Brésilienne 18"'
      }
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Merci pour votre message ! Notre catalogue comprend des sacs à main, des perruques et accessoires avec livraison express.';
      let payLink: { amount: number; item: string } | undefined = undefined;

      const lower = userMsgText.toLowerCase();
      if (lower.includes('prix') || lower.includes('combien') || lower.includes('cost') || lower.includes('njeeg')) {
        replyText = 'Tous nos tarifs sont indiqués en FCFA. Par exemple, la Robe de Soirée Premium est à 25.000 FCFA (Livraison sous 24h).';
      } else if (lower.includes('payer') || lower.includes('moov') || lower.includes('mtn') || lower.includes('wave') || lower.includes('orange') || lower.includes('pay')) {
        replyText = 'Absolument ! Cliquez ci-dessous pour effectuer votre règlement sécurisé par Mobile Money :';
        payLink = { amount: 25000, item: 'Robe de Soirée Premium' };
      } else if (lower.includes('bonjour') || lower.includes('hi') || lower.includes('hello') || lower.includes('nanga')) {
        replyText = 'Bonjour et bienvenue chez Boutique Élégance ! Que souhaitez-vous commander aujourd’hui ? 🛍️';
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: replyText,
          time: timeStr,
          paymentLink: payLink
        }
      ]);
    }, 700);
  };

  return (
    <div className="wa-simulator-card" style={{
      maxWidth: '680px',
      margin: '0 auto',
      backgroundColor: '#0B132B',
      borderRadius: '24px',
      border: '1px solid rgba(255, 85, 0, 0.3)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255,85,0,0.15)',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* WhatsApp Window Header */}
      <div style={{
        backgroundColor: '#1C2541',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FF5500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#ffffff',
              fontSize: '18px',
              boxShadow: '0 4px 14px rgba(255,85,0,0.4)'
            }}>
              R
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '12px',
              height: '12px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              border: '2px solid #1C2541'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>Reflex Assistant IA</span>
              <Sparkles size={14} color="#FF5500" />
            </div>
            <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 500 }}>
              {isTyping ? 'En train d’écrire...' : 'En ligne 24/7 • Réponses instantanées'}
            </span>
          </div>
        </div>

        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#FF5500',
          backgroundColor: 'rgba(255, 85, 0, 0.15)',
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid rgba(255,85,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <ShieldCheck size={12} /> MODE DÉMO LIVE
        </div>
      </div>

      {/* Chat Messages Body */}
      <div style={{
        padding: '20px',
        minHeight: '320px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: '#070B19',
        backgroundImage: 'radial-gradient(rgba(255, 85, 0, 0.04) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
              backgroundColor: msg.sender === 'user' ? '#1E3A8A' : '#1F2937',
              color: '#ffffff',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '12px 16px',
              border: msg.sender === 'user' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              fontSize: '14px',
              lineHeight: 1.5,
              position: 'relative'
            }}
          >
            <div>{msg.text}</div>

            {msg.paymentLink && (
              <div style={{
                marginTop: '10px',
                backgroundColor: 'rgba(255, 85, 0, 0.12)',
                border: '1px solid rgba(255, 85, 0, 0.4)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>PAIEMENT MOBILE MONEY</span>
                  <CreditCard size={14} color="#FF5500" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                  {msg.paymentLink.amount.toLocaleString('fr-FR')} FCFA
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  {msg.paymentLink.item}
                </div>
                <button
                  onClick={onCheckout}
                  style={{
                    marginTop: '4px',
                    width: '100%',
                    backgroundColor: '#FF5500',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(255,85,0,0.4)',
                    transition: 'transform 0.15s'
                  }}
                >
                  <CreditCard size={14} /> Payer par Mobile Money
                </button>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '4px',
              marginTop: '4px',
              fontSize: '10px',
              color: '#94a3b8'
            }}>
              <span>{msg.time}</span>
              {msg.sender === 'user' && <CheckCheck size={13} color="#38bdf8" />}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: '#1F2937',
            padding: '10px 16px',
            borderRadius: '18px 18px 18px 4px',
            color: '#FF5500',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} className="animate-spin" /> Reflex est en train de répondre...
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} style={{
        backgroundColor: '#1C2541',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.simulatorPlaceholder}
          style={{
            flex: 1,
            backgroundColor: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#ffffff',
            fontSize: '13.5px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#FF5500',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(255,85,0,0.3)'
          }}
        >
          <span>{t.simulatorSend}</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
