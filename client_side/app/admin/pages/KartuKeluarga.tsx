'use client';

import { useState } from 'react';
import { useAdmin, Keluarga as KeluargaType } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Modal from '../components/Modal';
import ConfirmationModalPortal from '../components/ConfirmationModalPortal';

export default function KartuKeluarga() {
  const { showToast } = useToast();
  const { keluarga, jemaat, addKeluarga, updateKeluarga, deleteKeluarga } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    noKK: '',
    kepala: '',
    alamat: '',
    jumlah: 1,
    anggota: [] as string[],
  });

  const handleToggleAnggota = (nama: string) => {
    setFormData(prev => ({
      ...prev,
      anggota: prev.anggota.includes(nama)
        ? prev.anggota.filter(a => a !== nama)
        : [...prev.anggota, nama]
    }));
  };

  const handleOpenModal = (item?: KeluargaType) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        noKK: item.noKK,
        kepala: item.kepala,
        alamat: item.alamat,
        jumlah: item.jumlah,
        anggota: item.anggota?.map((a: any) => a.nama || a.nama_lengkap) || []
      });
    } else {
      setEditingId(null);
      setFormData({ noKK: '', kepala: '', alamat: '', jumlah: 1, anggota: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.noKK.trim()) {
      showToast('No. KK wajib diisi', 'error');
      return;
    }
    try {
      if (editingId !== null) {
        await updateKeluarga(editingId, formData);
        showToast('Kartu keluarga berhasil diperbarui!', 'success');
      } else {
        await addKeluarga(formData);
        showToast('Kartu keluarga berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.message || 'Gagal menyimpan data keluarga';
      showToast(errorMessage, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteKeluarga(pendingDeleteId);
    showToast('Kartu keluarga berhasil dihapus!', 'success');
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
            <table className="w-full text-sm modern-table responsive-table">
              <thead>
                <tr>
                  <th>No. KK</th>
                  <th>Kepala Keluarga</th>
                  <th>Alamat</th>
                  <th>Anggota</th>
                  <th>Jumlah</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {keluarga.map((item) => (
                  <tr key={item.id}>
                    <td data-label="No. KK" className="font-mono font-semibold">{item.noKK}</td>
                    <td data-label="Kepala Keluarga">{item.kepala || '-'}</td>
                    <td data-label="Alamat" className="text-xs">{item.alamat || '-'}</td>
                    <td data-label="Anggota" className="text-xs">
                      {item.anggota && item.anggota.length > 0
                        ? item.anggota.map((a: any, idx: number) => (
                            <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1 mb-1">
                              {a.nama || a.nama_lengkap}
                            </span>
                          ))
                        : <span className="text-gray-400">Belum ada anggota</span>
                      }
                    </td>
                    <td data-label="Jumlah">{item.jumlah} orang</td>
                    <td data-label="Aksi" className="text-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(item.id)}
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
              {jemaat.map((j: any) => (
                <option key={j.id} value={j.nama || j.nama_lengkap}>{j.nama || j.nama_lengkap}</option>
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
          <div>
            <label className="block text-sm font-semibold mb-1">Anggota Keluarga</label>
            <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
              {jemaat.length > 0 ? (
                jemaat.map((j: any) => (
                  <label key={j.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={formData.anggota.includes(j.nama || j.nama_lengkap)}
                      onChange={() => handleToggleAnggota(j.nama || j.nama_lengkap)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{j.nama || j.nama_lengkap}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-400">Belum ada data jemaat</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{formData.anggota.length} anggota dipilih</p>
          </div>
        </div>
      </Modal>
      <ConfirmationModalPortal
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus kartu keluarga?"
        description="Data kartu keluarga yang dihapus tidak dapat dipulihkan."
        confirmText="Ya, Hapus"
        cancelText="Tidak"
        variant="danger"
      />
    </div>
  );
}
