// app/admin/data/dummyData.ts

export const dummyJemaat = [
  {
    id: 1,
    nama: "Maya Wijaya",
    gender: "Wanita", // <-- Ubah dari Perempuan menjadi Wanita
    tempatLahir: "Bandung",
    tglLahir: "1995-08-15",
    tempatBaptis: "Gereja Pusat Bandung",
    tglBaptis: "2010-04-04",
    tempatSidi: "Gereja Pusat Bandung",
    tglSidi: "2013-12-25",
    alamat: "Jl. Merdeka No. 12, Jakarta",
    telepon: "081234567890",
    nikah: "Belum Menikah",
    pekerjaan: "Karyawan Swasta",
    status: "aktif"
  },
  {
    id: 2,
    nama: "Budi Santoso",
    gender: "Pria", // <-- Ubah dari Laki-laki menjadi Pria
    tempatLahir: "Semarang",
    tglLahir: "1988-03-22",
    tempatBaptis: "Gereja Immanuel Semarang",
    tglBaptis: "1988-06-12",
    tempatSidi: "Gereja Immanuel Semarang",
    tglSidi: "2005-10-30",
    alamat: "Jl. Mawar Raya No. 45, Bekasi",
    telepon: "085712345678",
    nikah: "Menikah",
    pekerjaan: "Wiraswasta",
    status: "aktif"
  }
];

export const dummyKeuangan = [
  {
    id: 1,
    jenis: "masuk", // KUNCI GRAFIK: Wajib 'masuk' huruf kecil sesuai interface!
    kategori: "Kolekte",
    jumlah: 8500000,
    deskripsi: "Kolekte Umum Minggu 1",
    tanggal: "2026-07-05"
  },
  {
    id: 2,
    jenis: "masuk",
    kategori: "Persepuluhan",
    jumlah: 3000000,
    deskripsi: "Persepuluhan Jemaat NN",
    tanggal: "2026-07-06"
  },
  {
    id: 3,
    jenis: "keluar", // KUNCI GRAFIK: Wajib 'keluar' huruf kecil!
    kategori: "Operasional",
    jumlah: 2450000,
    deskripsi: "Bayar Listrik Gedung",
    tanggal: "2026-07-07"
  },
  {
    id: 4,
    jenis: "keluar",
    kategori: "Inventaris",
    jumlah: 1800000,
    deskripsi: "Beli Mic Wireless Baru",
    tanggal: "2026-07-09"
  }
];

export const dummyKeluarga = [
  {
    id: 1,
    noKK: "3171012345670001",
    kepala: "Budi Santoso",
    alamat: "Jl. Mawar Raya No. 45, Bekasi",
    jumlah: 4
  },
  {
    id: 2,
    noKK: "3171019876540002",
    kepala: "Ahmad Ibrahim",
    alamat: "Apartemen Kalibata City, Jakarta",
    jumlah: 3
  }
];

export const dummyAbsensi = [
  { id: 1, kegiatan: "Ibadah Raya 1", nama: "Maya Wijaya", status: "Hadir", tanggal: "2026-07-05" },
  { id: 2, kegiatan: "Ibadah Raya 2", nama: "Budi Santoso", status: "Hadir", tanggal: "2026-07-05" }
];

export const dummyInventaris = [
  { id: 1, nama: "Sound System Utama", kategori: "Elektronik", jumlah: 1, harga: 15000000, tahun: 2024, kondisi: "Baik" },
  { id: 2, nama: "Laptop Operator", kategori: "Elektronik", jumlah: 2, harga: 8500000, tahun: 2025, kondisi: "Baik" }
];

// Ganti bagian dummyJadwal kamu dengan kata 'Terjadwal'
export const dummyJadwal = [
  { 
    id: 1, 
    nama: "Ibadah Minggu Raya 1", 
    tanggal: "2026-07-12", 
    waktu: "09:00", 
    lokasi: "Ruang Utama", 
    pj: "Pdt. Yohanes M.Th", 
    status: "Terjadwal" // <-- Ubah dari 'aktif' menjadi 'Terjadwal'
  },
  { 
    id: 2, 
    nama: "Pendalaman Alkitab", 
    tanggal: "2026-07-15", 
    waktu: "19:00", 
    lokasi: "Ruang Konseling", 
    pj: "Pnt. Budi Santoso", 
    status: "Terjadwal" // <-- Ubah dari 'aktif' menjadi 'Terjadwal'
  }
];


export const dummyPelayan = [
  { id: 1, nama: "Pdt. Yohanes M.Th", jabatan: "Pendeta Utama", departemen: "Penggembalaan", status: "aktif" },
  { id: 2, nama: "Pnt. Budi Santoso", jabatan: "Penatua", departemen: "Seksi Ibadah", status: "aktif" }
];

export const dummyNotifikasi = [
  { id: 1, judul: "Stok Kritis", pesan: "Kursi aula serbaguna berkurang.", target: "Logistik", via: "Dashboard", tanggal: "2026-07-10" }
];

export const dummySettings = {
  namaGereja: "Gereja Pintar Immanuel",
  kodeGereja: "GPI-001",
  alamat: "Jl. Protokol No. 100, Jakarta",
  telp: "021-5551234",
  email: "info@gerejapintar.id",
  website: "www.gerejapintar.id",
  username: "admin",
  password: "admin123",
  notifWA: true,
  notifSMS: false,
  notifEmail: true,
  fontSize: "normal",
  mode: "light",
  waKey: "key_demo",
  smtpHost: "smtp.mail.com",
  emailFrom: "no-reply@gerejapintar.id"
};