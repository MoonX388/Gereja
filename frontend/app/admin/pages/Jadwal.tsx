'use client';

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Modal from '../components/Modal';

export default function Jadwal() {
  const { jadwal, pelayan, addJadwal, updateJadwal, deleteJadwal } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    pj: '',
    status: 'Terjadwal',
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ nama: '', tanggal: '', waktu: '', lokasi: '', pj: '', status: 'Terjadwal' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama.trim() || !formData.tanggal) {
      alert('Nama dan tanggal wajib');
      return;
    }
    if (editingId) {
      updateJadwal(editingId, formData);
    } else {
      addJadwal(formData);
    }
    setIsModalOpen(false);
  };

  const statusColor = {
    'Terjadwal': 'bg-amber-100 text-amber-700',
    'Berlangsung': 'bg-blue-100 text-blue-700',
    'Selesai': 'bg-green-100 text-green-700',
    'Dibatalkan': 'bg-red-100 text-red-600',
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-calendar-days mr-2"></i>
            Jadwal Kegiatan
          </h3>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <i className="fa-solid fa-plus mr-1"></i> Tambah
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          {jadwal.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Waktu</th>
                  <th>Kegiatan</th>
                  <th>Lokasi</th>
                  <th>PJ</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>{item.waktu || '-'}</td>
                    <td>{item.nama}</td>
                    <td>{item.lokasi || '-'}</td>
                    <td>{item.pj || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[item.status as keyof typeof statusColor] || ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus?')) deleteJadwal(item.id);
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
              <i className="fa-solid fa-calendar-xmark text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada jadwal</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Kegiatan</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Tanggal</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Waktu</label>
              <input
                type="time"
                value={formData.waktu}
                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Lokasi</label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Penanggung Jawab</label>
            <select
              value={formData.pj}
              onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">-- Pilih --</option>
              {pelayan.map((p) => (
                <option key={p.id} value={p.nama}>{p.nama} ({p.jabatan})</option>
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
              <option>Terjadwal</option><option>Berlangsung</option><option>Selesai</option><option>Dibatalkan</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
