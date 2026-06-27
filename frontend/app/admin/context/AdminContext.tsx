'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Import instance axios milikmu. Sesuaikan path-nya jika letak filenya berbeda
import api from '@/lib/api'; 

// 1. SEMUA INTERFACE DI BAWAH INI SUDAH MENGGUNAKAN id: number
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
  telp: string;
  nikah: string;
  pekerjaan: string;
  status: string;
}

interface Pelayan {
  id: number;
  nama: string;
  jabatan: string;
  departemen: string;
  status: string;
}

interface Keuangan {
  id: number;
  jenis: 'masuk' | 'keluar';
  kategori: string;
  jumlah: number;
  deskripsi: string;
  tanggal: string;
}

interface Inventaris {
  id: number;
  nama: string;
  kategori: string;
  jumlah: number;
  harga: number;
  tahun: number;
  kondisi: string;
}

interface Keluarga {
  id: number;
  noKK: string;
  kepala: string;
  alamat: string;
  jumlah: number;
}

interface Jadwal {
  id: number;
  nama: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  pj: string;
  status: string;
}

interface Absensi {
  id: number;
  kegiatan: string;
  nama: string;
  status: string;
  tanggal: string;
}

interface Notifikasi {
  id: number;
  judul: string;
  pesan: string;
  target: string;
  via: string;
  tanggal: string;
}

interface Settings {
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

interface AdminContextType {
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
  addJemaat: (item: Omit<Jemaat, 'id'>) => void;
  updateJemaat: (id: number, item: Omit<Jemaat, 'id'>) => void;
  deleteJemaat: (id: number) => void; 
  addPelayan: (item: Omit<Pelayan, 'id'>) => void;
  updatePelayan: (id: number, item: Omit<Pelayan, 'id'>) => void; // Tipe data id diubah ke number
  deletePelayan: (id: number) => void;                          // Tipe data id diubah ke number
  addKeuangan: (item: Omit<Keuangan, 'id'>) => void;
  updateKeuangan: (id: number, item: Omit<Keuangan, 'id'>) => void; // Tipe data id diubah ke number
  deleteKeuangan: (id: number) => void;                          // Tipe data id diubah ke number
  addInventaris: (item: Omit<Inventaris, 'id'>) => void;
  updateInventaris: (id: number, item: Omit<Inventaris, 'id'>) => void; // Tipe data id diubah ke number
  deleteInventaris: (id: number) => void;                          // Tipe data id diubah ke number
  addKeluarga: (item: Omit<Keluarga, 'id'>) => void;
  updateKeluarga: (id: number, item: Omit<Keluarga, 'id'>) => void; // Tipe data id diubah ke number
  deleteKeluarga: (id: number) => void;                          // Tipe data id diubah ke number
  addJadwal: (item: Omit<Jadwal, 'id'>) => void;
  updateJadwal: (id: number, item: Omit<Jadwal, 'id'>) => void; // Tipe data id diubah ke number
  deleteJadwal: (id: number) => void;                          // Tipe data id diubah ke number
  addAbsensi: (item: Omit<Absensi, 'id'>) => void;
  deleteAbsensi: (id: number) => void;                          // Tipe data id diubah ke number
  addNotifikasi: (item: Omit<Notifikasi, 'id'>) => void;
  deleteNotifikasi: (id: number) => void;                          // Tipe data id diubah ke number
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  pelayan: 'gd_pelayan',
  keuangan: 'gd_keuangan',
  inventaris: 'gd_inventaris',
  keluarga: 'gd_keluarga',
  jadwal: 'gd_jadwal',
  absensi: 'gd_absensi',
  notifikasi: 'gd_notifikasi',
  settings: 'gd_settings',
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

// 2. FUNGSI GENERATE ID SUDAH DIUBAH AGAR MENGHASILKAN ANGKA (NUMBER)
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [jemaat, setJemaat] = useState<Jemaat[]>([]);
  const [pelayan, setPelayan] = useState<Pelayan[]>([]);
  const [keuangan, setKeuangan] = useState<Keuangan[]>([]);
  const [inventaris, setInventaris] = useState<Inventaris[]>([]);
  const [keluarga, setKeluarga] = useState<Keluarga[]>([]);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Initialize data
  useEffect(() => {
    const loadJemaatFromServer = async () => {
      try {
        const res = await api.get('/jemaat');
        setJemaat(res.data);
      } catch (error) {
        console.error("Gagal mengambil data jemaat dari API server:", error);
      }
    };
    loadJemaatFromServer();

    const getData = (key: string) => {
      try {
        return JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        return [];
      }
    };

    setPelayan(getData(STORAGE_KEYS.pelayan));
    setKeuangan(getData(STORAGE_KEYS.keuangan));
    setInventaris(getData(STORAGE_KEYS.inventaris));
    setKeluarga(getData(STORAGE_KEYS.keluarga));
    setJadwal(getData(STORAGE_KEYS.jadwal));
    setAbsensi(getData(STORAGE_KEYS.absensi));
    setNotifikasi(getData(STORAGE_KEYS.notifikasi));

    const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);
    if (savedSettings) {
      setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

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
    
    addJemaat: async (item) => {
      try {
        const res = await api.post('/jemaat', item);
        setJemaat((prev) => [res.data, ...prev]);
      } catch (error) {
        console.error("Gagal menambahkan jemaat:", error);
      }
    },
    updateJemaat: async (id, item) => {
  try {
    // 1. Tetap tembak API backend agar data di database ter-update
    await api.put(`/jemaat/${id}`, item);
    
    // 2. Karena backend hanya mengembalikan pesan teks, kita gabung manual ID dan data barunya di sini
    setJemaat((prev) => 
      prev.map((j) => (j.id === id ? { ...item, id } : j))
    );
  } catch (error) {
    console.error("Gagal memperbarui jemaat:", error);
  }
},
    deleteJemaat: async (id) => {
      try {
        await api.delete(`/jemaat/${id}`);
        setJemaat((prev) => prev.filter((j) => j.id !== id));
      } catch (error) {
        console.error("Gagal menghapus jemaat:", error);
      }
    },

    // 3. SEMUA PARAMETER ID DI BAWAH INI SEKARANG SUDAH MENGGUNAKAN id: number
    addPelayan: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...pelayan];
      setPelayan(updated);
      saveData(STORAGE_KEYS.pelayan, updated);
    },
    updatePelayan: (id: number, item) => {
      const updated = pelayan.map((p) => (p.id === id ? { ...item, id } : p));
      setPelayan(updated);
      saveData(STORAGE_KEYS.pelayan, updated);
    },
    deletePelayan: (id: number) => {
      const updated = pelayan.filter((p) => p.id !== id);
      setPelayan(updated);
      saveData(STORAGE_KEYS.pelayan, updated);
    },

