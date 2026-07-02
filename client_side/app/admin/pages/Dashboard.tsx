'use client';

import { useAdmin } from '../context/AdminContext';
import { useMemo } from 'react';

// 1. Import komponen Chart.js dan React Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// 2. Registrasi elemen yang dibutuhkan Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

export default function Dashboard() {
  const { jemaat, pelayan, jadwal, inventaris, keuangan } = useAdmin();
  const saldo = useMemo(
    () => keuangan.reduce((total, item) => total + (item.jenis === 'masuk' ? item.jumlah : -item.jumlah), 0),
    [keuangan]
  );

  const stats = [
    { label: 'Jemaat', value: jemaat.length, icon: 'fa-users', color: 'bg-blue-100 text-blue-700' },
    { label: 'Pelayan', value: pelayan.length, icon: 'fa-user-tie', color: 'bg-green-100 text-green-700' },
    {
      label: 'Jadwal',
      value: jadwal.filter((j) => j.status === 'Terjadwal' || j.status === 'Berlangsung').length,
      icon: 'fa-calendar-check',
      color: 'bg-amber-100 text-amber-700',
    },
    { label: 'Saldo', value: `Rp ${saldo.toLocaleString('id-ID')}`, icon: 'fa-coins', color: 'bg-purple-100 text-purple-700', isLarge: true },
    { label: 'Inventaris', value: inventaris.length, icon: 'fa-box-archive', color: 'bg-red-100 text-red-500' },
    { label: 'Transaksi', value: keuangan.length, icon: 'fa-chart-line', color: 'bg-indigo-100 text-indigo-700' },
  ];

  // ==========================================
  // LOGIKA GRAFIK KEUANGAN
  // ==========================================
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
  const masuk = new Array(6).fill(0);
  const keluar = new Array(6).fill(0);

  keuangan.forEach((i) => {
    const m = new Date(i.tanggal).getMonth();
    if (m >= 0 && m < 6) {
      if (i.jenis === 'masuk') masuk[m] += i.jumlah;
      else keluar[m] += i.jumlah;
    }
  });

  const dataKeuangan = {
    labels: months,
    datasets: [
      { label: 'Masuk', data: masuk, backgroundColor: '#4caf84', borderRadius: 6 },
      { label: 'Keluar', data: keluar, backgroundColor: '#e0556a', borderRadius: 6 }
    ]
  };

  // ==========================================
  // LOGIKA DISTRIBUSI JEMAAT
  // ==========================================
  const pria = jemaat.filter((i) => i.gender === 'Pria').length;
  const wanita = jemaat.filter((i) => i.gender === 'Wanita').length;

  const dataJemaat = {
    labels: ['Pria', 'Wanita'],
    datasets: [
      {
        data: [pria, wanita],
        backgroundColor: ['#2c5282', '#e8c547'],
      }
    ]
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div className={stat.isLarge ? 'min-w-0 flex-1' : ''}>
              <h3 className={`font-bold truncate ${stat.isLarge ? 'text-lg md:text-xl' : 'text-lg md:text-xl'}`}>
                {stat.value}
              </h3>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Area Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart Keuangan */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5">
          <h3 className="text-lg font-bold text-[#0f1a2e] mb-4">
            <i className="fa-solid fa-chart-line mr-2 text-[#e8c547]"></i>
            Grafik Keuangan 6 Bulan
          </h3>
          
          {/* Cek apakah ada data keuangan */}
          {keuangan.length > 0 ? (
            <div className="relative h-72 w-full">
              <Bar 
                data={dataKeuangan} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { legend: { position: 'bottom' } } 
                }} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <i className="fa-solid fa-chart-line text-5xl mb-3 opacity-50"></i>
              <p className="text-lg">Belum ada data keuangan</p>
            </div>
          )}
        </div>

        {/* Chart Jemaat */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5">
          <h3 className="text-lg font-bold text-[#0f1a2e] mb-4">
            <i className="fa-solid fa-chart-pie mr-2 text-[#e8c547]"></i>
            Distribusi Jemaat
          </h3>

          {/* Cek apakah ada data jemaat */}
          {jemaat.length > 0 ? (
            <div className="relative h-72 w-full">
              <Doughnut 
                data={dataJemaat} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { legend: { position: 'bottom' } } 
                }} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              {/* Ikon kembali disesuaikan menggunakan ikon jemaat kosong (users-slash) */}
              <i className="fa-solid fa-users-slash text-5xl mb-3 opacity-50 block"></i>
              <p className="text-lg">Belum ada data jemaat</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Jadwal */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-calendar-day mr-2"></i>
            Jadwal Terbaru
          </h3>
        </div>
        <div className="p-4 overflow-x-auto">
          {jadwal.slice(0, 5).length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Kegiatan</th>
                  <th className="px-4 py-2 text-left">Lokasi</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-2 font-semibold">{item.nama}</td>
                    <td className="px-4 py-2">{item.lokasi || '-'}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5 text-gray-400">
              <i className="fa-solid fa-calendar-xmark text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada jadwal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}