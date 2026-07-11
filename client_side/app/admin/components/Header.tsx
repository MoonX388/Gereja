'use client';

import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';

export default function Header({
  onMenuClick,
  pageTitle,
}: {
  onMenuClick: () => void;
  pageTitle: string;
}) {
  const { showToast } = useToast();
  const { currentPage, jemaat, pelayan, keuangan, inventaris, keluarga, jadwal, absensi, notifikasi, settings, importData } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMenuRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (importMenuRef.current && !importMenuRef.current.contains(event.target as Node)) {
        setIsImportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isJson = file.name.toLowerCase().endsWith('.json');
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const isExcel = /\.(xlsx|xls)$/i.test(file.name);

    if (!isJson && !isCsv && !isExcel) {
      showToast('Format file harus JSON, CSV, atau Excel.', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (isJson) {
          const parsed = JSON.parse(reader.result as string);
          if (parsed && typeof parsed === 'object') {
            importData(parsed);
            showToast('Data berhasil diimpor!', 'success');
          } else {
            throw new Error('Format file tidak valid');
          }
        } else {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

          if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error('File kosong');
          }

          const importedRows = (rows as Array<Record<string, unknown>>).map((row) => {
            const record = row as Record<string, unknown>;
            return {
              id: Number(record.id) || 0,
              nama: String(record.nama || ''),
              gender: String(record.gender || 'Pria'),
              tempatLahir: String(record.tempatLahir || ''),
              tglLahir: String(record.tglLahir || ''),
              tempatBaptis: String(record.tempatBaptis || ''),
              tglBaptis: String(record.tglBaptis || ''),
              tempatSidi: String(record.tempatSidi || ''),
              tglSidi: String(record.tglSidi || ''),
              alamat: String(record.alamat || ''),
              telepon: String(record.telepon || ''),
              nikah: String(record.nikah || 'Belum Menikah'),
              pekerjaan: String(record.pekerjaan || ''),
              status: String(record.status || 'Aktif'),
            };
          });

          importData({ jemaat: importedRows });
          showToast('Data jemaat berhasil diimpor dari file spreadsheet!', 'success');
        }
      } catch {
        showToast('Format file tidak valid atau rusak.', 'error');
      } finally {
        event.target.value = '';
        setIsImportMenuOpen(false);
      }
    };

    if (isJson) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportData = () => {
    const backupData = {
      jemaat,
      pelayan,
      keuangan,
      inventaris,
      keluarga,
      jadwal,
      absensi,
      notifikasi,
      settings,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPage || 'admin'}-backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor!', 'success');
  };

  const handleResetData = () => {
    const confirmed = window.confirm('Reset semua data admin ke kondisi awal? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) return;

    importData({
      jemaat: [],
      pelayan: [],
      keuangan: [],
      inventaris: [],
      keluarga: [],
      jadwal: [],
      absensi: [],
      notifikasi: [],
      settings: {
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
      },
    });
    showToast('Data berhasil direset.', 'success');
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        nama: 'Contoh Nama',
        gender: 'Pria',
        tempatLahir: 'Jakarta',
        tglLahir: '1990-01-01',
        tempatBaptis: 'Gereja',
        tglBaptis: '2000-01-01',
        tempatSidi: 'Gereja',
        tglSidi: '2010-01-01',
        alamat: 'Jl. Contoh',
        telepon: '081234567890',
        nikah: 'Belum Menikah',
        pekerjaan: 'PNS',
        status: 'Aktif',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jemaat');
    XLSX.writeFile(workbook, 'template-jemaat.xlsx');
    showToast('Template Excel berhasil diunduh.', 'success');
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
          {pageTitles[pageTitle] || pageTitles[currentPage] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4 text-sm relative">
        {/* Tanggal - sembunyikan di mobile */}
        <span className="text-gray-500 font-medium hidden sm:inline">{currentDate}</span>

        <div className="relative" ref={importMenuRef}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv,.xlsx,.xls"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            onClick={() => setIsImportMenuOpen((prev) => !prev)}
            title="Impor Data"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
          >
            <i className="fa-solid fa-upload"></i>
            <span className="hidden sm:inline">Impor</span>
          </button>

          {isImportMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={handleImportClick}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <i className="fa-solid fa-file-arrow-up mr-2"></i>
                Unggah File
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <i className="fa-solid fa-file-excel mr-2"></i>
                Unduh Template
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleExportData}
          title="Ekspor Data"
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
        >
          <i className="fa-solid fa-download"></i>
          <span className="hidden sm:inline">Ekspor</span>
        </button>

        <button
          onClick={handleResetData}
          title="Reset Data"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
        >
          <i className="fa-solid fa-rotate-left"></i>
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}