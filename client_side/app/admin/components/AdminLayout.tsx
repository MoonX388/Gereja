'use client';

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentPage } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#f7f8fa] font-sans antialiased">
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
