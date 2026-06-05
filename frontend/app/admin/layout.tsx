'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // Jika ada fungsi logout/clearAuth dariuseAuth, masukkan di sini
  const router = useRouter();
  
  // State tambahan untuk memastikan pengecekan API selesai sebelum merender halaman
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Samakan rute login utama Anda (contoh: '/auth/login')
        router.push('/auth/login');
      } else {
        api.get('/auth/profile')
          .then(res => {
            if (res.data.role === 'admin') {
              setIsAdminVerified(true);
            } else {
              // Hapus token dan tendang user jika bukan admin
              localStorage.removeItem('token');
              router.push('/auth/login');
            }
          })
          .catch(() => {
            localStorage.removeItem('token');
            router.push('/auth/login');
          });
      }
    }
  }, [user, loading, router]);

  // Proteksi ketat: Jangan render 'children' sebelum loading selesai, 
  // user terisi, DAN verifikasi role admin dari API selesai.
  if (loading || !user || !isAdminVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memeriksa akses...
      </div>
    );
  }

  return <>{children}</>;
}
