'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Profile {
  id: number;
  nama: string;
  email: string;
  alamat?: string;
  telepon?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';
  const [profile, setProfile] = useState<Profile | null>(
    isDev
      ? {
          id: 1,
          nama: 'Jemaat Development',
          email: 'jemaat@development.local',
          alamat: 'Jl. Development No. 1',
          telepon: '08123456789',
        }
      : null
  );
  const [loading, setLoading] = useState(!isDev);

  useEffect(() => {
    if (isDev) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/auth/profile')
      .then(res => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [isDev, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Profile tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="bg-white shadow p-4 flex justify-between items-center rounded-xl mb-6">
        <h1 className="text-xl font-bold">Dashboard Jemaat</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Keluar
        </button>
      </nav>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
            {profile.nama.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.nama}</h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Alamat</label>
            <p className="font-medium">{profile.alamat || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Telepon</label>
            <p className="font-medium">{profile.telepon || '-'}</p>
          </div>
        </div>
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
          ⚠️ Mode Development - Login dinonaktifkan
        </div>
      </div>
    </div>
  );
}