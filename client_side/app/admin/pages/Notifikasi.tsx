'use client';

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Modal from '../components/Modal';

export default function Notifikasi() {
  const { showToast } = useToast();
  const { notifikasi, addNotifikasi, deleteNotifikasi } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    pesan: '',
    target: 'Semua Jemaat',
    via: 'WhatsApp',
    tanggal: new Date().toISOString(),
  });

  const handleOpenModal = () => {
    setFormData({ judul: '', pesan: '', target: 'Semua Jemaat', via: 'WhatsApp', tanggal: new Date().toISOString() });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.judul.trim()) {
      showToast('Judul wajib diisi', 'error');
      return;
    }
    addNotifikasi(formData);
    showToast('Notifikasi terkirim (simulasi)', 'success');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-bell mr-2"></i>
            Notifikasi
          </h3>
          <button
  onClick={handleOpenModal}
  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
  title="Kirim Notifikasi"
>
  <i className="fa-solid fa-plus"></i>
  <span className="hidden sm:inline ml-1">Kirim</span>
</button>
        </div>
        <div className="p-4 overflow-x-auto">
          {notifikasi.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Judul</th>
                  <th>Target</th>
                  <th>Via</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {notifikasi.map((item) => (
                  <tr key={item.id}>
                    <td>{item.tanggal}</td>
                    <td className="font-semibold">{item.judul}</td>
                    <td>{item.target}</td>
                    <td>{item.via}</td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={async () => {
                          if (confirm('Hapus?')) {
                            await deleteNotifikasi(item.id);
                            showToast('Notifikasi berhasil dihapus!', 'success');
                          }
                        }}
                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <i className="fa-solid fa-bell-slash text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada notifikasi</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Kirim Notifikasi"
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Judul</label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Pesan</label>
            <textarea
              rows={3}
              value={formData.pesan}
              onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Target</label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option>Semua Jemaat</option><option>Pelayan</option><option>Jemaat Aktif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Via</label>
              <select
                value={formData.via}
                onChange={(e) => setFormData({ ...formData, via: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option>WhatsApp</option><option>SMS</option><option>Email</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
