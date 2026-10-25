'use client';

import { useAdmin } from '../context/AdminContext';
import { Sparkles } from '../../components/motion/Sparkles';

const groups = [
  { title: 'Menu Utama', items: [
    { label: 'Dashboard', icon: 'fa-chart-pie', page: 'dashboard' },
    { label: 'Data Jemaat', icon: 'fa-users', page: 'jemaat' },
    { label: 'Kartu Keluarga', icon: 'fa-house-chimney', page: 'keluarga' },
    { label: 'Pelayan Gereja', icon: 'fa-user-tie', page: 'pelayan' },
  ] },
  { title: 'Operasional', items: [
    { label: 'Keuangan', icon: 'fa-coins', page: 'keuangan' },
    { label: 'Inventaris', icon: 'fa-box-archive', page: 'inventaris' },
    { label: 'Jadwal', icon: 'fa-calendar-days', page: 'jadwal' },
    { label: 'Absensi', icon: 'fa-clipboard-check', page: 'absensi' },
  ] },
  { title: 'Komunikasi', items: [
    { label: 'Notifikasi', icon: 'fa-bell', page: 'notifikasi' },
    { label: 'Dokumen', icon: 'fa-file-alt', page: 'dokumen' },
    { label: 'Pengaturan', icon: 'fa-gear', page: 'pengaturan' },
    { label: 'Akses User', icon: 'fa-user-shield', page: 'akses-user' },
  ] },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentPage, setCurrentPage, settings } = useAdmin();

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-[#0f1a2e] to-[#1e3a5f] text-white shadow-2xl transition-transform duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="relative overflow-hidden p-5 border-b border-white/10 text-center flex-shrink-0">
        <Sparkles count={5} />
        <i className="fa-solid fa-church text-4xl mb-1 text-[#e8c547] drop-shadow-[0_0_14px_rgba(232,197,71,0.55)]"></i>
        <h2 className="relative text-lg font-bold tracking-wide">Gereja Pintar</h2>
        <p className="relative text-xs opacity-70">{settings.namaGereja}</p>
      </div>

      <nav className="sidebar-menu px-3 py-4 space-y-1 overflow-y-auto flex-1">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="text-[0.65rem] uppercase tracking-widest opacity-50 px-3 pt-4 pb-2 font-semibold">
              {group.title}
            </div>
            {group.items.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    onClose();
                  }}
                  className={`nav-item gp-shine w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    active
                      ? 'bg-white/15 text-white border-l-3 border-[#e8c547] shadow-[inset_0_0_24px_rgba(232,197,71,0.14)] gp-shine-loop'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-6 text-center ${active ? 'text-[#e8c547]' : ''}`}></i>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
