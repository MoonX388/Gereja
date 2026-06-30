'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import '../ui/style.css';
import '../ui/globals.css';
import { ToastProvider } from '@/app/components/ToastContext';
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';
import Loading from '../components/loading'; // ⬅️ import komponen loading

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        setIsChecking(false);
      } else {
        api.get('/auth/profile')
          .then(res => {
            if (res.data.role === 'admin') {
              setIsAdminVerified(true);
            } else {
              localStorage.removeItem('token');
              router.push('/status/403');
            }
          })
          .catch(() => {
            localStorage.removeItem('token');
            router.push('/status/500');
          })
          .finally(() => {
            setIsChecking(false);
          });
      }
    }
  }, [user, loading, router]);

  // ✅ Tampilkan komponen loading selama pengecekan
  if (isChecking || loading || !user || !isAdminVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <Loading />
      </div>
    );
  }

  return (
    <ToastProvider>
      <AdminProvider>
        {/* AdminLayout ini yang memunculkan sidebar! */}
        <AdminLayout>
          {children}
        </AdminLayout>
      </AdminProvider>
    </ToastProvider>
  );
}