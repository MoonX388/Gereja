'use client';

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Modal from '../components/Modal';

export default function Absensi() {
  const { showToast } = useToast();
  const { absensi, jadwal, jemaat, addAbsensi, deleteAbsensi } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kegiatan: '',
    nama: '',
    status: 'Hadir',
    tanggal: new Date().toISOString().split('T')[0],
  });

  const handleOpenModal = () => {
    setFormData({
      kegiatan: '',
      nama: '',
      status: 'Hadir',
      tanggal: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.kegiatan || !formData.nama) {
      showToast('Lengkapi data absensi', 'error');
      return;
    }
    addAbsensi(formData);
    showToast('Absensi berhasil dicatat!', 'success');
    setIsModalOpen(false);
  };

  const statusColor = {
    'Hadir': 'bg-green-100 text-green-700',
    'Tidak Hadir': 'bg-red-100 text-red-600',
    'Izin': 'bg-amber-100 text-amber-700',
    'Sakit': 'bg-purple-100 text-purple-700',
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-clipboard-check mr-2"></i>
            Absensi
          </h3>
          <button
  onClick={handleOpenModal}
  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
  title="Catat Absensi"
>
  <i className="fa-solid fa-plus"></i>
  <span className="hidden sm:inline ml-1">Catat Absensi</span>
</button>
        </div>
        <div className="p-4 overflow-x-auto">
          {absensi.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kegiatan</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {absensi.map((item) => (
                  <tr key={item.id}>
                    <td>{item.tanggal}</td>
                    <td>{item.kegiatan}</td>
                    <td>{item.nama}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[item.status as keyof typeof statusColor] || ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={async () => {
                          if (confirm('Hapus?')) {
                            await deleteAbsensi(item.id);
                            showToast('Catatan absensi berhasil dihapus!', 'success');
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
              <i className="fa-solid fa-clipboard text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada catatan absensi</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Absensi"
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kegiatan</label>
            <select
              value={formData.kegiatan}
              onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">-- Pilih --</option>
              {jadwal.map((j) => (
                <option key={j.id} value={j.nama}>{j.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Jemaat</label>
            <select
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">-- Pilih --</option>
              {jemaat.map((j) => (
                <option key={j.id} value={j.nama}>{j.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Hadir</option><option>Tidak Hadir</option><option>Izin</option><option>Sakit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tanggal</label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
