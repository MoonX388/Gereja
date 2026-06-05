'use client';

import { useEffect, useRef, useState } from 'react';

interface BridgeMessageData {
  action: 'DATA_CHANGED';
  key: string;
  payload: any[];
}

export default function AdminPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [logAktivitas, setLogAktivitas] = useState<string>('Belum ada perubahan data.');

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // 1. KEAMANAN: Tolak pesan jika bukan dari domain yang sama dengan Next.js Anda
      if (event.origin !== window.location.origin) return;

      // 2. STABILITAS: Pastikan data berbentuk objek sebelum membaca properti di dalamnya
      if (!event.data || typeof event.data !== 'object') return;

      const data = event.data as BridgeMessageData;

      // Menangkap data dari fungsi setData() di HTML
      if (data.action === 'DATA_CHANGED') {
        const { key, payload } = data;
        
        // Pembersihan nama key
        const namaTabel = key.replace('gd_', '').toUpperCase();
        setLogAktivitas(
          `[${new Date().toLocaleTimeString()}] Tabel ${namaTabel} diperbarui! Total data: ${payload.length}`
        );
        
        console.log(`Log Data Global Bridge (${namaTabel}):`, payload);
      }
    };

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  // Fungsi mengirim perintah dengan target origin yang aman
  const kirimSinyalKeHTML = (actionName: string, extraParams = {}) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // KEAMANAN: Mengganti '*' dengan window.location.origin
      iframeRef.current.contentWindow.postMessage(
        { action: actionName, ...extraParams },
        window.location.origin
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* HEADER BAR ADMIN */}
      <div style={{ background: '#1e3a5f', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Gereja Digital Admin Wrapper (TSX)</h2>
          <small style={{ color: '#a0aec0' }}>{logAktivitas}</small>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => kirimSinyalKeHTML('PINDAH_HALAMAN', { pageTarget: 'dashboard' })}
            style={{ padding: '6px 12px', background: '#2c5282', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => kirimSinyalKeHTML('PINDAH_HALAMAN', { pageTarget: 'keuangan' })}
            style={{ padding: '6px 12px', background: '#2c5282', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Keuangan
          </button>
          <button 
            onClick={() => kirimSinyalKeHTML('TRIGGER_REFRESH')}
            style={{ padding: '6px 12px', background: '#e8c547', color: '#0f1a2e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Refresh Data HTML
          </button>
        </div>
      </div>

      {/* IFRAME GEREJA DIGITAL */}
      <iframe
        ref={iframeRef}
        src="/admin/dashboard.html"
        style={{
          width: '100%',
          flex: 1,
          border: 'none'
        }}
      />
    </div>
  );
}
