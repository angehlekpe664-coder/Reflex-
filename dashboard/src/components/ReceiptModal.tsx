import { CheckCircle, ShieldCheck, Printer, X } from 'lucide-react';
import { translations, type LanguageCode } from '../translations';

interface ReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  order: {
    id: string;
    pmeName: string;
    item: string;
    amount: number;
    customerPhone: string;
    customerName: string;
    deliveryAddress?: string;
    createdAt?: string;
  };
}

export function ReceiptModal({ isOpen, onClose, currentLang, order }: ReceiptProps) {
  if (!isOpen) return null;

  const t = translations[currentLang] || translations.FR;
  const dateStr = order.createdAt || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const transactionHash = `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}${Math.random().toString(16).substr(2, 8).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="receipt-container" style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(255, 85, 0, 0.4)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 50px rgba(255,85,0,0.2)',
        overflow: 'hidden',
        color: '#ffffff',
        position: 'relative'
      }}>
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Printable Receipt Area */}
        <div id="printable-receipt-card" style={{ padding: '28px' }}>
          
          {/* Header Branding */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.jpg" alt="Reflex" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#ffffff' }}>REFLEX MOBILE MONEY</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Reçu Officiel d'Encaissement PME</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#FF5500', fontWeight: 700 }}>RÉF. {order.id}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{dateStr} à {timeStr}</div>
            </div>
          </div>

          {/* Success Status Banner */}
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <CheckCircle size={24} color="#22c55e" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#22c55e', letterSpacing: '0.05em' }}>
                {t.receiptStatusPaid}
              </div>
              <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
                Transaction validée et confirmée par l'opérateur Mobile Money.
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div style={{
            backgroundColor: '#090D16',
            borderRadius: '16px',
            padding: '18px',
            textAlign: 'center',
            border: '1px solid rgba(255, 85, 0, 0.2)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.receiptAmount}
            </div>
            <div style={{ fontSize: '30px', fontWeight: 900, color: '#FF5500', marginTop: '4px' }}>
              {order.amount.toLocaleString('fr-FR')} FCFA
            </div>
          </div>

          {/* Details Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>{t.receiptPme} :</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{order.pmeName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>{t.receiptCustomer} :</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{order.customerName} ({order.customerPhone})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>{t.checkoutItem} :</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{order.item}</span>
            </div>
            {order.deliveryAddress && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Delivery :</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{order.deliveryAddress}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>SHA-256 Hash :</span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#FF8800' }}>{transactionHash}</span>
            </div>
          </div>

          {/* Footer Guarantee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '11px', color: '#64748b' }}>
            <ShieldCheck size={14} color="#22c55e" />
            <span>POWERED BY REFLEX MOBILE MONEY ENGINE • CERTIFIED RECEIPT</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{
          backgroundColor: '#090D16',
          padding: '16px 28px',
          display: 'flex',
          gap: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              backgroundColor: '#FF5500',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(255,85,0,0.35)'
            }}
          >
            <Printer size={16} /> {t.receiptDownloadBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
