'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

const permissionOptions = [
  ['akses_gpanel', 'Akses GPanel'],
  ['akses_gereja_live', 'Akses Gereja Live'],
  ['kelola_jemaat', 'Kelola Jemaat'],
  ['kelola_pelayan', 'Kelola Pelayan'],
  ['kelola_keuangan', 'Kelola Keuangan'],
  ['kelola_jadwal', 'Kelola Jadwal'],
  ['kelola_form', 'Kelola Formulir'],
  ['kelola_settings', 'Kelola Pengaturan'],
];

type UserRecord = { id: string; email: string; username?: string; role?: string; permissions?: string[]; tenantId?: string };

export default function AksesUser() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data ?? []);
    } catch {
      setMessage('Gagal memuat daftar user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const togglePermission = async (user: UserRecord, permission: string) => {
    const current = user.permissions ?? [];
    const permissions = current.includes(permission)
      ? current.filter((item) => item !== permission)
      : [...current, permission];
    setSaving(user.id);
    setMessage('');
    try {
      await api.patch(`/users/permissions/${user.id}`, { set: permissions });
      setUsers((items) => items.map((item) => item.id === user.id ? { ...item, permissions } : item));
    } catch {
      setMessage('Permission gagal disimpan.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Akses User</h1>
        <p className="text-sm text-gray-500">Atur akses GPanel dan Gereja Live untuk user gereja ini.</p>
      </header>
      {message && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
      {loading ? <p>Memuat user...</p> : (
        <div className="space-y-4">
          {users.map((user) => (
            <article key={user.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h2 className="font-semibold text-gray-900">{user.username || user.email}</h2>
                  <p className="text-xs text-gray-500">{user.email} {user.role ? `- ${user.role}` : '- user'}</p>
                </div>
                {saving === user.id && <span className="text-xs text-blue-600">Menyimpan...</span>}
              </div>
              <div className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {permissionOptions.map(([permission, label]) => (
                  <label key={permission} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 p-2 text-sm hover:bg-gray-50">
                    <input type="checkbox" checked={(user.permissions ?? []).includes(permission)} onChange={() => void togglePermission(user, permission)} />
                    {label}
                  </label>
                ))}
              </div>
            </article>
          ))}
          {!users.length && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">Belum ada user terdaftar.</p>}
        </div>
      )}
    </section>
  );
}
