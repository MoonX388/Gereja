'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// ==================== TYPES ====================
type Jemaat = {
  id: string; nama: string; gender: string; baptis: string; tempatLahir: string;
  tglLahir: string; alamat: string; telp: string; nikah: string; pekerjaan: string; status: string;
};
type Keluarga = { id: string; noKK: string; kepala: string; alamat: string; jumlah: number };
type Pelayan = { id: string; nama: string; jabatan: string; departemen: string; status: string };
type Keuangan = { id: string; jenis: 'masuk'|'keluar'; kategori: string; jumlah: number; deskripsi: string; tanggal: string };
type Inventaris = { id: string; nama: string; kategori: string; jumlah: number; harga: number; tahun: number; kondisi: string };
type Jadwal = { id: string; nama: string; tanggal: string; waktu: string; lokasi: string; pj: string; status: string };
type Absensi = { id: string; kegiatan: string; nama: string; status: string; tanggal: string };
type Notifikasi = { id: string; judul: string; pesan: string; target: string; via: string; tanggal: string };
type Settings = {
  namaGereja: string; kodeGereja: string; alamat: string; telp: string; email: string; website: string;
  username: string; password: string; notifWA: boolean; notifSMS: boolean; notifEmail: boolean;
  fontSize: string; mode: string; waKey: string; smtpHost: string; emailFrom: string;
};

const JABATAN_ORDER: Record<string, number> = {
  Pendeta:1, Diakon:2, Penatua:3, 'Ketua Majelis':4, Bendahara:5,
  Sekretaris:6, 'Staf Administrasi':7, 'Staf Kebersihan':8,
  'Pengurus Pemuda':9, 'Pengurus Sekolah Minggu':10, Lainnya:11
};

const DEFAULT_SETTINGS: Settings = {
  namaGereja:'Gereja Anda', kodeGereja:'', alamat:'', telp:'', email:'', website:'',
  username:'admin', password:'admin123', notifWA:true, notifSMS:false, notifEmail:true,
  fontSize:'normal', mode:'light', waKey:'', smtpHost:'', emailFrom:''
};

// ==================== STORAGE ====================
const STORAGE_KEYS = {
  jemaat:'gd_jemaat', keluarga:'gd_keluarga', pelayan:'gd_pelayan', keuangan:'gd_keuangan',
  inventaris:'gd_inventaris', jadwal:'gd_jadwal', absensi:'gd_absensi', notifikasi:'gd_notifikasi', settings:'gd_settings'
};

function getData<T>(key: string): T[] { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }
function setData<T>(key: string, data: T[]) { localStorage.setItem(key, JSON.stringify(data)); }
function getSettings(): Settings { const s = localStorage.getItem(STORAGE_KEYS.settings); return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS; }
function saveSettingsToStorage(settings: Settings) { localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings)); }
function generateId(): string { return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6); }

