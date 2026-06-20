'use client';

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Modal from '../components/Modal';

export default function KartuKeluarga() {
  const { keluarga, jemaat, addKeluarga, updateKeluarga, deleteKeluarga } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    noKK: '',
    kepala: '',
    alamat: '',
    jumlah: 1,
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ noKK: item.noKK, kepala: item.kepala, alamat: item.alamat, jumlah: item.jumlah });
    } else {
      setEditingId(null);
      setFormData({ noKK: '', kepala: '', alamat: '', jumlah: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.noKK.trim()) {
      alert('No. KK wajib diisi');
      return;
    }
    if (editingId) {
      updateKeluarga(editingId, formData);
    } else {
      addKeluarga(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-house-chimney mr-2"></i>
            Kartu Keluarga
          </h3>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <i className="fa-solid fa-plus mr-1"></i> Tambah KK
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          {keluarga.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>No. KK</th>
                  <th>Kepala Keluarga</th>
                  <th>Alamat</th>
                  <th>Jumlah</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {keluarga.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono font-semibold">{item.noKK}</td>
                    <td>{item.kepala || '-'}</td>
                    <td className="text-xs">{item.alamat || '-'}</td>
                    <td>{item.jumlah} orang</td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus?')) deleteKeluarga(item.id);
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
              <i className="fa-solid fa-house-circle-xmark text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada kartu keluarga</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit KK' : 'Tambah KK'}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">No. KK</label>
            <input
              type="text"
              value={formData.noKK}
              onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Kepala Keluarga</label>
            <select
              value={formData.kepala}
              onChange={(e) => setFormData({ ...formData, kepala: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">-- Pilih --</option>
              {jemaat.map((j) => (
                <option key={j.id} value={j.nama}>{j.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Alamat</label>
            <textarea
              rows={2}
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Jumlah Anggota</label>
            <input
              type="number"
              min="1"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
