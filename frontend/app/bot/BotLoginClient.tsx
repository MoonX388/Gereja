'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://super-duper-space-bassoon-5g4j6p44ww6w3p69-3001.app.github.dev';

export default function BotLoginClient() {
  const [token, setToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);
  const [method, setMethod] = useState<'select' | 'qr' | 'pairing'>('select');
  const [qrString, setQrString] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string | null>(null);

  // Baca token dari URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsTokenSet(true);
    }
  }, []);

  // Polling QR jika metode QR dipilih
  useEffect(() => {
    if (method !== 'qr' || !isTokenSet) return;

    const fetchQr = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/wa/qr-string?token=${token}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.qr) {
          setQrString(data.qr);
          setStatus('Scan QR Code berikut:');
        } else {
          setQrString(null);
          setStatus('✅ Bot sudah terhubung.');
        }
      } catch {
        setStatus('❌ Gagal. Cek token atau server.');
        setQrString(null);
      }
    };

    fetchQr();
    const interval = setInterval(fetchQr, 5000);
    return () => clearInterval(interval);
  }, [method, isTokenSet, token]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
      setIsTokenSet(true);
    }
  };

  const requestPairingCode = async () => {
    if (!phoneNumber.match(/^62\d{8,14}$/)) {
      alert('Nomor tidak valid. Gunakan format 62xxx');
      return;
    }
    setStatus('Meminta kode pairing...');
    try {
      const res = await fetch(`${BACKEND_URL}/wa/request-pairing-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, token }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPairingCode(data.code);
      setStatus('Masukkan kode ini di WhatsApp:');
    } catch {
      setStatus('❌ Gagal mendapatkan kode.');
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert('Token disalin!');
  };

  // Tampilan awal: pilih metode
  if (!isTokenSet) {
    return (
      <div style={styles.container}>
        <h1>Login Bot Gereja</h1>
        <form onSubmit={handleTokenSubmit} style={styles.form}>
          <label>Masukkan Token:</label>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Token dari admin"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Hubungkan</button>
        </form>
      </div>
    );
  }

  if (method === 'select') {
    return (
      <div style={styles.container}>
        <h1>Pilih Metode Login</h1>
        <div style={styles.methodButtons}>
          <button style={styles.methodBtn} onClick={() => setMethod('qr')}>
            📷 Scan QR Code
          </button>
          <button style={styles.methodBtn} onClick={() => setMethod('pairing')}>
            🔢 Kode Pairing
          </button>
        </div>
        <button onClick={copyToken} style={styles.linkBtn}>📋 Salin Token</button>
      </div>
    );
  }

  if (method === 'qr') {
    return (
      <div style={styles.container}>
        <h1>Scan QR Code</h1>
        <p>{status}</p>
        {qrString && <QRCode value={qrString} size={256} />}
        <button onClick={() => setMethod('select')} style={styles.linkBtn}>Kembali</button>
      </div>
    );
  }

  if (method === 'pairing') {
    return (
      <div style={styles.container}>
        <h1>Kode Pairing</h1>
        {!pairingCode ? (
          <>
            <label>Nomor WhatsApp Bot (62xxx):</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="6281234567890"
              style={styles.input}
            />
            <button style={styles.button} onClick={requestPairingCode}>
              Dapatkan Kode
            </button>
          </>
        ) : (
          <>
            <p>{status}</p>
            <div style={styles.codeBox}>
              <span style={styles.code}>{pairingCode}</span>
            </div>
            <p>Buka WhatsApp &gt; Perangkat Tertaut &gt; Masukkan Kode</p>
          </>
        )}
        <button onClick={() => setMethod('select')} style={styles.linkBtn}>Kembali</button>
      </div>
    );
  }
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  methodButtons: { display: 'flex', gap: '20px', marginBottom: '20px' },
  methodBtn: {
    padding: '15px 30px',
    fontSize: '16px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  codeBox: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    border: '2px dashed #667eea',
    margin: '10px 0',
  },
  code: {
    fontSize: '36px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: '8px',
  },
  linkBtn: {
    marginTop: '20px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#667eea',
    border: '1px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};