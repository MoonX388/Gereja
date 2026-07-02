'use client';

import { useAdmin } from './context/AdminContext';
import Dashboard from './pages/Dashboard';
import DataJemaat from './pages/DataJemaat';
import KartuKeluarga from './pages/KartuKeluarga';
import PelayanGereja from './pages/PelayanGereja';
import Keuangan from './pages/Keuangan';
import Inventaris from './pages/Inventaris';
import Jadwal from './pages/Jadwal';
import Notifikasi from './pages/Notifikasi';
import Dokumen from './pages/Dokumen';
import Pengaturan from './pages/Pengaturan';

export default function AdminPage() {
  const { currentPage } = useAdmin();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'jemaat':
        return <DataJemaat />;
      case 'keluarga':
        return <KartuKeluarga />;
      case 'pelayan':
        return <PelayanGereja />;
      case 'keuangan':
        return <Keuangan />;
      case 'inventaris':
        return <Inventaris />;
      case 'jadwal':
        return <Jadwal />;
      /*case 'absensi':
        return <Absensi />;*/
      case 'notifikasi':
        return <Notifikasi />;
      case 'dokumen':
        return <Dokumen />;
      case 'pengaturan':
        return <Pengaturan />;
      default:
        return <Dashboard />;
    }
  };

  return renderPage();
}
