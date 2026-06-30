'use client';

import { useState } from 'react';
import { useAdmin, Jemaat } from '../context/AdminContext';
import Modal from '../components/Modal';
import { useToast } from '@/app/components/ToastContext';

export default function DataJemaat() {
  const { showToast } = useToast();
  const { jemaat, addJemaat, updateJemaat, deleteJemaat } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Update formData state untuk mendukung Tempat & Tanggal Baptis serta Sidi
  const [formData, setFormData] = useState<any>({
    nama: '',
    gender: 'Pria',
    tempatLahir: '',
    tglLahir: '',
    tempatBaptis: '',
    tglBaptis: '',
    tempatSidi: '',
    tglSidi: '',
    alamat: '',
    telepon: '',
    nikah: 'Belum Menikah',
    pekerjaan: '',
    status: 'Aktif',
  });

  const filteredJemaat = jemaat.filter(
    (j) =>
      j.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        nama: item.nama || '',
        gender: item.gender || 'Pria',
        tempatLahir: item.tempatLahir || '',
        tglLahir: item.tglLahir || '',
        tempatBaptis: item.tempatBaptis || '',
        tglBaptis: item.tglBaptis || '',
        tempatSidi: item.tempatSidi || '',
        tglSidi: item.tglSidi || '',
        alamat: item.alamat || '',
        telepon: item.telepon || '',
        nikah: item.nikah || 'Belum Menikah',
        pekerjaan: item.pekerjaan || '',
        status: item.status || 'Aktif',
      });
    } else {
      setEditingId(null);
      setFormData({
        nama: '',
        gender: 'Pria',
        tempatLahir: '',
        tglLahir: '',
        tempatBaptis: '',
        tglBaptis: '',
        tempatSidi: '',
        tglSidi: '',
        alamat: '',
        telepon: '',
        nikah: 'Belum Menikah',
        pekerjaan: '',
        status: 'Aktif',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama.trim()) {
      // Panggil notifikasi error
      showToast('Nama wajib diisi!', 'error'); 
      return;
    }
    
    if (editingId) {
  updateJemaat(Number(editingId), formData); // Pastikan dibungkus Number() agar aman
  showToast('Data jemaat berhasil diperbarui!', 'success');
} else {
      addJemaat(formData);
      showToast('Jemaat baru berhasil ditambahkan!', 'success');
    }
    
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-users mr-2"></i>
            Data Jemaat
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-48"
            />
            <button
  onClick={() => handleOpenModal()}
  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
  title="Tambah"
>
  <i className="fa-solid fa-plus"></i>
  <span className="hidden sm:inline ml-1">Tambah</span>
</button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          {filteredJemaat.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Gender</th>
                  <th>Lahir</th>
                  <th>Baptis</th>
                  <th>Sidi</th>
                  <th>Alamat</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredJemaat.map((item: any) => (
                  <tr key={item.id}>
                    <td className="font-semibold">{item.nama}</td>
                    <td>{item.gender}</td>
                    <td>{item.tempatLahir ? `${item.tempatLahir}, ` : ''}{item.tglLahir || '-'}</td>
                    
                    {/* Menampilkan Data Baptis */}
                    <td>{item.tempatBaptis ? `${item.tempatBaptis}, ` : ''}{item.tglBaptis || '-'}</td>
                    
                    {/* Menampilkan Data Sidi */}
                    <td>{item.tempatSidi ? `${item.tempatSidi}, ` : ''}{item.tglSidi || '-'}</td>
                    
                    <td className="text-xs">{item.alamat || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
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
                          if (confirm('Hapus?')) deleteJemaat(item.id);
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
              <i className="fa-solid fa-users-slash text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada data jemaat</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Jemaat' : 'Tambah Jemaat'}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Jenis Kelamin</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Pria</option>
              <option>Wanita</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.tglLahir}
                onChange={(e) => setFormData({ ...formData, tglLahir: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Form Input Tempat & Tanggal Baptis */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Tempat Baptis</label>
              <input
                type="text"
                value={formData.tempatBaptis}
                placeholder="Kosongkan jika belum"
                onChange={(e) => setFormData({ ...formData, tempatBaptis: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tanggal Baptis</label>
              <input
                type="date"
                value={formData.tglBaptis}
                onChange={(e) => setFormData({ ...formData, tglBaptis: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Form Input Tempat & Tanggal Sidi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Tempat Sidi</label>
              <input
                type="text"
                value={formData.tempatSidi}
                placeholder="Kosongkan jika belum"
                onChange={(e) => setFormData({ ...formData, tempatSidi: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tanggal Sidi</label>
              <input
                type="date"
                value={formData.tglSidi}
                onChange={(e) => setFormData({ ...formData, tglSidi: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Alamat</label>
            <textarea
              rows={2}
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">No. Telepon</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Status Pernikahan</label>
              <select
                value={formData.nikah}
                onChange={(e) => setFormData({ ...formData, nikah: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option>Belum Menikah</option>
                <option>Menikah</option>
                <option>Duda/Janda</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Pekerjaan</label>
            <input
              type="text"
              value={formData.pekerjaan}
              onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Status Keaktifan</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Aktif</option>
              <option>Pasif</option>
              <option>Pindah</option>
              <option>Meninggal</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}