'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentPage, jemaat, pelayan, keuangan, inventaris, keluarga, jadwal, absensi, notifikasi, settings, importData } = useAdmin();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [isImporting, setIsImporting] = useState(false);

  // Listen for custom import event from Header
  useEffect(() => {
    const handleImportEvent = (e: CustomEvent) => {
      const file = e.detail as File;
      if (file) {
        handleImportFile(file);
      }
    };

    window.addEventListener('admin-import-file', handleImportEvent as EventListener);
    return () => {
      window.removeEventListener('admin-import-file', handleImportEvent as EventListener);
    };
  }, []);

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

  const [currentDate, setCurrentDate] = useState('');

  // Drag and Drop Handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const isJson = file.name.toLowerCase().endsWith('.json');
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const isExcel = /\.(xlsx|xls)$/i.test(file.name);

    if (!isJson && !isCsv && !isExcel) {
      showToast('Format file harus JSON, CSV, atau Excel.', 'error');
      return;
    }

    await handleImportFile(file);
  };

  // Import File Handler - menggunakan SSE untuk progress real-time
  const handleImportFile = async (file: File) => {
    setIsImporting(true);
    setImportProgress({ current: 0, total: 0, percent: 0 });
    showToast('Mulai mengimpor data...', 'info');

    const token = localStorage.getItem('token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/jemaat/bulk-import-sse`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengimpor data');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body tidak tersedia');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'start') {
                setImportProgress({ current: 0, total: data.total, percent: 0 });
              } else if (data.type === 'progress') {
                setImportProgress({ current: data.current, total: data.total, percent: data.percent });
              } else if (data.type === 'complete') {
                setImportProgress(prev => ({ ...prev, percent: 100 }));
                showToast('Import selesai!', 'success');
                setTimeout(() => window.location.reload(), 1500);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengimpor data';
      showToast(errorMessage, 'error');
    } finally {
      setIsImporting(false);
      setTimeout(() => {
        setImportProgress({ current: 0, total: 0, percent: 0 });
      }, 3000);
    }
  };

  return (
    <div 
      className={`bg-[#f7f8fa] font-sans antialiased min-h-screen ${isDragOver ? 'bg-blue-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Progress Bar Overlay */}
      {isImporting && (
        <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white py-2 px-4 z-50 flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${importProgress.percent}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1">
              Mengimpor: {importProgress.current}/{importProgress.total} ({importProgress.percent}%)
            </p>
          </div>
          <span className="text-sm animate-pulse">Sedang memproses...</span>
        </div>
      )}

      {/* Drag Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-blue-500/20 z-40 flex items-center justify-center border-4 border-dashed border-blue-500 pointer-events-none">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <i className="fa-solid fa-cloud-upload-alt text-6xl text-blue-500 mb-4"></i>
            <p className="text-xl font-semibold text-gray-700">Drop file Excel/CSV/JSON di sini</p>
            <p className="text-gray-500 mt-2">Data akan diimpor ke {currentPage}</p>
          </div>
        </div>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div id="sidebar-overlay" 
        className={`fixed inset-0 bg-black/40 z-40 ${sidebarOpen ? '' : 'hidden'} lg:hidden`}
        onClick={() => setSidebarOpen(false)} 
      />

      <div className="lg:ml-64 transition-all duration-300 min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} pageTitle={currentPage} />
        <main className="p-4 md:p-5 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
