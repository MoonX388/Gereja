'use client';
import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function RegisterJemaat() {
  const [form, setForm] = useState({ nama: '', alamat: '', telepon: '', ttl: '', jenisKelamin: ''});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mendaftar');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <i className="fa-solid fa-check-circle text-5xl text-green-500 mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-4">Data Anda telah tersimpan. Admin akan memprosesnya.</p>
          <Link href="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Pendaftaran Jemaat Baru</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <input type="text" placeholder="Nama Lengkap *" required className="w-full border p-3 rounded-lg mb-4" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
        <input type="email" placeholder="Email *" required className="w-full border p-3 rounded-lg mb-4" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password *" required className="w-full border p-3 rounded-lg mb-4" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <input type="text" placeholder="Alamat" className="w-full border p-3 rounded-lg mb-4" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
        <input type="text" placeholder="Telepon" className="w-full border p-3 rounded-lg mb-4" value={form.telepon} onChange={e => setForm({...form, telepon: e.target.value})} />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Daftar</button>
        <p className="text-center mt-4 text-sm">Sudah terdaftar? <Link href="/login" className="text-blue-600">Login Admin</Link></p>
      </form>
    </div>
  );
}