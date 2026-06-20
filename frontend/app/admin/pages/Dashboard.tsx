'use client';

import { useAdmin } from '../context/AdminContext';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { jemaat, pelayan, jadwal, inventaris, keuangan } = useAdmin();
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    let total = 0;
    keuangan.forEach((item) => {
      total += item.jenis === 'masuk' ? item.jumlah : -item.jumlah;
    });
    setSaldo(total);
  }, [keuangan]);

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

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5">
          <h3 className="text-lg font-bold text-[#0f1a2e] mb-4">
            <i className="fa-solid fa-chart-line mr-2 text-[#e8c547]"></i>
            Grafik Keuangan 6 Bulan
          </h3>
          <div className="h-72 flex items-center justify-center text-gray-400">
            <p>Chart visualization placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5">
          <h3 className="text-lg font-bold text-[#0f1a2e] mb-4">
            <i className="fa-solid fa-chart-pie mr-2 text-[#e8c547]"></i>
            Distribusi Jemaat
          </h3>
          <div className="h-72 flex items-center justify-center text-gray-400">
            <p>Chart visualization placeholder</p>
          </div>
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
            <div className="text-center py-8 text-gray-400">Belum ada jadwal</div>
          )}
        </div>
      </div>
    </div>
  );
}
