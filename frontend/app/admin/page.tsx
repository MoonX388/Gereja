"use client";

import { useEffect, useRef, useState } from "react";

interface BridgeMessageData {
  action: "DATA_CHANGED";
  key: string;
  payload: any[];
}

export default function AdminPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [logAktivitas, setLogAktivitas] = useState<string>(
    "Belum ada perubahan data.",
  );

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // 1. KEAMANAN: Tolak pesan jika bukan dari domain yang sama
      if (event.origin !== window.location.origin) return;

      // 2. STABILITAS: Pastikan data berbentuk objek
      if (!event.data || typeof event.data !== "object") return;

      const data = event.data as BridgeMessageData;

      // Menangkap data dari fungsi setData() di HTML
      if (data.action === "DATA_CHANGED") {
        const { key, payload } = data;

        // Pembersihan nama key
        const namaTabel = key.replace("gd_", "").toUpperCase();
        setLogAktivitas(
          `[${new Date().toLocaleTimeString()}] Tabel ${namaTabel} diperbarui! Total data: ${payload.length}`,
        );

        console.log(`Log Data Global Bridge (${namaTabel}):`, payload);
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/admin/dashboard.html"
      style={{
        width: "100%",
        height: "100vh", // ← INI KUNCI PERBAIKANNYA (Mengganti flex: 1)
        border: "none",
        display: "block", // Mencegah ada celah putih di bawah iframe
      }}
      title="Admin Dashboard"
    />
  );
}
