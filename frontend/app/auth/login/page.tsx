'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Setelah login, cek role admin langsung di sini (opsional)
      // Atau biarkan admin layout yang mengecek
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <iframe
      src="/login.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      title="Daftar Jemaat"
    />
  );
}