    addKeuangan: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...keuangan];
      setKeuangan(updated);
      saveData(STORAGE_KEYS.keuangan, updated);
    },
    updateKeuangan: (id: number, item) => {
      const updated = keuangan.map((k) => (k.id === id ? { ...item, id } : k));
      setKeuangan(updated);
      saveData(STORAGE_KEYS.keuangan, updated);
    },
    deleteKeuangan: (id: number) => {
      const updated = keuangan.filter((k) => k.id !== id);
      setKeuangan(updated);
      saveData(STORAGE_KEYS.keuangan, updated);
    },

    addInventaris: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...inventaris];
      setInventaris(updated);
      saveData(STORAGE_KEYS.inventaris, updated);
    },
    updateInventaris: (id: number, item) => {
      const updated = inventaris.map((inv) => (inv.id === id ? { ...item, id } : inv));
      setInventaris(updated);
      saveData(STORAGE_KEYS.inventaris, updated);
    },
    deleteInventaris: (id: number) => {
      const updated = inventaris.filter((inv) => inv.id !== id);
      setInventaris(updated);
      saveData(STORAGE_KEYS.inventaris, updated);
    },

    addKeluarga: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...keluarga];
      setKeluarga(updated);
      saveData(STORAGE_KEYS.keluarga, updated);
    },
    updateKeluarga: (id: number, item) => {
      const updated = keluarga.map((k) => (k.id === id ? { ...item, id } : k));
      setKeluarga(updated);
      saveData(STORAGE_KEYS.keluarga, updated);
    },
    deleteKeluarga: (id: number) => {
      const updated = keluarga.filter((k) => k.id !== id);
      setKeluarga(updated);
      saveData(STORAGE_KEYS.keluarga, updated);
    },

    addJadwal: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...jadwal].sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      );
      setJadwal(updated);
      saveData(STORAGE_KEYS.jadwal, updated);
    },
    updateJadwal: (id: number, item) => {
      const updated = jadwal
        .map((j) => (j.id === id ? { ...item, id } : j))
        .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
      setJadwal(updated);
      saveData(STORAGE_KEYS.jadwal, updated);
    },
    deleteJadwal: (id: number) => {
      const updated = jadwal.filter((j) => j.id !== id);
      setJadwal(updated);
      saveData(STORAGE_KEYS.jadwal, updated);
    },

    addAbsensi: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...absensi];
      setAbsensi(updated);
      saveData(STORAGE_KEYS.absensi, updated);
    },
    deleteAbsensi: (id: number) => {
      const updated = absensi.filter((a) => a.id !== id);
      setAbsensi(updated);
      saveData(STORAGE_KEYS.absensi, updated);
    },

    addNotifikasi: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...notifikasi];
      setNotifikasi(updated);
      saveData(STORAGE_KEYS.notifikasi, updated);
    },
    deleteNotifikasi: (id: number) => {
      const updated = notifikasi.filter((n) => n.id !== id);
      setNotifikasi(updated);
      saveData(STORAGE_KEYS.notifikasi, updated);
    },

    updateSettings: (newSettings) => {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      saveData(STORAGE_KEYS.settings, updated);
    },
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}