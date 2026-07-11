# 📚 Gereja Digital - Admin Dashboard System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-blue)

Sistem manajemen admin komprehensif untuk gereja digital yang dibangun dengan Next.js, React, TypeScript, dan Tailwind CSS. Platform ini menyediakan solusi lengkap untuk mengelola jemaat, pelayan, keuangan, inventaris, jadwal, dan aspek-aspek operasional gereja lainnya.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Struktur File](#struktur-file)
- [Model Data](#model-data)
- [Panduan Instalasi](#panduan-instalasi)
- [Penggunaan](#penggunaan)
- [API Context](#api-context)
- [Komponen](#komponen)
- [Halaman-Halaman](#halaman-halaman)
- [Penyimpanan Data](#penyimpanan-data)
- [Development](#development)
- [Deployment](#deployment)

## 🚀 Fitur Utama

### 📊 Dashboard
- **Statistik Real-time**: Menampilkan KPI utama gereja
- **Kartu Informasi**: Jumlah jemaat, pelayan, saldo keuangan, inventaris
- **Jadwal Terbaru**: Daftar 5 jadwal acara terakhir
- **Chart Placeholders**: Siap untuk integrasi Chart.js

### 👥 Manajemen Jemaat (Data Jemaat)
- Daftar lengkap anggota jemaat
- **Field**: Nama, Gender, Baptis, Tempat Lahir, Tanggal Lahir, Alamat, Telp, Status Pernikahan, Pekerjaan, Status
- **Fitur CRUD**: Tambah, edit, hapus anggota
- **Pencarian**: Filter berdasarkan nama dan alamat
- **Validasi**: Nama wajib diisi

### 👨‍👩‍👧‍👦 Kartu Keluarga (Keluarga)
- Manajemen kartu keluarga jemaat
- **Field**: Nomor KK, Kepala Keluarga, Alamat, Jumlah Anggota
- **Dropdown Dinamis**: Kepala keluarga dipilih dari daftar jemaat
- **CRUD Lengkap**: Tambah, edit, hapus keluarga
- **Validasi**: Nomor KK wajib unik

### 🙏 Pelayan Gereja
- Daftar pelayan/staf gereja terorganisir
- **Field**: Nama, Jabatan, Departemen, Status
- **Sorting Otomatis**: Diurutkan berdasarkan hierarki jabatan (11 tipe)
- **Status Tracking**: Aktif/Tidak Aktif
- **Departemen**: 7 departemen (Ibadah, Anak-Anak, Pemuda, dst)

### 💰 Keuangan
- Sistem akuntansi komprehensif
- **Statistik**:
  - Total Pemasukan
  - Total Pengeluaran
  - Saldo Akhir
  - Jumlah Transaksi
- **Jenis Transaksi**: Masuk/Keluar
- **Kategori**: 7 kategori (Persembahan, Donasi, Operasional, dst)
- **Filter**: Tampilkan semua, pemasukan saja, pengeluaran saja
- **Validasi**: Jumlah harus lebih dari 0

### 📦 Inventaris
- Manajemen aset/barang gereja
- **Field**: Nama, Kategori, Jumlah, Harga, Tahun Perolehan, Kondisi
- **Kategori**: 6 jenis (Peralatan, Furniture, Musik, dst)
- **Kondisi Barang**: Baik, Rusak Ringan, Rusak Berat
- **Tracking Nilai**: Perhitungan nilai total per item

### 📅 Jadwal
- Manajemen acara dan kegiatan gereja
- **Field**: Nama, Tanggal, Waktu, Lokasi, PJ (Penanggung Jawab), Status
- **Status Acara**: 4 status dengan warna coding
- **Sorting Otomatis**: Diurutkan berdasarkan tanggal
- **Dropdown Dinamis**: PJ dipilih dari daftar pelayan

### ✅ Absensi
- Tracking kehadiran dalam acara
- **Field**: Kegiatan, Nama, Status, Tanggal
- **Status Kehadiran**: Hadir, Tidak Hadir, Izin, Sakit
- **Dropdown Dinamis**: Kegiatan dari jadwal, nama dari jemaat
- **Delete Only**: Hanya bisa menghapus, tidak ada edit

### 📢 Notifikasi
- Sistem penyiaran pesan/notifikasi
- **Field**: Judul, Pesan, Target, Via, Tanggal
- **Target**: Semua Jemaat, Pelayan saja, Jemaat Aktif
- **Channel**: WhatsApp, SMS, Email
- **Simulasi**: Toast alert saat notifikasi dikirim

### 📄 Dokumen
- Laporan dan export data
- **Laporan Keuangan**: 
  - Total Pemasukan (per kategori)
  - Total Pengeluaran (per kategori)
  - Saldo Final
- **Statistik Jemaat**:
  - Total Jemaat
  - Jemaat Aktif
  - Distribusi Gender (Pria/Wanita)
- **Print Function**: Integrasi dengan browser print (Ctrl+P)

### ⚙️ Pengaturan
- Konfigurasi sistem dengan 6 tab:
  1. **Profil Gereja**: Nama, Kode, Alamat, Telp, Email, Website
  2. **Akun**: Username, Password
  3. **Database**: Backup, Restore, Reset (Placeholder)
  4. **Notifikasi**: Preferensi channel (WA, SMS, Email)
  5. **Tampilan**: Font Size, Mode (Light/Dark) - Placeholder
  6. **Integrasi**: WhatsApp API, SMTP Host, Email

## 🏗️ Arsitektur Sistem

### Technology Stack
```
┌─────────────────────────────────────────┐
│         Next.js 14+ (App Router)        │
├─────────────────────────────────────────┤
│  React 18+ + TypeScript + Tailwind CSS  │
├─────────────────────────────────────────┤
│      React Context API (State Mgmt)     │
├─────────────────────────────────────────┤
│   LocalStorage (Data Persistence)       │
└─────────────────────────────────────────┘
```

### Alur Data
```
User Interaction
      ↓
Component (UI Layer)
      ↓
Context Hook (useAdmin)
      ↓
AdminContext (Business Logic)
      ↓
localStorage (Data Persistence)
```

### State Management
- **Context API**: Terpusat di `AdminContext.tsx`
- **8 Data Entities**: Jemaat, Pelayan, Keuangan, Inventaris, Keluarga, Jadwal, Absensi, Notifikasi
- **Local Storage**: Prefix `gd_` untuk semua key
- **Automatic Save**: Setiap operasi CRUD langsung disimpan

## 📁 Struktur File

```
app/admin/
│
├── 📄 layout.tsx                    # Root layout wrapper dengan AdminProvider
├── 📄 page.tsx                      # Main router - routes ke 11 halaman
│
├── 📂 context/
│   └── 📄 AdminContext.tsx          # Context utama (2400+ lines)
│       ├── 8 Interfaces (Data Models)
│       ├── AdminContextType Interface
│       ├── AdminProvider Component
│       ├── useAdmin Hook
│       └── localStorage Integration
│
├── 📂 components/
│   ├── 📄 AdminLayout.tsx           # Main layout wrapper
│   ├── 📄 Sidebar.tsx              # Navigation sidebar
│   ├── 📄 Header.tsx               # Top header bar
│   └── 📄 Modal.tsx                # Reusable modal dialog
│
└── 📂 pages/
    ├── 📄 Dashboard.tsx             # Dashboard dengan 6 stat cards
    ├── 📄 DataJemaat.tsx            # Jemaat management
    ├── 📄 KartuKeluarga.tsx         # Family card management
    ├── 📄 PelayanGereja.tsx         # Servants management
    ├── 📄 Keuangan.tsx              # Finance tracking
    ├── 📄 Inventaris.tsx            # Asset inventory
    ├── 📄 Jadwal.tsx                # Schedule management
    ├── 📄 Absensi.tsx               # Attendance tracking
    ├── 📄 Notifikasi.tsx            # Notification broadcast
    ├── 📄 Dokumen.tsx               # Reports & export
    └── 📄 Pengaturan.tsx            # Settings (6 tabs)
```

## 📊 Model Data

### 1. Jemaat (Congregation Member)
```typescript
interface Jemaat {
  id: string;
  nama: string;                    // Wajib, harus unik
  gender: 'Pria' | 'Wanita';
  baptis: 'Sudah' | 'Belum';
  tempatLahir: string;
  tglLahir: string;                // Format: YYYY-MM-DD
  alamat: string;
  telp: string;
  nikah: 'Menikah' | 'Lajang' | 'Cerai';
  pekerjaan: string;
  status: 'Aktif' | 'Non-Aktif';
}
```

### 2. Pelayan (Church Staff)
```typescript
interface Pelayan {
  id: string;
  nama: string;                    // Referensi dari Jemaat
  jabatan: string;                 // 11 tipe jabatan
  departemen: string;              // 7 departemen
  status: 'Aktif' | 'Tidak Aktif';
}
```

### 3. Keuangan (Finance)
```typescript
interface Keuangan {
  id: string;
  jenis: 'masuk' | 'keluar';
  kategori: string;                // 7 kategori
  jumlah: number;                  // Harus > 0
  deskripsi: string;
  tanggal: string;                 // Format: YYYY-MM-DD
}
```

### 4. Inventaris (Inventory)
```typescript
interface Inventaris {
  id: string;
  nama: string;
  kategori: string;                // 6 kategori
  jumlah: number;
  harga: number;
  tahun: number;
  kondisi: string;                 // Baik, Rusak Ringan, Rusak Berat
}
```

### 5. Keluarga (Family Card)
```typescript
interface Keluarga {
  id: string;
  noKK: string;                    // Nomor Kartu Keluarga (unik)
  kepala: string;                  // Nama dari Jemaat
  alamat: string;
  jumlah: number;                  // Jumlah anggota keluarga
}
```

### 6. Jadwal (Schedule)
```typescript
interface Jadwal {
  id: string;
  nama: string;
  tanggal: string;                 // Format: YYYY-MM-DD
  waktu: string;
  lokasi: string;
  pj: string;                      // Penanggung Jawab (dari Pelayan)
  status: string;                  // 4 status dengan warna
}
```

### 7. Absensi (Attendance)
```typescript
interface Absensi {
  id: string;
  kegiatan: string;                // Referensi dari Jadwal
  nama: string;                    // Referensi dari Jemaat
  status: string;                  // Hadir, Tidak Hadir, Izin, Sakit
  tanggal: string;
}
```

### 8. Notifikasi (Notification)
```typescript
interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  target: string;                  // Semua, Pelayan, Jemaat Aktif
  via: string;                     // WhatsApp, SMS, Email
  tanggal: string;
}
```

### 9. Settings (Configuration)
```typescript
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
  fontSize: string;                // small, normal, large
  mode: string;                    // light, dark
  waKey: string;
  smtpHost: string;
  emailFrom: string;
}
```

## 💾 Penyimpanan Data

### localStorage Keys
```javascript
STORAGE_KEYS = {
  jemaat: 'gd_jemaat',
  pelayan: 'gd_pelayan',
  keuangan: 'gd_keuangan',
  inventaris: 'gd_inventaris',
  keluarga: 'gd_keluarga',
  jadwal: 'gd_jadwal',
  absensi: 'gd_absensi',
  notifikasi: 'gd_notifikasi',
  settings: 'gd_settings',
}
```

### Seed Data
- Sistem otomatis membuat 1 data jemaat default saat pertama kali dijalankan
- Nama: "Yohanes Simanjuntak" (Pendeta)
- Untuk menambah data lebih banyak, gunakan UI atau langsung inject ke localStorage

## 🔧 API Context (AdminContext)

### Properties
```typescript
// Data
const { jemaat, pelayan, keuangan, inventaris, keluarga, jadwal, absensi, notifikasi, settings, currentPage } = useAdmin();
```

### Methods - Jemaat
```typescript
const { addJemaat, updateJemaat, deleteJemaat } = useAdmin();

// Add
addJemaat({ nama: 'John', gender: 'Pria', ... });

// Update
updateJemaat(id, { nama: 'John Updated', ... });

// Delete
deleteJemaat(id);
```

### Methods - Pelayan
```typescript
const { addPelayan, updatePelayan, deletePelayan } = useAdmin();
```

### Methods - Keuangan
```typescript
const { addKeuangan, updateKeuangan, deleteKeuangan } = useAdmin();
```

### Methods - Inventaris
```typescript
const { addInventaris, updateInventaris, deleteInventaris } = useAdmin();
```

### Methods - Keluarga
```typescript
const { addKeluarga, updateKeluarga, deleteKeluarga } = useAdmin();
```

### Methods - Jadwal
```typescript
const { addJadwal, updateJadwal, deleteJadwal } = useAdmin();
```

### Methods - Absensi
```typescript
const { addAbsensi, deleteAbsensi } = useAdmin();
// Note: Tidak ada updateAbsensi di halaman original
```

### Methods - Notifikasi
```typescript
const { addNotifikasi, deleteNotifikasi } = useAdmin();
// Note: Tidak ada updateNotifikasi
```

### Navigation
```typescript
const { setCurrentPage } = useAdmin();
setCurrentPage('dashboard'); // Ganti halaman
setCurrentPage('jemaat');
setCurrentPage('keuangan');
// etc...
```

## 🧩 Komponen

### AdminLayout
**File**: `components/AdminLayout.tsx`
**Fungsi**: Main wrapper dengan sidebar dan header
**Props**: `children: React.ReactNode`
**Dependency**: `useAdmin`, Sidebar, Header

### Sidebar
**File**: `components/Sidebar.tsx`
**Fungsi**: Navigasi dengan 11 menu item
**Menu Items**:
- Menu Utama: Dashboard
- Operasional: Jemaat, Keluarga, Pelayan, Keuangan, Inventaris, Jadwal, Absensi
- Komunikasi: Notifikasi, Dokumen, Pengaturan
**Fitur**: Active state, responsive mobile toggle
**Dependency**: `useAdmin`

### Header
**File**: `components/Header.tsx`
**Fungsi**: Top bar dengan date, title, export
**Fitur**:
- Real-time date update (every 60 seconds)
- Current page title mapping
- Export button (placeholder)
- Menu toggle button
**Dependency**: `useEffect`

### Modal
**File**: `components/Modal.tsx`
**Fungsi**: Reusable form dialog untuk semua pages
**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onClose: () => void;
  isLoading?: boolean;
}
```
**Digunakan di**: 7+ halaman untuk form CRUD

## 📄 Halaman-Halaman

### 1. Dashboard
**File**: `pages/Dashboard.tsx`
- 6 stat cards (Jemaat, Pelayan, Masuk, Keluar, Saldo, Inventaris)
- Recent jadwal table (5 item terbaru)
- Chart placeholders untuk Chart.js
**Dependencies**: `useAdmin`, `useEffect`, `useState`

### 2. DataJemaat
**File**: `pages/DataJemaat.tsx`
- Search by nama & alamat
- Modal form dengan 10 fields
- Validation: nama required
**CRUD**: ✅ Full (Create, Read, Update, Delete)

### 3. KartuKeluarga
**File**: `pages/KartuKeluarga.tsx`
- 4 fields form (noKK, kepala, alamat, jumlah)
- Kepala dropdown dari jemaat list
- Validation: noKK required
**CRUD**: ✅ Full

### 4. PelayanGereja
**File**: `pages/PelayanGereja.tsx`
- Sorting otomatis by jabatan (11 tipe)
- Dropdown untuk nama (jemaat), jabatan (11 tipe), departemen (7)
- Status selection (Aktif/Tidak Aktif)
**CRUD**: ✅ Full
**Sorting**: ✅ Automatic by hierarchical order

### 5. Keuangan
**File**: `pages/Keuangan.tsx`
- 4 stat cards (Masuk, Keluar, Saldo, Count)
- Filter dropdown (semua, masuk, keluar)
- Color-coded table (green/red by jenis)
- 7 kategori untuk dropdown
**CRUD**: ✅ Full
**Statistics**: ✅ Real-time calculation

### 6. Inventaris
**File**: `pages/Inventaris.tsx`
- 6 fields (nama, kategori, jumlah, harga, tahun, kondisi)
- 6 kategori, 3 kondisi options
- Table with edit/delete
**CRUD**: ✅ Full

### 7. Jadwal
**File**: `pages/Jadwal.tsx`
- Auto-sorted by tanggal
- 4 status options dengan color mapping
- PJ dropdown from pelayan
- Status color constants
**CRUD**: ✅ Full
**Sorting**: ✅ Automatic by date

### 8. Absensi
**File**: `pages/Absensi.tsx`
- Kegiatan & Nama dropdowns (jadwal, jemaat)
- 4 status options (Hadir, Tidak Hadir, Izin, Sakit)
- Delete-only (sesuai original design)
- Color-coded status badges
**CRUD**: ❌ Add & Delete only (no Update)

### 9. Notifikasi
**File**: `pages/Notifikasi.tsx`
- Judul & pesan fields (required)
- Target selection (Semua, Pelayan, Jemaat Aktif)
- Via selection (WhatsApp, SMS, Email)
- Toast alert simulation
**CRUD**: ❌ Add & Delete only

### 10. Dokumen
**File**: `pages/Dokumen.tsx`
- Laporan Keuangan (Pemasukan, Pengeluaran, Saldo)
- Statistik Jemaat (Total, Aktif, Pria, Wanita)
- Window.print() integration
**Features**: ✅ Report generation, ✅ Print support

### 11. Pengaturan
**File**: `pages/Pengaturan.tsx`
- 6 tabs: Profil, Akun, Database, Notifikasi, Tampilan, Integrasi
- Tab-based navigation dengan active styling
- Church profile form (8 fields)
- Notification preferences (3 checkboxes)
- Database management placeholders
- API integration fields
**Dependencies**: `useState`, `useEffect`

## 🎨 Styling & UI

### Color Scheme
```
Primary:    #1e3a5f (Dark Blue)
Secondary:  #2c5282 (Medium Blue)
Accent:     #e8c547 (Gold)
Dark:       #0f1a2e (Very Dark)
Success:    #10b981 (Green)
Danger:     #ef4444 (Red)
Warning:    #f59e0b (Orange)
```

### Framework
- **Tailwind CSS**: Utility-first styling
- **Font Awesome**: Icon library (fa-solid fa-*)
- **Responsive Design**: Mobile-first, breakpoints: sm, md, lg, xl

### Responsive Breakpoints
```
Mobile: < 768px     (sm breakpoint)
Tablet: 768-1024px  (md breakpoint)
Desktop: > 1024px   (lg breakpoint)
```

## 🚀 Panduan Instalasi

### Prerequisites
- Node.js >= 16
- npm atau yarn
- Git

### Setup
```bash
# 1. Clone repository
git clone https://github.com/MoonX388/Gereja.git
cd gereja/frontend

# 2. Install dependencies
npm install

# 3. Create .env.local (if needed)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# 4. Run development server
npm run dev

# 5. Akses aplikasi
# Buka http://localhost:3000/admin di browser
```

### Environment Setup
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## 💻 Penggunaan

### Basic Usage
```typescript
// Import useAdmin hook
import { useAdmin } from '@/app/admin/context/AdminContext';

// Gunakan di component
export default function MyComponent() {
  const { jemaat, addJemaat, currentPage, setCurrentPage } = useAdmin();
  
  const handleAddJemaat = () => {
    addJemaat({
      nama: 'John Doe',
      gender: 'Pria',
      baptis: 'Sudah',
      tempatLahir: 'Jakarta',
      tglLahir: '1990-01-01',
      alamat: 'Jl. Merdeka 1',
      telp: '08123456789',
      nikah: 'Menikah',
      pekerjaan: 'Guru',
      status: 'Aktif'
    });
  };

  return (
    <div>
      <button onClick={handleAddJemaat}>Tambah Jemaat</button>
      <p>Total Jemaat: {jemaat.length}</p>
    </div>
  );
}
```

### Navigation
```typescript
const { setCurrentPage } = useAdmin();

// Switch pages
setCurrentPage('dashboard');
setCurrentPage('jemaat');
setCurrentPage('keuangan');
// ... etc
```

### Form Modal Pattern
```typescript
import Modal from '@/app/admin/components/Modal';
import { useState } from 'react';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function MyForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { addJemaat } = useAdmin();
  const [formData, setFormData] = useState({});

  const handleSave = () => {
    addJemaat(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add New</button>
      <Modal
        isOpen={isOpen}
        title="Add Jemaat"
        onSave={handleSave}
        onClose={() => setIsOpen(false)}
      >
        {/* Form fields */}
      </Modal>
    </>
  );
}
```

## 🔧 Development

### Project Structure Best Practices
1. **Context First**: Letakkan semua state logic di AdminContext
2. **Reusable Components**: Gunakan Modal, Header, Sidebar di multiple pages
3. **TypeScript**: Selalu gunakan interfaces dan types
4. **localStorage**: Automatic save setiap operasi
5. **Validation**: Implement di form level dan context level

### Adding New Features
1. Add interface ke `AdminContext.tsx`
2. Add state dan methods di AdminProvider
3. Update localStorage keys
4. Create page component di `pages/`
5. Add menu item di `Sidebar.tsx`
6. Add route case di `page.tsx`

### Common Tasks

#### Add New Data Entity
```typescript
// 1. Add interface di AdminContext.tsx
interface NewEntity {
  id: string;
  name: string;
  // ... fields
}

// 2. Add to AdminContextType
newEntity: NewEntity[];
addNewEntity: (item: Omit<NewEntity, 'id'>) => void;
// ... update, delete methods

// 3. Add storage key
const STORAGE_KEYS = {
  // ...
  newEntity: 'gd_newEntity',
};

// 4. Add state & methods di AdminProvider
const [newEntity, setNewEntity] = useState<NewEntity[]>([]);

const addNewEntity = (item: Omit<NewEntity, 'id'>) => {
  const newItem = { ...item, id: generateId() };
  setNewEntity([...newEntity, newItem]);
  saveData(STORAGE_KEYS.newEntity, [...newEntity, newItem]);
};

// 5. Export ke context value
// ... di AdminContextType value object
```

#### Add New Page
```typescript
// 1. Create file pages/NewPage.tsx
'use client';
import { useAdmin } from '../context/AdminContext';
import Modal from '../components/Modal';
import { useState } from 'react';

export default function NewPage() {
  const { newEntity, addNewEntity } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <h1>New Page Title</h1>
      {/* Page content */}
    </div>
  );
}

// 2. Import & add route di page.tsx
import NewPage from './pages/NewPage';

case 'newpage':
  return <NewPage />;

// 3. Add menu item di Sidebar.tsx
// ... dalam menu array
```

### Testing
```bash
# Run development server
npm run dev

# Test in browser
# - Verify all pages load
# - Test CRUD operations
# - Check localStorage persistence
# - Validate form validations
# - Test responsiveness on mobile
```

### Debugging
- **DevTools**: Chrome DevTools -> Application -> localStorage
- **React DevTools**: Inspect component hierarchy
- **Console**: Check for errors dan warnings

## 🌐 Deployment

### Build for Production
```bash
# Build
npm run build

# Test production build
npm run start

# Verify build size
npm run build -- --analyze  # if analyzer installed
```

### Environment Setup
```env
# Production .env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t gereja-admin .

# Run container
docker run -p 3000:3000 gereja-admin
```

## 📊 Data Export & Backup

### Export localStorage
```javascript
// Copy all data
const backup = {
  jemaat: JSON.parse(localStorage.getItem('gd_jemaat')),
  pelayan: JSON.parse(localStorage.getItem('gd_pelayan')),
  keuangan: JSON.parse(localStorage.getItem('gd_keuangan')),
  // ... all entities
};

// Download as JSON
const dataStr = JSON.stringify(backup);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = `backup-${Date.now()}.json`;
link.click();
```

### Import Data
```javascript
// Paste JSON into console
const backup = { /* pasted JSON */ };
Object.entries(backup).forEach(([key, value]) => {
  localStorage.setItem('gd_' + key, JSON.stringify(value));
});
```

## 🚀 Next Steps & Enhancement

### Priority 1 (High Value)
- [ ] Backend API integration (replace localStorage)
- [ ] User authentication & authorization
- [ ] Data export to CSV/Excel
- [ ] PDF report generation

### Priority 2 (Medium Value)
- [ ] Chart.js integration (Dashboard charts)
- [ ] Email notification integration
- [ ] WhatsApp API integration
- [ ] SMS gateway integration
- [ ] Image upload for jemaat photos

### Priority 3 (Enhancement)
- [ ] Dark mode implementation
- [ ] Multi-language support (ID/EN)
- [ ] Advanced search & filters
- [ ] Batch operations (import/export)
- [ ] Audit logs & activity tracking
- [ ] Role-based access control (RBAC)
- [ ] Two-factor authentication (2FA)

## 📞 Support & Contribution

### Issues & Bug Reports
Silakan buat issue di GitHub dengan detail:
- Deskripsi masalah
- Steps to reproduce
- Expected vs actual behavior
- Screenshot jika ada

### Kontribusi
1. Fork repository
2. Buat feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push branch: `git push origin feature/YourFeature`
5. Buat Pull Request

## 📜 License

MIT License - Lihat file LICENSE untuk detail

## 👨‍💻 Author

**Gereja Digital Admin Team**
- GitHub: [@MoonX388](https://github.com/MoonX388)
- Organization: Gereja Digital Initiative

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready

---

## Quick Reference

### File Locations
- Context: `app/admin/context/AdminContext.tsx`
- Components: `app/admin/components/`
- Pages: `app/admin/pages/`
- Styles: Tailwind CSS (config: `tailwind.config.ts`)
- Auth: `lib/auth-context.tsx`

### Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Key npm Scripts (in package.json)
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Important Notes
- ⚠️ Development mode bypasses authentication
- 💾 All data stored in browser localStorage (not persistent across browsers)
- 📱 Responsive design tested on mobile (320px), tablet (768px), desktop (1024px+)
- 🔒 Production mode requires proper authentication setup
- 🗄️ Consider backend database for production use

---

**Happy Building! 🎉**
