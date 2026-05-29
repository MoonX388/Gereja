'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // DEBUG: lihat isi respons di console browser (F12)
      console.log('Login response:', res.data);

      const user = res.data.user;
      if (!user || user.role !== 'admin') {
        setError('Akun ini bukan admin. Silakan gunakan akun admin.');
        return;
      }

      localStorage.setItem('token', res.data.access_token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <input type="email" placeholder="Email" required className="w-full border p-3 rounded-lg mb-4" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full border p-3 rounded-lg mb-4" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Masuk</button>
        <p className="text-center mt-4 text-sm"><Link href="/register" className="text-blue-600">Daftar Jemaat</Link></p>
      </form>
    </div>
  );
}