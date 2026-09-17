'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import '../ui/style.css';
import '../ui/globals.css';
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';
import Loading from '../components/loading';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isAccessVerified, setIsAccessVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        api.get('/auth/profile')
          .then(res => {
            // DETEKSI URL: Ambil string nama subdomain browser saat ini
            const hostname = typeof window !== "undefined" ? window.location.hostname : "";
            const parts = hostname.split(".");
            const currentSubdomain = parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'api' ? parts[0] : "";

            // 🛡️ VALIDASI 1: Izinkan Staf Lokal ('admin') DAN Owner Utama ('admin_gereja'/'sub_owner') untuk masuk aplikasi
            const hasValidRole = res.data.role === 'admin' || res.data.role === 'admin_gereja' || res.data.role === 'sub_owner';
            
            if (!hasValidRole && res.data.role !== 'super_admin') {
              logout();
              router.push('/error/403');
              return;
            }

            // 🛡️ VALIDASI 2: Kunci wilayah kerja agar tidak bisa melompat ke subdomain milik penyewa lain
            // Untuk owner utama, subdomain tercatat di res.data.subdomain. Untuk staf, tercatat di churchSubdomain.
            const allowedSubdomain = res.data.churchSubdomain || res.data.subdomain;
            
            if (currentSubdomain && allowedSubdomain && allowedSubdomain !== currentSubdomain && res.data.role !== 'super_admin') {
              logout();
              router.push('/login'); 
              return;
            }

            setIsAccessVerified(true);
          })
          .catch(() => {
            logout();
            router.push('/error/500');
          });
      }
    }
  }, [user, loading, router, logout]);

  if (loading || !user || !isAccessVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <Loading />
      </div>
    );
  }

  return (
    <AdminProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
}