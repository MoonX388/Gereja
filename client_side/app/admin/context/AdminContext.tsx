'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

// ============================================================
// 1. INTERFACE / TIPE DATA (semua sudah pakai id: number)
// ============================================================

export interface Jemaat {
  id: number;
  nama: string;
  gender: string;
  tempatLahir: string;
  tglLahir: string;
  tempatBaptis: string;
  tglBaptis: string;
  tempatSidi: string;
  tglSidi: string;
  alamat: string;
  telepon: string;
  nikah: string;
  pekerjaan: string;
  status: string;
}

export interface Pelayan {
  id: number;
  nama: string;
  jabatan: string;
  departemen: string;
  status: string;
}

export interface Keuangan {
  id: number;
  jenis: 'masuk' | 'keluar';
  kategori: string;
  jumlah: number;
  deskripsi: string;
  tanggal: string;
}

export interface Inventaris {
  id: number;
  nama: string;
  kategori: string;
  jumlah: number;
  harga: number;
  tahun: number;
  kondisi: string;
}

export interface Keluarga {
  id: number;
  noKK: string;
  kepala: string;
  alamat: string;
  jumlah: number;
}

export interface Jadwal {
  id: number;
  nama: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  pj: string;
  status: string;
}

export interface Absensi {
  id: number;
  kegiatan: string;
  nama: string;
  status: string;
  tanggal: string;
}

export interface Notifikasi {
  id: number;
  judul: string;
  pesan: string;
  target: string;
  via: string;
  tanggal: string;
}

export interface Settings {
  namaGereja: string;
  kodeGereja: string;
  alamat: string;
  telp: string;
  email: string;
  website: string;
  username: string;
  password: string;
  notifWA: boolean;
  notifSMS: boolean;
  notifEmail: boolean;
  fontSize: string;
  mode: string;
  waKey: string;
  smtpHost: string;
  emailFrom: string;
}

export interface AdminBackupData {
  jemaat: Jemaat[];
  pelayan: Pelayan[];
  keuangan: Keuangan[];
  inventaris: Inventaris[];
  keluarga: Keluarga[];
  jadwal: Jadwal[];
  absensi: Absensi[];
  notifikasi: Notifikasi[];
  settings: Settings;
}

// ============================================================
// 2. CONTEXT TYPE
// ============================================================

interface AdminContextType {
  // Data
  jemaat: Jemaat[];
  pelayan: Pelayan[];
  keuangan: Keuangan[];
  inventaris: Inventaris[];
  keluarga: Keluarga[];
  jadwal: Jadwal[];
  absensi: Absensi[];
  notifikasi: Notifikasi[];
  settings: Settings;
  currentPage: string;

  setCurrentPage: (page: string) => void;

  // CRUD Jemaat
  addJemaat: (item: Omit<Jemaat, 'id'>) => Promise<void>;
  updateJemaat: (id: number, item: Omit<Jemaat, 'id'>) => Promise<void>;
  deleteJemaat: (id: number) => Promise<void>;

  // CRUD Pelayan
  addPelayan: (item: Omit<Pelayan, 'id'>) => Promise<void>;
  updatePelayan: (id: number, item: Omit<Pelayan, 'id'>) => Promise<void>;
  deletePelayan: (id: number) => Promise<void>;

  // CRUD Keuangan
  addKeuangan: (item: Omit<Keuangan, 'id'>) => Promise<void>;
  updateKeuangan: (id: number, item: Omit<Keuangan, 'id'>) => Promise<void>;
  deleteKeuangan: (id: number) => Promise<void>;

  // CRUD Inventaris
  addInventaris: (item: Omit<Inventaris, 'id'>) => Promise<void>;
  updateInventaris: (id: number, item: Omit<Inventaris, 'id'>) => Promise<void>;
  deleteInventaris: (id: number) => Promise<void>;

  // CRUD Keluarga
  addKeluarga: (item: Omit<Keluarga, 'id'>) => Promise<void>;
  updateKeluarga: (id: number, item: Omit<Keluarga, 'id'>) => Promise<void>;
  deleteKeluarga: (id: number) => Promise<void>;

