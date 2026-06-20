'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Jemaat {
  id: string;
  nama: string;
  gender: string;
  baptis: string;
  tempatLahir: string;
  tglLahir: string;
  alamat: string;
  telp: string;
  nikah: string;
  pekerjaan: string;
  status: string;
}

interface Pelayan {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  status: string;
}

interface Keuangan {
  id: string;
  jenis: 'masuk' | 'keluar';
  kategori: string;
  jumlah: number;
  deskripsi: string;
  tanggal: string;
}

interface Inventaris {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  harga: number;
  tahun: number;
  kondisi: string;
}

interface Keluarga {
  id: string;
  noKK: string;
  kepala: string;
  alamat: string;
  jumlah: number;
}

interface Jadwal {
  id: string;
  nama: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  pj: string;
  status: string;
}

interface Absensi {
  id: string;
  kegiatan: string;
  nama: string;
  status: string;
  tanggal: string;
}

interface Notifikasi {
  id: string;
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
  updateJemaat: (id: string, item: Omit<Jemaat, 'id'>) => void;
  deleteJemaat: (id: string) => void;
  addPelayan: (item: Omit<Pelayan, 'id'>) => void;
  updatePelayan: (id: string, item: Omit<Pelayan, 'id'>) => void;
  deletePelayan: (id: string) => void;
  addKeuangan: (item: Omit<Keuangan, 'id'>) => void;
  updateKeuangan: (id: string, item: Omit<Keuangan, 'id'>) => void;
  deleteKeuangan: (id: string) => void;
  addInventaris: (item: Omit<Inventaris, 'id'>) => void;
  updateInventaris: (id: string, item: Omit<Inventaris, 'id'>) => void;
  deleteInventaris: (id: string) => void;
  addKeluarga: (item: Omit<Keluarga, 'id'>) => void;
  updateKeluarga: (id: string, item: Omit<Keluarga, 'id'>) => void;
  deleteKeluarga: (id: string) => void;
  addJadwal: (item: Omit<Jadwal, 'id'>) => void;
  updateJadwal: (id: string, item: Omit<Jadwal, 'id'>) => void;
  deleteJadwal: (id: string) => void;
  addAbsensi: (item: Omit<Absensi, 'id'>) => void;
  deleteAbsensi: (id: string) => void;
  addNotifikasi: (item: Omit<Notifikasi, 'id'>) => void;
  deleteNotifikasi: (id: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  jemaat: 'gd_jemaat',
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

const generateId = () => 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

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

  // Initialize from localStorage
  useEffect(() => {
    const getData = (key: string) => {
      try {
        return JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        return [];
      }
    };

    setJemaat(getData(STORAGE_KEYS.jemaat));
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

    // Seed data if empty
    seedData();
  }, []);

  const seedData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.jemaat)) {
      const seedJemaat: Jemaat[] = [
        {
          id: generateId(),
          nama: 'Yohanes Simanjuntak',
          gender: 'Pria',
          baptis: 'Sudah',
          tempatLahir: 'Medan',
          tglLahir: '1975-03-15',
          alamat: 'Jl. Mawar 12',
          telp: '0812-1111',
          nikah: 'Menikah',
          pekerjaan: 'Pendeta',
          status: 'Aktif',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.jemaat, JSON.stringify(seedJemaat));
      setJemaat(seedJemaat);
    }
  };

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
    
    addJemaat: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...jemaat];
      setJemaat(updated);
      saveData(STORAGE_KEYS.jemaat, updated);
    },
    updateJemaat: (id, item) => {
      const updated = jemaat.map((j) => (j.id === id ? { ...item, id } : j));
      setJemaat(updated);
      saveData(STORAGE_KEYS.jemaat, updated);
    },
    deleteJemaat: (id) => {
      const updated = jemaat.filter((j) => j.id !== id);
      setJemaat(updated);
      saveData(STORAGE_KEYS.jemaat, updated);
    },

    addPelayan: (item) => {
      const newItem = { ...item, id: generateId() };
      const updated = [newItem, ...pelayan];
      setPelayan(updated);
      saveData(STORAGE_KEYS.pelayan, updated);
    },
    updatePelayan: (id, item) => {
      const updated = pelayan.map((p) => (p.id === id ? { ...item, id } : p));
      setPelayan(updated);
      saveData(STORAGE_KEYS.pelayan, updated);
    },
    deletePelayan: (id) => {
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
    updateKeuangan: (id, item) => {
      const updated = keuangan.map((k) => (k.id === id ? { ...item, id } : k));
      setKeuangan(updated);
      saveData(STORAGE_KEYS.keuangan, updated);
    },
    deleteKeuangan: (id) => {
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
    updateInventaris: (id, item) => {
      const updated = inventaris.map((inv) => (inv.id === id ? { ...item, id } : inv));
      setInventaris(updated);
      saveData(STORAGE_KEYS.inventaris, updated);
    },
    deleteInventaris: (id) => {
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
    updateKeluarga: (id, item) => {
      const updated = keluarga.map((k) => (k.id === id ? { ...item, id } : k));
      setKeluarga(updated);
      saveData(STORAGE_KEYS.keluarga, updated);
    },
    deleteKeluarga: (id) => {
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
    updateJadwal: (id, item) => {
      const updated = jadwal
        .map((j) => (j.id === id ? { ...item, id } : j))
        .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
      setJadwal(updated);
      saveData(STORAGE_KEYS.jadwal, updated);
    },
    deleteJadwal: (id) => {
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
    deleteAbsensi: (id) => {
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
    deleteNotifikasi: (id) => {
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
