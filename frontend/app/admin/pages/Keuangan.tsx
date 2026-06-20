'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import Modal from '../components/Modal';

export default function Keuangan() {
  const { keuangan, addKeuangan, updateKeuangan, deleteKeuangan } = useAdmin();
  const [filter, setFilter] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ masuk: 0, keluar: 0, saldo: 0 });
  const [formData, setFormData] = useState({
    jenis: 'masuk' as 'masuk' | 'keluar',
    kategori: 'Persembahan',
    jumlah: 0,
    deskripsi: '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    let masuk = 0, keluar = 0;
    keuangan.forEach((item) => {
      if (item.jenis === 'masuk') masuk += item.jumlah;
      else keluar += item.jumlah;
    });
    setStats({ masuk, keluar, saldo: masuk - keluar });
  }, [keuangan]);

  const filteredKeuangan = filter === 'semua' ? keuangan : keuangan.filter((k) => k.jenis === filter);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ jenis: item.jenis, kategori: item.kategori, jumlah: item.jumlah, deskripsi: item.deskripsi, tanggal: item.tanggal });
    } else {
      setEditingId(null);
      setFormData({ jenis: 'masuk', kategori: 'Persembahan', jumlah: 0, deskripsi: '', tanggal: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (formData.jumlah <= 0) {
      alert('Jumlah harus > 0');
      return;
    }
    if (editingId) {
      updateKeuangan(editingId, formData);
    } else {
      addKeuangan(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <i className="fa-solid fa-arrow-down"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold">Rp {stats.masuk.toLocaleString('id-ID')}</h3>
            <p className="text-xs text-gray-500">Pemasukan</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <i className="fa-solid fa-arrow-up"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold">Rp {stats.keluar.toLocaleString('id-ID')}</h3>
            <p className="text-xs text-gray-500">Pengeluaran</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold truncate">Rp {stats.saldo.toLocaleString('id-ID')}</h3>
            <p className="text-xs text-gray-500">Saldo</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-3 md:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold">{keuangan.length}</h3>
            <p className="text-xs text-gray-500">Transaksi</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-coins mr-2"></i>
            Catatan Keuangan
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="semua">Semua</option>
              <option value="masuk">Pemasukan</option>
              <option value="keluar">Pengeluaran</option>
            </select>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#e8c547] hover:bg-yellow-600 text-[#0f1a2e] px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
            >
              <i className="fa-solid fa-plus mr-1"></i> Tambah
            </button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          {filteredKeuangan.length > 0 ? (
            <table className="w-full text-sm modern-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Deskripsi</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeuangan.map((item) => (
                  <tr key={item.id}>
                    <td>{item.tanggal}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.jenis === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        <i className={`fa-solid fa-arrow-${item.jenis === 'masuk' ? 'down' : 'up'} mr-1`}></i>
                        {item.jenis === 'masuk' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td>{item.kategori}</td>
                    <td className={`font-bold ${item.jenis === 'masuk' ? 'text-green-700' : 'text-red-600'}`}>
                      Rp {item.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="text-xs">{item.deskripsi || '-'}</td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus?')) deleteKeuangan(item.id);
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
              <i className="fa-solid fa-receipt text-5xl mb-3 block"></i>
              <p className="text-lg">Belum ada transaksi</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Jenis</label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value as 'masuk' | 'keluar' })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="masuk">Pemasukan</option>
                <option value="keluar">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option>Persembahan</option><option>Donasi</option><option>Operasional</option>
                <option>Acara/Kegiatan</option><option>Renovasi</option><option>Gaji Pegawai</option><option>Lainnya</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              min="0"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 0 })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
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
          <div>
            <label className="block text-sm font-semibold mb-1">Deskripsi</label>
            <textarea
              rows={2}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
