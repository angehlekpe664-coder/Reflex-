export function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: '#0F172A',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div style={{ width: '40%', height: '14px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} className="animate-pulse" />
      <div style={{ width: '70%', height: '28px', backgroundColor: 'rgba(255,85,0,0.15)', borderRadius: '8px' }} className="animate-pulse" />
      <div style={{ width: '90%', height: '12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '6px' }} className="animate-pulse" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div style={{
      backgroundColor: '#0F172A',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ width: '30%', height: '20px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px' }} className="animate-pulse" />
        <div style={{ width: '20%', height: '20px', backgroundColor: 'rgba(255,85,0,0.2)', borderRadius: '6px' }} className="animate-pulse" />
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} className="animate-pulse" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div style={{ width: '50%', height: '14px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} className="animate-pulse" />
              <div style={{ width: '30%', height: '10px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} className="animate-pulse" />
            </div>
          </div>
          <div style={{ width: '80px', height: '18px', backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: '6px' }} className="animate-pulse" />
        </div>
      ))}
    </div>
  );
}
