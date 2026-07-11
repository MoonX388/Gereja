'use client';

import { useState } from 'react';
import { useAdmin, Inventaris as InventarisType } from '../context/AdminContext';
import { useToast } from '@/app/components/ToastContext';
import Modal from '../components/Modal';

export default function Inventaris() {
  const { showToast } = useToast();
  const { inventaris, addInventaris, updateInventaris, deleteInventaris } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Peralatan Ibadah',
    jumlah: 1,
    harga: 0,
    tahun: new Date().getFullYear(),
    kondisi: 'Baik',
  });

  const handleOpenModal = (item?: InventarisType) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({
        nama: '',
        kategori: 'Peralatan Ibadah',
        jumlah: 1,
        harga: 0,
        tahun: new Date().getFullYear(),
        kondisi: 'Baik',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama.trim()) {
      showToast('Nama wajib diisi', 'error');
      return;
    }
    if (editingId !== null) {
      updateInventaris(editingId, formData);
      showToast('Inventaris berhasil diperbarui!', 'success');
    } else {
      addInventaris(formData);
      showToast('Inventaris baru berhasil ditambahkan!', 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-box-archive mr-2"></i>
            Inventaris
          </h3>
          <button
  onClick={() => handleOpenModal()}
  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
  title="Tambah Inventaris"
>
  <i className="fa-solid fa-plus"></i>
  <span className="hidden sm:inline ml-1">Tambah</span>
</button>
        </div>
        <div className="p-4 overflow-x-auto">
          {inventaris.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Tahun</th>
                  <th>Kondisi</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {inventaris.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold">{item.nama}</td>
                    <td>{item.kategori}</td>
                    <td>{item.jumlah}</td>
                    <td>Rp {item.harga.toLocaleString('id-ID')}</td>
                    <td>{item.tahun}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.kondisi === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.kondisi}
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
                        onClick={async () => {
                          if (confirm('Hapus?')) {
                            await deleteInventaris(item.id);
                            showToast('Inventaris berhasil dihapus!', 'success');
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
              <i className="fa-solid fa-box-open text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada inventaris</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Inventaris' : 'Tambah Inventaris'}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Barang</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option>Peralatan Ibadah</option><option>Elektronik</option><option>Furniture</option>
                <option>Kendaraan</option><option>Tanah/Bangunan</option><option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Harga Satuan (Rp)</label>
              <input
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) || 0 })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tahun</label>
              <input
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={formData.tahun}
                onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Kondisi</label>
            <select
              value={formData.kondisi}
              onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            >
              <option>Baik</option><option>Rusak Ringan</option><option>Rusak Berat</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
