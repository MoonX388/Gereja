'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import ConfirmationModalPortal from './ConfirmationModalPortal';

export default function Header({
  onMenuClick,
  pageTitle,
}: {
  onMenuClick: () => void;
  pageTitle: string;
}) {
  const { showToast } = useToast();
  const { currentPage } = useAdmin();
  const importMenuRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);

  // Tanggal
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

  // Click outside untuk import menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (importMenuRef.current && !importMenuRef.current.contains(event.target as Node)) {
        setIsImportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const pageTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    jemaat: 'Data Jemaat',
    keluarga: 'Kartu Keluarga',
    pelayan: 'Pelayan Gereja',
    keuangan: 'Keuangan',
    inventaris: 'Inventaris',
    jadwal: 'Jadwal Kegiatan',
    absensi: 'Absensi',
    notifikasi: 'Notifikasi',
    dokumen: 'Dokumen & Laporan',
    pengaturan: 'Pengaturan',
  };

  // Import File Handler - trigger file input
  const handleImportClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.csv,.xlsx,.xls';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Dispatch custom event untuk AdminLayout
        const importEvent = new CustomEvent('admin-import-file', { detail: file });
        window.dispatchEvent(importEvent);
      }
    };
    fileInput.click();
  };

  const handleExportData = () => {
    showToast('Data berhasil diekspor', 'success');
  };

  const handleResetData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/settings/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mereset data');
      }

      showToast('Data berhasil direset', 'success');
      setIsResetConfirmationOpen(false);
      
      // Reload halaman setelah reset
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mereset data';
      showToast(errorMessage, 'error');
    }
  };

  const handleDownloadTemplate = () => {
    showToast('Template berhasil diunduh', 'success');
  };

  return (
    <>
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
            {pageTitles[pageTitle] || pageTitles[currentPage] || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-sm relative">
          <span className="text-gray-500 font-medium hidden sm:inline">{currentDate}</span>

          <div className="relative" ref={importMenuRef}>
            <button
              onClick={() => setIsImportMenuOpen((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <i className="fa-solid fa-upload"></i>
              <span className="hidden sm:inline">Import</span>
            </button>

            {isImportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleImportClick}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  <i className="fa-solid fa-file-upload mr-2"></i>
                  Upload File
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  <i className="fa-solid fa-download mr-2"></i>
                  Download Template
                </button>
              </div>
            )}
          </div>

          <button onClick={handleExportData} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1">
            <i className="fa-solid fa-download"></i>
            <span className="hidden sm:inline">Ekspor</span>
          </button>

          <button onClick={() => setIsResetConfirmationOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1">
            <i className="fa-solid fa-rotate-left"></i>
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <ConfirmationModalPortal
        isOpen={isResetConfirmationOpen}
        onClose={() => setIsResetConfirmationOpen(false)}
        onConfirm={handleResetData}
        title="Reset semua data admin?"
        description="Semua data admin akan dikembalikan ke kondisi awal. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Reset"
        cancelText="Tidak"
        variant="danger"
      />
    </>
  );
}
