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
            console.log('[AdminLayout] Profile loaded:', res.data);
            
            // DETEKSI URL: Ambil string nama subdomain browser saat ini
            const hostname = typeof window !== "undefined" ? window.location.hostname : "";
            const parts = hostname.split(".");
            const currentSubdomain = parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'api' ? parts[0] : "";

            // 🛡️ VALIDASI 1: Role hierarchy baru (case-insensitive)
            // 'owner' - platform owner, full access
            // 'admin' - platform staff/moderator
            // 'admin_tenant' - church admin
            // 'user' - church member/staff
            const normalizedRole = res.data.role?.toLowerCase() || '';
            const allowedRoles = ['owner', 'admin', 'admin_tenant', 'user', 'admin_gereja', 'sub_owner', 'super_admin', 'superadmin'];
            
            if (!allowedRoles.includes(normalizedRole)) {
              console.log('[AdminLayout] Invalid role:', normalizedRole);
              logout();
              router.push('/error/403');
              return;
            }

            // 🛡️ VALIDASI 2: Kunci wilayah kerja agar tidak bisa melompat ke subdomain milik penyewa lain
            // Platform roles (owner, admin) tidak dibatasi subdomain
            // Tenant roles (admin_tenant, user) dibatasi subdomain
            const allowedSubdomain = res.data.churchSubdomain || res.data.subdomain;
            const isPlatformRole = ['owner', 'admin'].includes(normalizedRole);
            
            if (!isPlatformRole && currentSubdomain && allowedSubdomain && allowedSubdomain !== currentSubdomain) {
              console.log('[AdminLayout] Subdomain mismatch:', { currentSubdomain, allowedSubdomain });
              logout();
              router.push('/login'); 
              return;
            }

            console.log('[AdminLayout] Access verified for role:', normalizedRole);
            setIsAccessVerified(true);
          })
          .catch(err => {
            console.error('[AdminLayout] Profile fetch failed:', err);
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