// ==================== COMPONENTS ====================
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{children}</span>;
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [chartReady, setChartReady] = useState(false);
  const [jemaat, setJemaat] = useState<Jemaat[]>([]);
  const [keluarga, setKeluarga] = useState<Keluarga[]>([]);
  const [pelayan, setPelayan] = useState<Pelayan[]>([]);
  const [keuangan, setKeuangan] = useState<Keuangan[]>([]);
  const [inventaris, setInventaris] = useState<Inventaris[]>([]);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [modalJemaat, setModalJemaat] = useState(false);
  const [modalKeluarga, setModalKeluarga] = useState(false);
  const [modalPelayan, setModalPelayan] = useState(false);
  const [modalKeuangan, setModalKeuangan] = useState(false);
  const [modalInventaris, setModalInventaris] = useState(false);
  const [modalJadwal, setModalJadwal] = useState(false);
  const [modalAbsensi, setModalAbsensi] = useState(false);
  const [modalNotifikasi, setModalNotifikasi] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [tabSettings, setTabSettings] = useState('profil');
  const [jemaatSearch, setJemaatSearch] = useState('');
  const [keuanganFilter, setKeuanganFilter] = useState('semua');

  const chartKeuanganRef = useRef<HTMLCanvasElement>(null);
  const chartJemaatRef = useRef<HTMLCanvasElement>(null);
  let chartKeuanganInstance: any = null;
  let chartJemaatInstance: any = null;

  // Load Chart.js dari CDN yang lebih aman
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js';
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';
      script.onload = () => setChartReady(true);
      document.head.appendChild(script);
    } else if ((window as any).Chart) {
      setChartReady(true);
    }
  }, []);

  // Load data awal
  useEffect(() => {
    setJemaat(getData<Jemaat>(STORAGE_KEYS.jemaat));
    setKeluarga(getData<Keluarga>(STORAGE_KEYS.keluarga));
    setPelayan(getData<Pelayan>(STORAGE_KEYS.pelayan));
    setKeuangan(getData<Keuangan>(STORAGE_KEYS.keuangan));
    setInventaris(getData<Inventaris>(STORAGE_KEYS.inventaris));
    setJadwal(getData<Jadwal>(STORAGE_KEYS.jadwal));
    setAbsensi(getData<Absensi>(STORAGE_KEYS.absensi));
    setNotifikasi(getData<Notifikasi>(STORAGE_KEYS.notifikasi));
    setSettings(getSettings());
    const s = getSettings();
    document.documentElement.style.fontSize = s.fontSize === 'large' ? '18px' : s.fontSize === 'small' ? '14px' : '16px';
  }, []);

  // Auto save ke localStorage
  useEffect(() => { setData(STORAGE_KEYS.jemaat, jemaat); }, [jemaat]);
  useEffect(() => { setData(STORAGE_KEYS.keluarga, keluarga); }, [keluarga]);
  useEffect(() => { setData(STORAGE_KEYS.pelayan, pelayan); }, [pelayan]);
  useEffect(() => { setData(STORAGE_KEYS.keuangan, keuangan); }, [keuangan]);
  useEffect(() => { setData(STORAGE_KEYS.inventaris, inventaris); }, [inventaris]);
  useEffect(() => { setData(STORAGE_KEYS.jadwal, jadwal); }, [jadwal]);
  useEffect(() => { setData(STORAGE_KEYS.absensi, absensi); }, [absensi]);
  useEffect(() => { setData(STORAGE_KEYS.notifikasi, notifikasi); }, [notifikasi]);
  useEffect(() => { saveSettingsToStorage(settings); }, [settings]);

  // CRUD helpers
  const addItem = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => setter(prev => [item, ...prev]);
  const updateItem = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => setter(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteItem = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string, label: string) => { if (confirm(`Hapus ${label}?`)) setter(prev => prev.filter(i => i.id !== id)); };

  const renderTable = <T extends Record<string, any>>(data: T[], columns: { label: string; key?: keyof T; render?: (item: T) => React.ReactNode }[]) => (
    <div className="overflow-x-auto">
      <table className="modern-table responsive-table w-full">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider"><tr>{columns.map(c => <th key={c.label} className="px-4 py-3 text-left">{c.label}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? <tr><td colSpan={columns.length} className="text-center py-10 text-gray-400">Belum ada data</td></tr> :
            data.map(item => (
              <tr key={item.id} className="hover:bg-blue-50/50 transition">
                {columns.map(c => <td key={c.label} data-label={c.label} className={`px-4 py-3 ${c.label === 'Aksi' ? 'action-btns text-center' : ''}`}>{c.render ? c.render(item) : (c.key ? item[c.key] : '-')}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const saldo = keuangan.reduce((a,i) => a + (i.jenis === 'masuk' ? i.jumlah : -i.jumlah), 0);
  const jadwalAktif = jadwal.filter(i => i.status === 'Terjadwal' || i.status === 'Berlangsung').length;

  // Charts
  useEffect(() => {
    if (activeMenu === 'dashboard' && chartReady && chartKeuanganRef.current && chartJemaatRef.current) {
      if (chartKeuanganInstance) chartKeuanganInstance.destroy();
      if (chartJemaatInstance) chartJemaatInstance.destroy();
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun'];
      const masuk = new Array(6).fill(0), keluar = new Array(6).fill(0);
      keuangan.forEach(i => { const m = new Date(i.tanggal).getMonth(); if (m>=0 && m<6) i.jenis === 'masuk' ? masuk[m] += i.jumlah : keluar[m] += i.jumlah; });
      const ctx1 = chartKeuanganRef.current.getContext('2d');
      if (ctx1) {
        const Chart = (window as any).Chart;
        chartKeuanganInstance = new Chart(ctx1, { type:'bar', data:{ labels:months, datasets:[{ label:'Masuk', data:masuk, backgroundColor:'#4caf84' },{ label:'Keluar', data:keluar, backgroundColor:'#e0556a' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } } });
      }
      const pria = jemaat.filter(j => j.gender === 'Pria').length, wanita = jemaat.filter(j => j.gender === 'Wanita').length;
      const ctx2 = chartJemaatRef.current.getContext('2d');
      if (ctx2) {
        const Chart = (window as any).Chart;
        chartJemaatInstance = new Chart(ctx2, { type:'doughnut', data:{ labels:['Pria','Wanita'], datasets:[{ data:[pria,wanita], backgroundColor:['#2c5282','#e8c547'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } } });
      }
    }
    return () => { if (chartKeuanganInstance) chartKeuanganInstance.destroy(); if (chartJemaatInstance) chartJemaatInstance.destroy(); };
  }, [activeMenu, chartReady, keuangan, jemaat]);

  // Helper untuk select options
  const getJemaatOptions = () => jemaat.map(j => ({ value: j.nama, label: j.nama }));
  const getJadwalOptions = () => jadwal.map(j => ({ value: j.nama, label: j.nama }));
  const getPelayanOptions = () => pelayan.map(p => ({ value: p.nama, label: `${p.nama} (${p.jabatan})` }));

  // Modal handlers
  const handleSaveJemaat = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Jemaat = { id: editId || generateId(), nama: form.nama.value, gender: form.gender.value, baptis: form.baptis.value, tempatLahir: form.tempatLahir.value, tglLahir: form.tglLahir.value, alamat: form.alamat.value, telp: form.telp.value, nikah: form.nikah.value, pekerjaan: form.pekerjaan.value, status: form.status.value };
    editId ? updateItem(setJemaat, data) : addItem(setJemaat, data);
    setModalJemaat(false);
  };
  const handleSaveKeluarga = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Keluarga = { id: editId || generateId(), noKK: form.noKK.value, kepala: form.kepala.value, alamat: form.alamat.value, jumlah: parseInt(form.jumlah.value) || 1 };
    editId ? updateItem(setKeluarga, data) : addItem(setKeluarga, data);
    setModalKeluarga(false);
  };
  const handleSavePelayan = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Pelayan = { id: editId || generateId(), nama: form.nama.value, jabatan: form.jabatan.value, departemen: form.departemen.value, status: form.status.value };
    editId ? updateItem(setPelayan, data) : addItem(setPelayan, data);
    setModalPelayan(false);
  };
  const handleSaveKeuangan = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const jumlah = parseInt(form.jumlah.value); if (jumlah <= 0) return alert('Jumlah harus > 0');
    const data: Keuangan = { id: editId || generateId(), jenis: form.jenis.value, kategori: form.kategori.value, jumlah, deskripsi: form.deskripsi.value, tanggal: form.tanggal.value };
    editId ? updateItem(setKeuangan, data) : addItem(setKeuangan, data);
    setModalKeuangan(false);
  };
  const handleSaveInventaris = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Inventaris = { id: editId || generateId(), nama: form.nama.value, kategori: form.kategori.value, jumlah: parseInt(form.jumlah.value) || 1, harga: parseInt(form.harga.value) || 0, tahun: parseInt(form.tahun.value) || new Date().getFullYear(), kondisi: form.kondisi.value };
    editId ? updateItem(setInventaris, data) : addItem(setInventaris, data);
    setModalInventaris(false);
  };
  const handleSaveJadwal = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Jadwal = { id: editId || generateId(), nama: form.nama.value, tanggal: form.tanggal.value, waktu: form.waktu.value, lokasi: form.lokasi.value, pj: form.pj.value, status: form.status.value };
    editId ? updateItem(setJadwal, data) : addItem(setJadwal, data);
    setModalJadwal(false);
  };
  const handleSaveAbsensi = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Absensi = { id: generateId(), kegiatan: form.kegiatan.value, nama: form.nama.value, status: form.status.value, tanggal: form.tanggal.value };
    addItem(setAbsensi, data);
    setModalAbsensi(false);
  };
  const handleSaveNotifikasi = (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as any;
    const data: Notifikasi = { id: generateId(), judul: form.judul.value, pesan: form.pesan.value, target: form.target.value, via: form.via.value, tanggal: new Date().toISOString().split('T')[0] };
    addItem(setNotifikasi, data);
    setModalNotifikasi(false);
    alert('Notifikasi terkirim (simulasi)');
  };

  // Render content
  const renderPage = () => {
    switch(activeMenu) {
      case 'dashboard': return (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
            {[{ icon:'users', color:'blue', label:'Jemaat', value:jemaat.length }, { icon:'user-tie', color:'green', label:'Pelayan', value:pelayan.length }, { icon:'calendar-check', color:'amber', label:'Jadwal Aktif', value:jadwalAktif }, { icon:'coins', color:'purple', label:'Saldo', value:`Rp ${saldo.toLocaleString('id-ID')}` }, { icon:'box-archive', color:'red', label:'Inventaris', value:inventaris.length }, { icon:'chart-line', color:'indigo', label:'Transaksi', value:keuangan.length }].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3"><div className={`w-10 h-10 rounded-full bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-700`}><i className={`fa-solid fa-${stat.icon}`}></i></div><div><h3 className="text-lg md:text-xl font-bold">{stat.value}</h3><p className="text-xs text-gray-500">{stat.label}</p></div></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5"><h3 className="text-lg font-bold text-[#0f1a2e] mb-4"><i className="fa-solid fa-chart-line mr-2 text-[#e8c547]"></i>Grafik Keuangan 6 Bulan</h3><div className="chart-wrapper h-72"><canvas ref={chartKeuanganRef}></canvas></div></div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5"><h3 className="text-lg font-bold text-[#0f1a2e] mb-4"><i className="fa-solid fa-chart-pie mr-2 text-[#e8c547]"></i>Distribusi Jemaat</h3><div className="chart-wrapper h-72"><canvas ref={chartJemaatRef}></canvas></div></div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-[#0f1a2e]"><i className="fa-solid fa-calendar-day mr-2"></i>Jadwal Terbaru</h3><button className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => setActiveMenu('jadwal')}>Lihat Semua</button></div><div className="p-4 overflow-x-auto">{jadwal.slice(0,5).length ? <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th>Tanggal</th><th>Kegiatan</th><th>Lokasi</th><th>Status</th></tr></thead><tbody>{jadwal.slice(0,5).map(j => <tr key={j.id}><td>{new Date(j.tanggal).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</td><td><strong>{j.nama}</strong></td><td>{j.lokasi||'-'}</td><td><Badge color="bg-blue-100 text-blue-700">{j.status}</Badge></td></tr>)}</tbody></table> : <div className="text-center py-6 text-gray-400">Belum ada jadwal</div>}</div></div>
        </>
      );
      case 'jemaat': { const filtered = jemaat.filter(i => i.nama.toLowerCase().includes(jemaatSearch.toLowerCase())); return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-users mr-2"></i>Data Jemaat</h3><div className="flex gap-2"><input type="text" placeholder="Cari..." className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-48" value={jemaatSearch} onChange={e=>setJemaatSearch(e.target.value)} /><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>{setEditId(null); setModalJemaat(true);}}><i className="fa-solid fa-plus mr-1"></i> Tambah</button></div></div><div className="p-4 overflow-x-auto">{renderTable(filtered, [{ label:'Nama', render:i=><span className="font-semibold">{i.nama}</span> }, { label:'Gender', key:'gender' }, { label:'Baptis', key:'baptis' }, { label:'Lahir', render:i=>`${i.tempatLahir||''}${i.tempatLahir&&i.tglLahir?', ':''}${i.tglLahir||'-'}` }, { label:'Alamat', key:'alamat' }, { label:'Status', render:i=><Badge color={i.status==='Aktif'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}>{i.status}</Badge> }, { label:'Aksi', render:i=><><button className="edit-btn" onClick={()=>{setEditId(i.id); setModalJemaat(true);}}><i className="fa-solid fa-pen-to-square"></i></button><button className="delete-btn" onClick={()=>deleteItem(setJemaat,i.id,'jemaat')}><i className="fa-solid fa-trash"></i></button></> }])}</div></div>); }
      case 'keluarga': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-house-chimney mr-2"></i>Kartu Keluarga</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>{setEditId(null); setModalKeluarga(true);}}><i className="fa-solid fa-plus mr-1"></i> Tambah KK</button></div><div className="p-4 overflow-x-auto">{renderTable(keluarga, [{ label:'No. KK', key:'noKK' }, { label:'Kepala Keluarga', key:'kepala' }, { label:'Alamat', key:'alamat' }, { label:'Jumlah', key:'jumlah' }, { label:'Aksi', render:i=><><button className="edit-btn" onClick={()=>{setEditId(i.id); setModalKeluarga(true);}}><i className="fa-solid fa-pen-to-square"></i></button><button className="delete-btn" onClick={()=>deleteItem(setKeluarga,i.id,'KK')}><i className="fa-solid fa-trash"></i></button></> }])}</div></div>);
      case 'pelayan': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-user-tie mr-2"></i>Pelayan Gereja (Urut Jabatan)</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>{setEditId(null); setModalPelayan(true);}}><i className="fa-solid fa-plus mr-1"></i> Tambah</button></div><div className="p-4 overflow-x-auto">{renderTable([...pelayan].sort((a,b)=>(JABATAN_ORDER[a.jabatan]||99)-(JABATAN_ORDER[b.jabatan]||99)), [{ label:'Nama', key:'nama' }, { label:'Jabatan', render:i=><Badge color="bg-blue-100 text-blue-700">{i.jabatan}</Badge> }, { label:'Departemen', key:'departemen' }, { label:'Status', render:i=><Badge color={i.status==='Aktif'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}>{i.status}</Badge> }, { label:'Aksi', render:i=><><button className="edit-btn" onClick={()=>{setEditId(i.id); setModalPelayan(true);}}><i className="fa-solid fa-pen-to-square"></i></button><button className="delete-btn" onClick={()=>deleteItem(setPelayan,i.id,'pelayan')}><i className="fa-solid fa-trash"></i></button></> }])}</div></div>);
      case 'keuangan': { const masukTotal = keuangan.filter(k=>k.jenis==='masuk').reduce((a,b)=>a+b.jumlah,0), keluarTotal = keuangan.filter(k=>k.jenis==='keluar').reduce((a,b)=>a+b.jumlah,0), filtered = keuanganFilter==='semua'?keuangan:keuangan.filter(k=>k.jenis===keuanganFilter); return (<><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6"><div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><i className="fa-solid fa-arrow-down"></i></div><div><h3 className="text-lg font-bold">Rp {masukTotal.toLocaleString('id-ID')}</h3><p className="text-xs text-gray-500">Pemasukan</p></div></div><div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500"><i className="fa-solid fa-arrow-up"></i></div><div><h3 className="text-lg font-bold">Rp {keluarTotal.toLocaleString('id-ID')}</h3><p className="text-xs text-gray-500">Pengeluaran</p></div></div><div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700"><i className="fa-solid fa-wallet"></i></div><div><h3 className="text-lg font-bold truncate">Rp {(masukTotal-keluarTotal).toLocaleString('id-ID')}</h3><p className="text-xs text-gray-500">Saldo</p></div></div><div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><i className="fa-solid fa-receipt"></i></div><div><h3 className="text-lg font-bold">{keuangan.length}</h3><p className="text-xs text-gray-500">Transaksi</p></div></div></div><div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-coins mr-2"></i>Catatan Keuangan</h3><div className="flex gap-2"><select className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm" value={keuanganFilter} onChange={e=>setKeuanganFilter(e.target.value)}><option value="semua">Semua</option><option value="masuk">Pemasukan</option><option value="keluar">Pengeluaran</option></select><button className="bg-[#e8c547] text-[#0f1a2e] px-4 py-2 rounded-lg text-sm font-semibold" onClick={()=>{setEditId(null); setModalKeuangan(true);}}><i className="fa-solid fa-plus mr-1"></i> Tambah</button></div></div><div className="p-4 overflow-x-auto">{renderTable(filtered, [{ label:'Tanggal', key:'tanggal' }, { label:'Jenis', render:i=><Badge color={i.jenis==='masuk'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}><i className={`fa-solid fa-arrow-${i.jenis==='masuk'?'down':'up'} mr-1`}></i>{i.jenis==='masuk'?'Masuk':'Keluar'}</Badge> }, { label:'Kategori', key:'kategori' }, { label:'Jumlah', render:i=><span className={`font-bold ${i.jenis==='masuk'?'text-green-700':'text-red-600'}`}>Rp {i.jumlah.toLocaleString('id-ID')}</span> }, { label:'Deskripsi', key:'deskripsi' }, { label:'Aksi', render:i=><><button className="edit-btn" onClick={()=>{setEditId(i.id); setModalKeuangan(true);}}><i className="fa-solid fa-pen-to-square"></i></button><button className="delete-btn" onClick={()=>deleteItem(setKeuangan,i.id,'transaksi')}><i className="fa-solid fa-trash"></i></button></> }])}</div></div></>); }
      case 'inventaris': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-box-archive mr-2"></i>Inventaris</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>{setEditId(null); setModalInventaris(true);}}><i className="fa-solid fa-plus mr-1"></i> Tambah</button></div><div className="p-4 overflow-x-auto">{renderTable(inventaris, [{ label:'Nama Barang', key:'nama' }, { label:'Kategori', key:'kategori' }, { label:'Jumlah', key:'jumlah' }, { label:'Harga', render:i=>`Rp ${i.harga.toLocaleString('id-ID')}` }, { label:'Tahun', key:'tahun' }, { label:'Kondisi', render:i=><Badge color={i.kondisi==='Baik'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}>{i.kondisi}</Badge> }, { label:'Aksi', render:i=><><button className="edit-btn" onClick={()=>{setEditId(i.id); setModalInventaris(true);}}><i className="fa-solid fa-pen-to-square"></i></button><button className="delete-btn" onClick={()=>deleteItem(setInventaris,i.id,'inventaris')}><i className="fa-solid fa-trash"></i></button></> }])}</div></div>);
      case 'jadwal': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-calendar-days mr-2"></i>Jadwal Kegiatan</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>{setEditId(null); setModalJadwal(true);}}><i className="fa-solid fa-plus mr-1"></i> Tambah</button></div><div className="p-4 overflow-x-auto">{renderTable(jadwal, [{ label:'Tanggal', render:i=>new Date(i.tanggal).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) }, { label:'Waktu', key:'waktu' }, { label:'Kegiatan', key:'nama' }, { label:'Lokasi', key:'lokasi' }, { label:'PJ', key:'pj' }, { label:'Status', render:i=>{ const c={Terjadwal:'bg-amber-100 text-amber-700',Berlangsung:'bg-blue-100 text-blue-700',Selesai:'bg-green-100 text-green-700',Dibatalkan:'bg-red-100 text-red-600'}; return <Badge color={c[i.status]||''}>{i.status}</Badge>; } }, { label:'Aksi', render:i=><><button className="edit-btn" onClick={()=>{setEditId(i.id); setModalJadwal(true);}}><i className="fa-solid fa-pen-to-square"></i></button><button className="delete-btn" onClick={()=>deleteItem(setJadwal,i.id,'jadwal')}><i className="fa-solid fa-trash"></i></button></> }])}</div></div>);
      case 'absensi': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-clipboard-check mr-2"></i>Absensi</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>setModalAbsensi(true)}><i className="fa-solid fa-plus mr-1"></i> Catat Absensi</button></div><div className="p-4 overflow-x-auto">{renderTable(absensi, [{ label:'Tanggal', key:'tanggal' }, { label:'Kegiatan', key:'kegiatan' }, { label:'Nama', key:'nama' }, { label:'Status', render:i=>{ const c={Hadir:'bg-green-100 text-green-700','Tidak Hadir':'bg-red-100 text-red-600',Izin:'bg-amber-100 text-amber-700',Sakit:'bg-purple-100 text-purple-700'}; return <Badge color={c[i.status]||''}>{i.status}</Badge>; } }, { label:'Aksi', render:i=><button className="delete-btn" onClick={()=>deleteItem(setAbsensi,i.id,'absensi')}><i className="fa-solid fa-trash"></i></button> }])}</div></div>);
      case 'notifikasi': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-bell mr-2"></i>Notifikasi</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>setModalNotifikasi(true)}><i className="fa-solid fa-plus mr-1"></i> Kirim</button></div><div className="p-4 overflow-x-auto">{renderTable(notifikasi, [{ label:'Tanggal', key:'tanggal' }, { label:'Judul', key:'judul' }, { label:'Target', key:'target' }, { label:'Via', key:'via' }, { label:'Aksi', render:i=><button className="delete-btn" onClick={()=>deleteItem(setNotifikasi,i.id,'notifikasi')}><i className="fa-solid fa-trash"></i></button> }])}</div></div>);
      case 'dokumen': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold"><i className="fa-solid fa-file-alt mr-2"></i>Dokumen & Laporan</h3><button className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm" onClick={()=>{ const m=keuangan.filter(k=>k.jenis==='masuk').reduce((a,b)=>a+b.jumlah,0), k=keuangan.filter(k=>k.jenis==='keluar').reduce((a,b)=>a+b.jumlah,0); alert(`Laporan Keuangan:\nPemasukan: Rp ${m.toLocaleString('id-ID')}\nPengeluaran: Rp ${k.toLocaleString('id-ID')}\nSaldo: Rp ${(m-k).toLocaleString('id-ID')}`); }}><i className="fa-solid fa-print mr-1"></i> Buat Laporan</button></div><div className="p-4 space-y-4"><div className="p-4 bg-gray-50 rounded-xl"><h4 className="font-bold mb-2">Laporan Keuangan</h4><p>Pemasukan: Rp {keuangan.filter(k=>k.jenis==='masuk').reduce((a,b)=>a+b.jumlah,0).toLocaleString('id-ID')}</p><p>Pengeluaran: Rp {keuangan.filter(k=>k.jenis==='keluar').reduce((a,b)=>a+b.jumlah,0).toLocaleString('id-ID')}</p><p>Saldo: Rp {saldo.toLocaleString('id-ID')}</p><button onClick={()=>window.print()} className="mt-3 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm"><i className="fa-solid fa-print mr-1"></i> Cetak</button></div><div className="p-4 bg-gray-50 rounded-xl"><h4 className="font-bold mb-2">Statistik Jemaat</h4><p>Total: {jemaat.length}, Aktif: {jemaat.filter(i=>i.status==='Aktif').length}, Pria: {jemaat.filter(i=>i.gender==='Pria').length}, Wanita: {jemaat.filter(i=>i.gender==='Wanita').length}</p></div></div></div>);
      case 'pengaturan': return (<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"><div className="border-b border-gray-200 px-5"><nav className="flex space-x-2">{[{id:'profil',label:'Profil'},{id:'akun',label:'Akun'},{id:'database',label:'Database'},{id:'notif',label:'Notifikasi'},{id:'tampilan',label:'Tampilan'},{id:'integrasi',label:'Integrasi'}].map(tab=><button key={tab.id} className={`px-5 py-3 text-sm font-semibold border-b-2 ${tabSettings===tab.id?'border-[#1e3a5f] text-[#1e3a5f]':'border-transparent text-gray-500'}`} onClick={()=>setTabSettings(tab.id)}>{tab.label}</button>)}</nav></div><div className="p-6">{tabSettings==='profil'&&<><h3 className="text-lg font-bold mb-4">Profil Gereja</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" id="setNamaGereja" defaultValue={settings.namaGereja} placeholder="Nama Gereja" className="border-2 rounded-lg p-2"/><input type="text" id="setKodeGereja" defaultValue={settings.kodeGereja} placeholder="Kode" className="border-2 rounded-lg p-2"/><textarea id="setAlamat" rows={2} defaultValue={settings.alamat} placeholder="Alamat" className="border-2 rounded-lg p-2 col-span-2"></textarea><input type="text" id="setTelp" defaultValue={settings.telp} placeholder="Telepon" className="border-2 rounded-lg p-2"/><input type="email" id="setEmail" defaultValue={settings.email} placeholder="Email" className="border-2 rounded-lg p-2"/><input type="text" id="setWebsite" defaultValue={settings.website} placeholder="Website" className="border-2 rounded-lg p-2"/></div><button onClick={()=>{setSettings(prev=>({...prev,namaGereja:(document.getElementById('setNamaGereja')as HTMLInputElement).value,kodeGereja:(document.getElementById('setKodeGereja')as HTMLInputElement).value,alamat:(document.getElementById('setAlamat')as HTMLTextAreaElement).value,telp:(document.getElementById('setTelp')as HTMLInputElement).value,email:(document.getElementById('setEmail')as HTMLInputElement).value,website:(document.getElementById('setWebsite')as HTMLInputElement).value})); alert('Profil disimpan');}} className="mt-4 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg"><i className="fa-solid fa-save mr-1"></i> Simpan</button></>}{tabSettings==='akun'&&<><h3 className="text-lg font-bold mb-4">Pengaturan Akun</h3><div className="space-y-3 max-w-md"><input type="text" id="setUsername" defaultValue={settings.username} placeholder="Username" className="w-full border-2 rounded-lg p-2"/><input type="password" id="setPassword" placeholder="Password Baru" className="w-full border-2 rounded-lg p-2"/><input type="password" id="setPasswordConfirm" placeholder="Konfirmasi" className="w-full border-2 rounded-lg p-2"/><button onClick={()=>{const u=(document.getElementById('setUsername')as HTMLInputElement).value,p=(document.getElementById('setPassword')as HTMLInputElement).value,c=(document.getElementById('setPasswordConfirm')as HTMLInputElement).value;if(!u)return alert('Username harus diisi');if(p&&p!==c)return alert('Password tidak cocok');setSettings(prev=>({...prev,username:u,password:p||prev.password}));alert('Akun disimpan');}} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg"><i className="fa-solid fa-key mr-1"></i> Simpan</button></div></>}{tabSettings==='database'&&<><h3 className="text-lg font-bold mb-4">Manajemen Data</h3><div className="space-y-4"><div className="p-4 bg-gray-50 rounded-xl"><h4 className="font-semibold mb-2">Backup</h4><button onClick={()=>{const all={jemaat,keluarga,pelayan,keuangan,inventaris,jadwal,absensi,notifikasi,settings};const blob=new Blob([JSON.stringify(all,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`backup_${new Date().toISOString().slice(0,10)}.json`;a.click();}} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"><i className="fa-solid fa-download mr-1"></i> Ekspor JSON</button></div><div className="p-4 bg-gray-50 rounded-xl"><h4 className="font-semibold mb-2">Restore</h4><input type="file" id="restoreFileInput" accept=".json" className="block mb-2 text-sm"/><button onClick={()=>{const inp=document.getElementById('restoreFileInput')as HTMLInputElement;if(!inp.files?.length)return alert('Pilih file');const reader=new FileReader();reader.onload=e=>{try{const data=JSON.parse(e.target?.result as string);if(confirm('Timpa semua data?')){setJemaat(data.jemaat||[]);setKeluarga(data.keluarga||[]);setPelayan(data.pelayan||[]);setKeuangan(data.keuangan||[]);setInventaris(data.inventaris||[]);setJadwal(data.jadwal||[]);setAbsensi(data.absensi||[]);setNotifikasi(data.notifikasi||[]);setSettings(data.settings||DEFAULT_SETTINGS);alert('Berhasil dipulihkan');}}catch{alert('File tidak valid');}};reader.readAsText(inp.files[0]);}} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"><i className="fa-solid fa-upload mr-1"></i> Pulihkan</button></div><div className="p-4 bg-red-50 rounded-xl border border-red-200"><h4 className="font-semibold mb-2 text-red-800">Reset</h4><button onClick={()=>{if(confirm('Hapus semua data?')){Object.keys(STORAGE_KEYS).forEach(k=>localStorage.removeItem(k));window.location.reload();}}} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"><i className="fa-solid fa-trash-alt mr-1"></i> Reset Semua</button></div></div></>}{tabSettings==='notif'&&<><h3 className="text-lg font-bold mb-4">Preferensi Notifikasi</h3><div className="space-y-3"><label className="flex items-center gap-2"><input type="checkbox" id="setNotifWA" defaultChecked={settings.notifWA}/> WhatsApp</label><label className="flex items-center gap-2"><input type="checkbox" id="setNotifSMS" defaultChecked={settings.notifSMS}/> SMS</label><label className="flex items-center gap-2"><input type="checkbox" id="setNotifEmail" defaultChecked={settings.notifEmail}/> Email</label><button onClick={()=>{setSettings(prev=>({...prev,notifWA:(document.getElementById('setNotifWA')as HTMLInputElement).checked,notifSMS:(document.getElementById('setNotifSMS')as HTMLInputElement).checked,notifEmail:(document.getElementById('setNotifEmail')as HTMLInputElement).checked}));alert('Preferensi disimpan');}} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg">Simpan</button></div></>}{tabSettings==='tampilan'&&<><h3 className="text-lg font-bold mb-4">Tampilan</h3><div className="space-y-3"><select id="setFontSize" defaultValue={settings.fontSize} className="border-2 rounded-lg p-2"><option value="small">Kecil</option><option value="normal">Normal</option><option value="large">Besar</option></select><select id="setMode" defaultValue={settings.mode} className="border-2 rounded-lg p-2"><option value="light">Terang</option><option value="dark">Gelap (segera)</option></select><button onClick={()=>{const fontSize=(document.getElementById('setFontSize')as HTMLSelectElement).value,mode=(document.getElementById('setMode')as HTMLSelectElement).value;setSettings(prev=>({...prev,fontSize,mode}));document.documentElement.style.fontSize=fontSize==='large'?'18px':fontSize==='small'?'14px':'16px';alert('Tampilan diperbarui');}} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg">Terapkan</button></div></>}{tabSettings==='integrasi'&&<><h3 className="text-lg font-bold mb-4">Integrasi API</h3><div className="space-y-3"><input type="text" id="setWAKey" defaultValue={settings.waKey} placeholder="WhatsApp API Key" className="w-full border-2 rounded-lg p-2"/><input type="text" id="setSMTPHost" defaultValue={settings.smtpHost} placeholder="SMTP Host" className="w-full border-2 rounded-lg p-2"/><input type="email" id="setEmailFrom" defaultValue={settings.emailFrom} placeholder="Email Pengirim" className="w-full border-2 rounded-lg p-2"/><button onClick={()=>{setSettings(prev=>({...prev,waKey:(document.getElementById('setWAKey')as HTMLInputElement).value,smtpHost:(document.getElementById('setSMTPHost')as HTMLInputElement).value,emailFrom:(document.getElementById('setEmailFrom')as HTMLInputElement).value}));alert('Integrasi disimpan');}} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg">Simpan</button></div></>}</div></div>);
      default: return <div className="text-center py-20 text-gray-400">Modul {activeMenu} sedang dikembangkan</div>;
    }
  };

  // Modal wrapper
  const Modal = ({isOpen,onClose,title,children}:{isOpen:boolean,onClose:()=>void,title:string,children:React.ReactNode}) => {
    if(!isOpen) return null;
    return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}><h2 className="text-xl font-bold text-[#0f1a2e] mb-5">{title}</h2>{children}<div className="flex justify-end gap-3 mt-6"><button className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold" onClick={onClose}>Batal</button><button className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg font-semibold" form="modal-form">Simpan</button></div></div></div>;
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        <style>{`
          ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:20px}
          .modern-table{width:100%;border-collapse:separate;border-spacing:0;font-size:.875rem}
          .modern-table thead th{background:#f3f4f6;color:#4b5563;font-weight:600;padding:.75rem 1rem;text-align:left;text-transform:uppercase;font-size:.7rem;border-bottom:2px solid #e5e7eb}
          .modern-table tbody tr:hover{background:#eff6ff}
          .modern-table tbody td{padding:.75rem 1rem;border-bottom:1px solid #f3f4f6}
          .action-btns button{padding:.35rem;border-radius:.5rem;background:transparent;border:none;cursor:pointer}
          .action-btns button.edit-btn{color:#2563eb}
          .action-btns button.edit-btn:hover{background:#dbeafe}
          .action-btns button.delete-btn{color:#ef4444}
          .action-btns button.delete-btn:hover{background:#fee2e2}
          @media(max-width:640px){.responsive-table thead{display:none}.responsive-table tr{display:block;margin-bottom:1rem;border:1px solid #e5e7eb;border-radius:.5rem;background:white}.responsive-table td{display:flex;justify-content:space-between;padding:.5rem 1rem;border-bottom:1px solid #e5e7eb}.responsive-table td::before{content:attr(data-label);font-weight:600;color:#4b5563}}
          .chart-wrapper{position:relative;width:100%;height:280px;margin:0 auto}
          .chart-wrapper canvas{max-height:100%;max-width:100%}
        `}</style>
      </Head>
      <div className="flex h-screen bg-[#f7f8fa]">
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-[#0f1a2e] to-[#1e3a5f] text-white shadow-2xl transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="p-5 border-b border-white/10 text-center"><i className="fa-solid fa-church text-4xl mb-1 text-[#e8c547]"></i><h2 className="text-lg font-bold">GerejaDigital</h2><p className="text-xs opacity-70">{settings.namaGereja}</p></div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <div className="text-[0.65rem] uppercase opacity-50 px-3 pt-4 pb-2 font-semibold">Menu Utama</div>
            {[{id:'dashboard',icon:'chart-pie',label:'Dashboard'},{id:'jemaat',icon:'users',label:'Data Jemaat'},{id:'keluarga',icon:'house-chimney',label:'Kartu Keluarga'},{id:'pelayan',icon:'user-tie',label:'Pelayan Gereja'}].map(item=>(
              <button key={item.id} onClick={()=>{setActiveMenu(item.id);setSidebarOpen(false)}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeMenu===item.id?'bg-white/20 text-white':'text-white/80 hover:bg-white/10 hover:text-white'}`}><i className={`fa-solid fa-${item.icon} w-6 text-center`}></i> {item.label}</button>
            ))}
            <div className="text-[0.65rem] uppercase opacity-50 px-3 pt-4 pb-2 font-semibold">Operasional</div>
            {[{id:'keuangan',icon:'coins',label:'Keuangan'},{id:'inventaris',icon:'box-archive',label:'Inventaris'},{id:'jadwal',icon:'calendar-days',label:'Jadwal'},{id:'absensi',icon:'clipboard-check',label:'Absensi'}].map(item=>(
              <button key={item.id} onClick={()=>{setActiveMenu(item.id);setSidebarOpen(false)}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeMenu===item.id?'bg-white/20 text-white':'text-white/80 hover:bg-white/10 hover:text-white'}`}><i className={`fa-solid fa-${item.icon} w-6 text-center`}></i> {item.label}</button>
            ))}
            <div className="text-[0.65rem] uppercase opacity-50 px-3 pt-4 pb-2 font-semibold">Komunikasi</div>
            {[{id:'notifikasi',icon:'bell',label:'Notifikasi'},{id:'dokumen',icon:'file-alt',label:'Dokumen'}].map(item=>(
              <button key={item.id} onClick={()=>{setActiveMenu(item.id);setSidebarOpen(false)}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeMenu===item.id?'bg-white/20 text-white':'text-white/80 hover:bg-white/10 hover:text-white'}`}><i className={`fa-solid fa-${item.icon} w-6 text-center`}></i> {item.label}</button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10"><button onClick={()=>{setActiveMenu('pengaturan');setSidebarOpen(false)}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium justify-center ${activeMenu==='pengaturan'?'bg-white/20 text-white':'text-white/80 hover:text-white'}`}><i className="fa-solid fa-gear w-6 text-center"></i> Pengaturan</button></div>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}></div>}
        {/* Main content */}
        <div className="lg:ml-64 transition-all duration-300 min-h-screen flex-1">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 px-4 md:px-5 py-3 flex justify-between items-center">
            <button className="lg:hidden text-[#0f1a2e] text-2xl" onClick={()=>setSidebarOpen(true)}><i className="fa-solid fa-bars"></i></button>
            <h1 className="text-xl font-bold text-[#0f1a2e] capitalize">{activeMenu}</h1>
            <span className="text-sm text-gray-500 hidden sm:inline">{new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
          </header>
          <main className="p-4 md:p-5">{renderPage()}</main>
        </div>
        {/* Modals */}
        <Modal isOpen={modalJemaat} onClose={()=>setModalJemaat(false)} title={editId?'Edit Jemaat':'Tambah Jemaat'}>
          <form id="modal-form" onSubmit={handleSaveJemaat} className="space-y-4">
            <input name="nama" placeholder="Nama Lengkap" required className="w-full border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.nama:''}/>
            <div className="grid grid-cols-2 gap-4"><select name="gender" className="border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.gender:'Pria'}><option>Pria</option><option>Wanita</option></select><select name="baptis" className="border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.baptis:'Sudah'}><option>Sudah</option><option>Belum</option></select></div>
            <div className="grid grid-cols-2 gap-4"><input name="tempatLahir" placeholder="Tempat Lahir" className="border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.tempatLahir:''}/><input name="tglLahir" type="date" className="border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.tglLahir:''}/></div>
            <textarea name="alamat" placeholder="Alamat" rows={2} className="w-full border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.alamat:''}></textarea>
            <div className="grid grid-cols-2 gap-4"><input name="telp" placeholder="No. Telepon" className="border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.telp:''}/><select name="nikah" className="border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.nikah:'Belum Menikah'}><option>Belum Menikah</option><option>Menikah</option><option>Duda/Janda</option></select></div>
            <input name="pekerjaan" placeholder="Pekerjaan" className="w-full border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.pekerjaan:''}/>
            <select name="status" className="w-full border-2 rounded-lg p-2" defaultValue={editId?jemaat.find(j=>j.id===editId)?.status:'Aktif'}><option>Aktif</option><option>Pasif</option><option>Pindah</option><option>Meninggal</option></select>
          </form>
        </Modal>
        <Modal isOpen={modalKeluarga} onClose={()=>setModalKeluarga(false)} title={editId?'Edit KK':'Tambah KK'}>
          <form onSubmit={handleSaveKeluarga} className="space-y-4"><input name="noKK" placeholder="No. KK" required className="w-full border-2 rounded-lg p-2" defaultValue={editId?keluarga.find(k=>k.id===editId)?.noKK:''}/><select name="kepala" className="w-full border-2 rounded-lg p-2" defaultValue={editId?keluarga.find(k=>k.id===editId)?.kepala:''}><option value="">-- Pilih --</option>{getJemaatOptions().map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><textarea name="alamat" placeholder="Alamat" rows={2} className="w-full border-2 rounded-lg p-2" defaultValue={editId?keluarga.find(k=>k.id===editId)?.alamat:''}></textarea><input name="jumlah" type="number" placeholder="Jumlah Anggota" min="1" className="w-full border-2 rounded-lg p-2" defaultValue={editId?keluarga.find(k=>k.id===editId)?.jumlah:1}/></form>
        </Modal>
        <Modal isOpen={modalPelayan} onClose={()=>setModalPelayan(false)} title={editId?'Edit Pelayan':'Tambah Pelayan'}>
          <form onSubmit={handleSavePelayan} className="space-y-4"><select name="nama" required className="w-full border-2 rounded-lg p-2" defaultValue={editId?pelayan.find(p=>p.id===editId)?.nama:''}><option value="">-- Pilih --</option>{getJemaatOptions().map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><select name="jabatan" className="w-full border-2 rounded-lg p-2" defaultValue={editId?pelayan.find(p=>p.id===editId)?.jabatan:'Pendeta'}>{Object.keys(JABATAN_ORDER).map(j=><option key={j}>{j}</option>)}</select><select name="departemen" className="w-full border-2 rounded-lg p-2" defaultValue={editId?pelayan.find(p=>p.id===editId)?.departemen:'Umum'}><option>Umum</option><option>Ibadah</option><option>Pemuda</option><option>Sekolah Minggu</option><option>Diakonia</option><option>Keuangan</option><option>Administrasi</option></select><select name="status" className="w-full border-2 rounded-lg p-2" defaultValue={editId?pelayan.find(p=>p.id===editId)?.status:'Aktif'}><option>Aktif</option><option>Tidak Aktif</option></select></form>
        </Modal>
        <Modal isOpen={modalKeuangan} onClose={()=>setModalKeuangan(false)} title={editId?'Edit Transaksi':'Tambah Transaksi'}>
          <form onSubmit={handleSaveKeuangan} className="space-y-4"><div className="grid grid-cols-2 gap-4"><select name="jenis" className="border-2 rounded-lg p-2" defaultValue={editId?keuangan.find(k=>k.id===editId)?.jenis:'masuk'}><option value="masuk">Pemasukan</option><option value="keluar">Pengeluaran</option></select><select name="kategori" className="border-2 rounded-lg p-2" defaultValue={editId?keuangan.find(k=>k.id===editId)?.kategori:'Persembahan'}><option>Persembahan</option><option>Donasi</option><option>Operasional</option><option>Acara/Kegiatan</option><option>Renovasi</option><option>Gaji Pegawai</option><option>Lainnya</option></select></div><input name="jumlah" type="number" placeholder="Jumlah (Rp)" required min="0" className="w-full border-2 rounded-lg p-2" defaultValue={editId?keuangan.find(k=>k.id===editId)?.jumlah:''}/><input name="tanggal" type="date" required className="w-full border-2 rounded-lg p-2" defaultValue={editId?keuangan.find(k=>k.id===editId)?.tanggal:new Date().toISOString().split('T')[0]}/><textarea name="deskripsi" placeholder="Deskripsi" rows={2} className="w-full border-2 rounded-lg p-2" defaultValue={editId?keuangan.find(k=>k.id===editId)?.deskripsi:''}></textarea></form>
        </Modal>
        <Modal isOpen={modalInventaris} onClose={()=>setModalInventaris(false)} title={editId?'Edit Inventaris':'Tambah Inventaris'}>
          <form onSubmit={handleSaveInventaris} className="space-y-4"><input name="nama" placeholder="Nama Barang" required className="w-full border-2 rounded-lg p-2" defaultValue={editId?inventaris.find(i=>i.id===editId)?.nama:''}/><div className="grid grid-cols-2 gap-4"><select name="kategori" className="border-2 rounded-lg p-2" defaultValue={editId?inventaris.find(i=>i.id===editId)?.kategori:'Peralatan Ibadah'}><option>Peralatan Ibadah</option><option>Elektronik</option><option>Furniture</option><option>Kendaraan</option><option>Tanah/Bangunan</option><option>Lainnya</option></select><input name="jumlah" type="number" placeholder="Jumlah" min="1" className="border-2 rounded-lg p-2" defaultValue={editId?inventaris.find(i=>i.id===editId)?.jumlah:1}/></div><div className="grid grid-cols-2 gap-4"><input name="harga" type="number" placeholder="Harga Satuan" min="0" className="border-2 rounded-lg p-2" defaultValue={editId?inventaris.find(i=>i.id===editId)?.harga:0}/><input name="tahun" type="number" placeholder="Tahun" min="2000" max="2026" className="border-2 rounded-lg p-2" defaultValue={editId?inventaris.find(i=>i.id===editId)?.tahun:new Date().getFullYear()}/></div><select name="kondisi" className="w-full border-2 rounded-lg p-2" defaultValue={editId?inventaris.find(i=>i.id===editId)?.kondisi:'Baik'}><option>Baik</option><option>Rusak Ringan</option><option>Rusak Berat</option></select></form>
        </Modal>
        <Modal isOpen={modalJadwal} onClose={()=>setModalJadwal(false)} title={editId?'Edit Kegiatan':'Tambah Kegiatan'}>
          <form onSubmit={handleSaveJadwal} className="space-y-4"><input name="nama" placeholder="Nama Kegiatan" required className="w-full border-2 rounded-lg p-2" defaultValue={editId?jadwal.find(j=>j.id===editId)?.nama:''}/><div className="grid grid-cols-2 gap-4"><input name="tanggal" type="date" required className="border-2 rounded-lg p-2" defaultValue={editId?jadwal.find(j=>j.id===editId)?.tanggal:''}/><input name="waktu" type="time" className="border-2 rounded-lg p-2" defaultValue={editId?jadwal.find(j=>j.id===editId)?.waktu:''}/></div><input name="lokasi" placeholder="Lokasi" className="w-full border-2 rounded-lg p-2" defaultValue={editId?jadwal.find(j=>j.id===editId)?.lokasi:''}/><select name="pj" className="w-full border-2 rounded-lg p-2" defaultValue={editId?jadwal.find(j=>j.id===editId)?.pj:''}><option value="">-- Pilih --</option>{getPelayanOptions().map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><select name="status" className="w-full border-2 rounded-lg p-2" defaultValue={editId?jadwal.find(j=>j.id===editId)?.status:'Terjadwal'}><option>Terjadwal</option><option>Berlangsung</option><option>Selesai</option><option>Dibatalkan</option></select></form>
        </Modal>
        <Modal isOpen={modalAbsensi} onClose={()=>setModalAbsensi(false)} title="Catat Absensi">
          <form onSubmit={handleSaveAbsensi} className="space-y-4"><select name="kegiatan" required className="w-full border-2 rounded-lg p-2"><option value="">-- Pilih --</option>{getJadwalOptions().map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><select name="nama" required className="w-full border-2 rounded-lg p-2"><option value="">-- Pilih --</option>{getJemaatOptions().map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><select name="status" className="w-full border-2 rounded-lg p-2"><option>Hadir</option><option>Tidak Hadir</option><option>Izin</option><option>Sakit</option></select><input name="tanggal" type="date" required className="w-full border-2 rounded-lg p-2" defaultValue={new Date().toISOString().split('T')[0]}/></form>
        </Modal>
        <Modal isOpen={modalNotifikasi} onClose={()=>setModalNotifikasi(false)} title="Kirim Notifikasi">
          <form onSubmit={handleSaveNotifikasi} className="space-y-4"><input name="judul" placeholder="Judul" required className="w-full border-2 rounded-lg p-2"/><textarea name="pesan" placeholder="Pesan" rows={3} className="w-full border-2 rounded-lg p-2"></textarea><div className="grid grid-cols-2 gap-4"><select name="target" className="border-2 rounded-lg p-2"><option>Semua Jemaat</option><option>Pelayan</option><option>Jemaat Aktif</option></select><select name="via" className="border-2 rounded-lg p-2"><option>WhatsApp</option><option>SMS</option><option>Email</option></select></div></form>
        </Modal>
      </div>
    </>
  );
}