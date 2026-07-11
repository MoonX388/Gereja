'use client';

import { useState } from 'react';
import { useAdmin, Pelayan as PelayanType } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Modal from '../components/Modal';

const JABATAN_ORDER = {
  'Pendeta': 1, 'Diakon': 2, 'Penatua': 3, 'Ketua Majelis': 4, 'Bendahara': 5,
  'Sekretaris': 6, 'Staf Administrasi': 7, 'Staf Kebersihan': 8,
  'Pengurus Pemuda': 9, 'Pengurus Sekolah Minggu': 10, 'Lainnya': 11
};

export default function PelayanGereja() {
  const { showToast } = useToast();
  const { pelayan, jemaat, addPelayan, updatePelayan, deletePelayan } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: 'Pendeta',
    departemen: 'Umum',
    status: 'Aktif',
  });

  const sortedPelayan = [...pelayan].sort((a, b) => 
    (JABATAN_ORDER[a.jabatan as keyof typeof JABATAN_ORDER] || 99) - 
    (JABATAN_ORDER[b.jabatan as keyof typeof JABATAN_ORDER] || 99)
  );

  const handleOpenModal = (item?: PelayanType) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ nama: item.nama, jabatan: item.jabatan, departemen: item.departemen, status: item.status });
    } else {
      setEditingId(null);
      setFormData({ nama: '', jabatan: 'Pendeta', departemen: 'Umum', status: 'Aktif' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama) {
      showToast('Nama wajib dipilih', 'error');
      return;
    }
    if (editingId !== null) {
      updatePelayan(editingId, formData);
      showToast('Data pelayan berhasil diperbarui!', 'success');
    } else {
      addPelayan(formData);
      showToast('Pelayan baru berhasil ditambahkan!', 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-user-tie mr-2"></i>
            Pelayan Gereja (Urut Jabatan)
          </h3>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <i className="fa-solid fa-plus mr-1"></i> Tambah
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          {sortedPelayan.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Departemen</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedPelayan.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold">{item.nama}</td>
                    <td><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{item.jabatan}</span></td>
                    <td>{item.departemen}</td>
                    <td><span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span></td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Hapus?')) {
                            await deletePelayan(item.id);
                            showToast('Pelayan berhasil dihapus!', 'success');
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
              <i className="fa-solid fa-user-tie text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada pelayan</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Pelayan' : 'Tambah Pelayan'}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama</label>
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
            <label className="block text-sm font-semibold mb-1">Jabatan</label>
            <select
              value={formData.jabatan}
              onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Pendeta</option><option>Diakon</option><option>Penatua</option>
              <option>Ketua Majelis</option><option>Bendahara</option><option>Sekretaris</option>
              <option>Staf Administrasi</option><option>Staf Kebersihan</option>
              <option>Pengurus Pemuda</option><option>Pengurus Sekolah Minggu</option><option>Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Departemen</label>
            <select
              value={formData.departemen}
              onChange={(e) => setFormData({ ...formData, departemen: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Umum</option><option>Ibadah</option><option>Pemuda</option>
              <option>Sekolah Minggu</option><option>Diakonia</option><option>Keuangan</option><option>Administrasi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Aktif</option><option>Tidak Aktif</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
