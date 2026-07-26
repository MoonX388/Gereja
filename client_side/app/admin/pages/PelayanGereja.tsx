'use client';

import { useState } from 'react';
import { useAdmin, Pelayan as PelayanType } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ComfirmationModal';

// 📊 URUTAN JABATAN BARU: Ketua Majelis nomor 1, Penatua/Diakon/Staf Administrasi setara
const JABATAN_ORDER = {
  'Ketua Majelis': 1,
  'Pendeta': 2,
  'Sekretaris': 3,
  'Bendahara': 4,
  'Penatua': 5,
  'Diakon': 5,
  'Staf Administrasi': 5,
  'Staf Kebersihan': 6,
  'Pengurus Pemuda': 7,
  'Pengurus Sekolah Minggu': 8,
  'Lainnya': 9
};

export default function PelayanGereja() {
  const { showToast } = useToast();
  const { pelayan, jemaat, addPelayan, updatePelayan, deletePelayan } = useAdmin();
  
  // State Kontrol Modal Formulir Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // State Kontrol Modal Hapus Pemusnahan Data
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
  const [targetDeleteNama, setTargetDeleteNama] = useState('');

  const [formData, setFormData] = useState({
    nama: '',
    jabatan: 'Ketua Majelis', // Mengubah default value awal ke Ketua Majelis
    departemen: 'Umum',
    status: 'Aktif',
  });

  // Melakukan pengurutan list berdasarkan bobot index JABATAN_ORDER
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
      setFormData({ nama: '', jabatan: 'Ketua Majelis', departemen: 'Umum', status: 'Aktif' });
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

  // Pemicu awal sebelum membuka popup hapus data pelayan
  const triggerDeleteConfirmation = (id: number, nama: string) => {
    setTargetDeleteId(id);
    setTargetDeleteNama(nama);
    setIsDeleteModalOpen(true);
  };

  // Aksi eksekusi pemusnahan data dari context/database
  const handleExecuteDelete = async () => {
    if (targetDeleteId === null) return;
    try {
      await deletePelayan(targetDeleteId);
      showToast('Pelayan berhasil dihapus!', 'success');
    } catch {
      showToast('Gagal menghapus data pelayan', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setTargetDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e] flex items-center">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-2.5">
              <i className="fa-solid fa-user-tie"></i>
            </span>
            Pelayan Gereja (Urut Struktur Otoritas)
          </h3>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 shadow-sm"
          >
            <i className="fa-solid fa-plus text-xs"></i> Tambah Pelayan
          </button>
        </div>
        
        <div className="p-4 overflow-x-auto">
          {sortedPelayan.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr className="bg-gray-50/70 text-gray-500 font-medium text-left">
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Jabatan Struktural</th>
                  <th className="py-3 px-4">Lingkup Bidang / Departemen</th>
                  <th className="py-3 px-4">Status Keaktifan</th>
                  <th className="py-3 px-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPelayan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="font-semibold py-3.5 px-4 text-gray-900">{item.nama}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.jabatan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{item.departemen}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === 'Aktif' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-600'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center space-x-1">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                        title="Ubah Data"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirmation(item.id, item.nama)}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="Hapus Pelayan"
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
              <i className="fa-solid fa-user-tie text-5xl mb-3 block text-gray-200"></i>
              <p className="text-base font-medium">Belum ada struktur staf pelayan terdaftar</p>
            </div>
          )}
        </div>
      </div>

      {/* FORM MODAL: ADD / EDIT PELAYAN */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Pelayan Struktural' : 'Tambah Pelayan Struktural'}
        onSave={handleSave}
      >
        <div className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Jemaat</label>
            <select
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Hubungkan dengan Nama Jemaat --</option>
              {jemaat.map((j) => (
                <option key={j.id} value={j.nama}>{j.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Jabatan Otoritas</label>
            <select
              value={formData.jabatan}
              onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Ketua Majelis</option>
              <option>Pendeta</option>
              <option>Sekretaris</option>
              <option>Bendahara</option>
              <option>Penatua</option>
              <option>Diakon</option>
              <option>Staf Administrasi</option>
              <option>Staf Kebersihan</option>
              <option>Pengurus Pemuda</option>
              <option>Pengurus Sekolah Minggu</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Penempatan Departemen</label>
            <select
              value={formData.departemen}
              onChange={(e) => setFormData({ ...formData, departemen: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Umum</option>
              <option>Ibadah</option>
              <option>Pemuda</option>
              <option>Sekolah Minggu</option>
              <option>Diakonia</option>
              <option>Keuangan</option>
              <option>Administrasi</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status Penugasan</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Aktif</option>
              <option>Tidak Aktif</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* 🚀 CONFIRMATION POPUP MODAL (YES OR NO DANGER VARIANT) */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleExecuteDelete}
        variant="danger"
        title="Hapus Pelayan Struktural"
        description={`Apakah Anda yakin ingin memberhentikan ${targetDeleteNama} dari jabatan struktural pelayanan gereja? Tindakan ini akan menghapus alokasi akun operasionalnya dari sistem.`}
        confirmText="Ya, Hapus Jabatan"
        cancelText="Batal"
      />
    </div>
  );
}