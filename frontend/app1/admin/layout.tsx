'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    api.get('/auth/profile')
      .then(res => {
        if (res.data.role !== 'admin') throw new Error();
        setAuthorized(true);
      })
      .catch(() => { localStorage.removeItem('token'); router.push('/login'); });
  }, [router]);

  if (!authorized) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  return <>{children}</>;
}