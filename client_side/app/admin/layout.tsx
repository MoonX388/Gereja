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
        return;
      } 
      
      // 🚀 BYPASS API: Izinkan masuk langsung jika ini akun demo (offline)
      if (user.isDemo) {
        setIsAccessVerified(true);
        return;
      }

      // 🌐 JIKA AKUN ASLI: Validasi ke API backend
      api.get('/auth/profile')
        .then(res => {
          const hostname = typeof window !== "undefined" ? window.location.hostname : "";
          const parts = hostname.split(".");
          const currentSubdomain = parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'api' ? parts[0] : "";

          const hasValidRole = res.data.role === 'admin' || res.data.role === 'admin_gereja' || res.data.role === 'sub_owner';

          if (!hasValidRole && res.data.role !== 'super_admin') {
            logout();
            router.push('/error/403');
            return;
          }

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
