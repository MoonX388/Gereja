'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import '../ui/style.css';
import '../ui/globals.css';
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';
import Loading from '../components/loading'; // ⬅️ import komponen loading

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        api.get('/auth/profile')
          .then(res => {
            if (res.data.role === 'admin') {
              setIsAdminVerified(true);
            } else {
              logout();
              router.push('/error/403');
            }
          })
          .catch(() => {
            logout();
            router.push('/error/500');
          });
      }
    }
  }, [user, loading, router, logout]);

  // ✅ Tampilkan komponen loading selama pengecekan
  if (loading || !user || !isAdminVerified) {
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