  // CRUD Jadwal
  addJadwal: (item: Omit<Jadwal, 'id'>) => Promise<void>;
  updateJadwal: (id: number, item: Omit<Jadwal, 'id'>) => Promise<void>;
  deleteJadwal: (id: number) => Promise<void>;

  // CRUD Absensi (masih localStorage, karena belum ada endpoint)
  addAbsensi: (item: Omit<Absensi, 'id'>) => void;
  deleteAbsensi: (id: number) => void;

  // CRUD Notifikasi
  addNotifikasi: (item: Omit<Notifikasi, 'id'>) => Promise<void>;
  updateNotifikasi?: (id: number, item: Omit<Notifikasi, 'id'>) => Promise<void>; // opsional
  deleteNotifikasi: (id: number) => Promise<void>;

  // Settings (localStorage)
  updateSettings: (newSettings: Partial<Settings>) => void;
  importData: (data: Partial<AdminBackupData>) => void;
}

// ============================================================
// 3. CONTEXT & PROVIDER
// ============================================================

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Key localStorage untuk fallback & settings
const STORAGE_KEYS = {
  settings: 'gd_settings',
  // fallback untuk data jika API mati (opsional)
};

const DEFAULT_SETTINGS: Settings = {
  namaGereja: 'Gereja Kasih Karunia',
  kodeGereja: 'GKK-001',
  alamat: 'Jl. Damai No.10',
  telp: '021-1234567',
  email: 'info@gerejakasihkarunia.or.id',
  website: 'www.gerejakasihkarunia.or.id',
  username: 'admin',
  password: 'admin123',
  notifWA: true,
  notifSMS: false,
  notifEmail: true,
  fontSize: 'normal',
  mode: 'light',
  waKey: '',
  smtpHost: '',
  emailFrom: '',
};

// Helper untuk generate ID (hanya untuk absensi yang masih lokal)
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

