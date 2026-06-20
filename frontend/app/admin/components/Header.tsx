'use client';

import { useEffect, useState } from 'react';

export default function Header({
  onMenuClick,
  pageTitle,
}: {
  onMenuClick: () => void;
  pageTitle: string;
}) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(
        new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const pageTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    jemaat: 'Data Jemaat',
    keluarga: 'Kartu Keluarga',
    pelayan: 'Pelayan Gereja',
    keuangan: 'Manajemen Keuangan',
    inventaris: 'Inventaris',
    jadwal: 'Jadwal Kegiatan',
    absensi: 'Absensi',
    notifikasi: 'Notifikasi',
    dokumen: 'Dokumen & Laporan',
    pengaturan: 'Pengaturan',
  };

  const exportData = () => {
    // TODO: Implement export functionality
    alert('Export functionality coming soon');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 px-4 md:px-5 py-3 flex justify-between items-center flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <button
          id="menu-toggle"
          className="lg:hidden text-[#0f1a2e] text-2xl"
          onClick={onMenuClick}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <h1 className="text-xl font-bold text-[#0f1a2e] truncate">
          {pageTitles[pageTitle] || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4 text-sm">
        <span className="text-gray-500 font-medium hidden sm:inline">{currentDate}</span>
        <button
          onClick={exportData}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
        >
          <i className="fa-solid fa-download mr-1"></i> Ekspor
        </button>
      </div>
    </header>
  );
}