export function AdminProvider({ children }: { children: ReactNode }) {
  // -------------------- STATE --------------------
  const getLocalAbsensi = (): Absensi[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('gd_absensi');
    return saved ? JSON.parse(saved) : [];
  };

  const getLocalSettings = (): Settings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const saved = localStorage.getItem(STORAGE_KEYS.settings);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  };

  const [jemaat, setJemaat] = useState<Jemaat[]>([]);
  const [pelayan, setPelayan] = useState<Pelayan[]>([]);
  const [keuangan, setKeuangan] = useState<Keuangan[]>([]);
  const [inventaris, setInventaris] = useState<Inventaris[]>([]);
  const [keluarga, setKeluarga] = useState<Keluarga[]>([]);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>(() => getLocalAbsensi());
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [settings, setSettings] = useState<Settings>(() => getLocalSettings());
  const [currentPage, setCurrentPage] = useState('dashboard');

  // -------------------- FUNGSI LOAD DATA DARI API --------------------
  const loadData = async <T,>(url: string, setState: React.Dispatch<React.SetStateAction<T[]>>, storageKey?: string) => {
    try {
      const res = await api.get(url);
      setState(res.data);
    } catch (error) {
      console.error(`Gagal load ${url}:`, error);
      // fallback ke localStorage jika disediakan
      if (storageKey) {
        const saved = localStorage.getItem(storageKey);
        if (saved) setState(JSON.parse(saved));
      }
    }
  };

  useEffect(() => {
    // Muat semua data dari API
    loadData('/jemaat', setJemaat);
    loadData('/pelayan', setPelayan);
    loadData('/keuangan', setKeuangan);
    loadData('/inventaris', setInventaris);
    loadData('/keluarga', setKeluarga);
    loadData('/jadwal', setJadwal);
    loadData('/notifikasi', setNotifikasi);

    // Absensi dan settings sudah diinisialisasi dari localStorage di state awal.
  }, []);

  // Helper untuk menyimpan ke localStorage (hanya untuk absensi & settings)
  const saveToLocal = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ============================================================
  // 4. CRUD FUNCTIONS (SEMUA MENGGUNAKAN API, KECUALI ABSENSI)
  // ============================================================

  // ---------- JEMAAT ----------
  const addJemaat = async (item: Omit<Jemaat, 'id'>) => {
    try {
      const res = await api.post('/jemaat', item);
      setJemaat((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Gagal tambah jemaat:', error);
    }
  };
  const updateJemaat = async (id: number, item: Omit<Jemaat, 'id'>) => {
    try {
      await api.put(`/jemaat/${id}`, item);
      setJemaat((prev) => prev.map((j) => (j.id === id ? { ...item, id } : j)));
    } catch (error) {
      console.error('Gagal update jemaat:', error);
    }
  };
  const deleteJemaat = async (id: number) => {
    try {
      await api.delete(`/jemaat/${id}`);
      setJemaat((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      console.error('Gagal hapus jemaat:', error);
    }
  };

  // ---------- PELAYAN ----------
  const addPelayan = async (item: Omit<Pelayan, 'id'>) => {
    try {
      const res = await api.post('/pelayan', item);
      setPelayan((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Gagal tambah pelayan:', error);
    }
  };
  const updatePelayan = async (id: number, item: Omit<Pelayan, 'id'>) => {
    try {
      await api.put(`/pelayan/${id}`, item);
      setPelayan((prev) => prev.map((p) => (p.id === id ? { ...item, id } : p)));
    } catch (error) {
      console.error('Gagal update pelayan:', error);
    }
  };
  const deletePelayan = async (id: number) => {
    try {
      await api.delete(`/pelayan/${id}`);
      setPelayan((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Gagal hapus pelayan:', error);
    }
  };

  // ---------- KEUANGAN ----------
  const addKeuangan = async (item: Omit<Keuangan, 'id'>) => {
    try {
      const res = await api.post('/keuangan', item);
      setKeuangan((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Gagal tambah keuangan:', error);
    }
  };
  const updateKeuangan = async (id: number, item: Omit<Keuangan, 'id'>) => {
    try {
      await api.put(`/keuangan/${id}`, item);
      setKeuangan((prev) => prev.map((k) => (k.id === id ? { ...item, id } : k)));
    } catch (error) {
      console.error('Gagal update keuangan:', error);
    }
  };
  const deleteKeuangan = async (id: number) => {
    try {
      await api.delete(`/keuangan/${id}`);
      setKeuangan((prev) => prev.filter((k) => k.id !== id));
    } catch (error) {
      console.error('Gagal hapus keuangan:', error);
    }
  };

  // ---------- INVENTARIS ----------
  const addInventaris = async (item: Omit<Inventaris, 'id'>) => {
    try {
      const res = await api.post('/inventaris', item);
      setInventaris((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Gagal tambah inventaris:', error);
    }
  };
  const updateInventaris = async (id: number, item: Omit<Inventaris, 'id'>) => {
    try {
      await api.put(`/inventaris/${id}`, item);
      setInventaris((prev) => prev.map((inv) => (inv.id === id ? { ...item, id } : inv)));
    } catch (error) {
      console.error('Gagal update inventaris:', error);
    }
  };
  const deleteInventaris = async (id: number) => {
    try {
      await api.delete(`/inventaris/${id}`);
      setInventaris((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error('Gagal hapus inventaris:', error);
    }
  };

  // ---------- KELUARGA ----------
  const addKeluarga = async (item: Omit<Keluarga, 'id'>) => {
    try {
      const res = await api.post('/keluarga', item);
      setKeluarga((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Gagal tambah keluarga:', error);
    }
  };
  const updateKeluarga = async (id: number, item: Omit<Keluarga, 'id'>) => {
    try {
      await api.put(`/keluarga/${id}`, item);
      setKeluarga((prev) => prev.map((k) => (k.id === id ? { ...item, id } : k)));
    } catch (error) {
      console.error('Gagal update keluarga:', error);
    }
  };
  const deleteKeluarga = async (id: number) => {
    try {
      await api.delete(`/keluarga/${id}`);
      setKeluarga((prev) => prev.filter((k) => k.id !== id));
    } catch (error) {
      console.error('Gagal hapus keluarga:', error);
    }
  };

  // ---------- JADWAL ----------
  const addJadwal = async (item: Omit<Jadwal, 'id'>) => {
    try {
      const res = await api.post('/jadwal', item);
      setJadwal((prev) => [...prev, res.data].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()));
    } catch (error) {
      console.error('Gagal tambah jadwal:', error);
    }
  };
  const updateJadwal = async (id: number, item: Omit<Jadwal, 'id'>) => {
    try {
      await api.put(`/jadwal/${id}`, item);
      setJadwal((prev) =>
        prev
          .map((j) => (j.id === id ? { ...item, id } : j))
          .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
      );
    } catch (error) {
      console.error('Gagal update jadwal:', error);
    }
  };
  const deleteJadwal = async (id: number) => {
    try {
      await api.delete(`/jadwal/${id}`);
      setJadwal((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      console.error('Gagal hapus jadwal:', error);
    }
  };

  // ---------- NOTIFIKASI ----------
  const addNotifikasi = async (item: Omit<Notifikasi, 'id'>) => {
    try {
      const res = await api.post('/notifikasi', item);
      setNotifikasi((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Gagal tambah notifikasi:', error);
    }
  };
  const deleteNotifikasi = async (id: number) => {
    try {
      await api.delete(`/notifikasi/${id}`);
      setNotifikasi((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Gagal hapus notifikasi:', error);
    }
  };

  // ---------- ABSENSI (masih lokal) ----------
  const addAbsensi = (item: Omit<Absensi, 'id'>) => {
    const newItem = { ...item, id: generateId() };
    const updated = [newItem, ...absensi];
    setAbsensi(updated);
    saveToLocal('gd_absensi', updated);
  };
  const deleteAbsensi = (id: number) => {
    const updated = absensi.filter((a) => a.id !== id);
    setAbsensi(updated);
    saveToLocal('gd_absensi', updated);
  };

  // ---------- SETTINGS (lokal) ----------
  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveToLocal(STORAGE_KEYS.settings, updated);
  };

  const importData = (data: Partial<AdminBackupData>) => {
    if (Array.isArray(data.jemaat)) setJemaat(data.jemaat);
    if (Array.isArray(data.pelayan)) setPelayan(data.pelayan);
    if (Array.isArray(data.keuangan)) setKeuangan(data.keuangan);
    if (Array.isArray(data.inventaris)) setInventaris(data.inventaris);
    if (Array.isArray(data.keluarga)) setKeluarga(data.keluarga);
    if (Array.isArray(data.jadwal)) setJadwal(data.jadwal);
    if (Array.isArray(data.absensi)) {
      setAbsensi(data.absensi);
      saveToLocal('gd_absensi', data.absensi);
    }
    if (Array.isArray(data.notifikasi)) setNotifikasi(data.notifikasi);
    if (data.settings) {
      const updatedSettings = { ...DEFAULT_SETTINGS, ...data.settings };
      setSettings(updatedSettings);
      saveToLocal(STORAGE_KEYS.settings, updatedSettings);
    }
  };

  // ============================================================
  // 5. CONTEXT VALUE
  // ============================================================

  const value: AdminContextType = {
    jemaat,
    pelayan,
    keuangan,
    inventaris,
    keluarga,
    jadwal,
    absensi,
    notifikasi,
    settings,
    currentPage,
    setCurrentPage,
    addJemaat,
    updateJemaat,
    deleteJemaat,
    addPelayan,
    updatePelayan,
    deletePelayan,
    addKeuangan,
    updateKeuangan,
    deleteKeuangan,
    addInventaris,
    updateInventaris,
    deleteInventaris,
    addKeluarga,
    updateKeluarga,
    deleteKeluarga,
    addJadwal,
    updateJadwal,
    deleteJadwal,
    addAbsensi,
    deleteAbsensi,
    addNotifikasi,
    deleteNotifikasi,
    updateSettings,
    importData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

// ============================================================
// 6. HOOK
// ============================================================

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}