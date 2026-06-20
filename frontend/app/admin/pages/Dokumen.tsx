'use client';

import { useAdmin } from '../context/AdminContext';

export default function Dokumen() {
  const { jemaat, keuangan } = useAdmin();

  const generateReport = () => {
    let masuk = 0, keluar = 0;
    keuangan.forEach((item) => {
      masuk += item.jenis === 'masuk' ? item.jumlah : 0;
      keluar += item.jenis === 'keluar' ? item.jumlah : 0;
    });

    const reportData = {
      keuangan: {
        pemasukan: `Rp ${masuk.toLocaleString('id-ID')}`,
        pengeluaran: `Rp ${keluar.toLocaleString('id-ID')}`,
        saldo: `Rp ${(masuk - keluar).toLocaleString('id-ID')}`,
      },
      jemaat: {
        total: jemaat.length,
        aktif: jemaat.filter((j) => j.status === 'Aktif').length,
        pria: jemaat.filter((j) => j.gender === 'Pria').length,
        wanita: jemaat.filter((j) => j.gender === 'Wanita').length,
      },
    };

    return reportData;
  };

  const report = generateReport();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#0f1a2e]">
            <i className="fa-solid fa-file-alt mr-2"></i>
            Dokumen & Laporan
          </h3>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-bold mb-3">Laporan Keuangan</h4>
            <div className="space-y-2 text-sm mb-4">
              <p>
                <span className="font-semibold">Pemasukan:</span> {report.keuangan.pemasukan}
              </p>
              <p>
                <span className="font-semibold">Pengeluaran:</span> {report.keuangan.pengeluaran}
              </p>
              <p>
                <span className="font-semibold">Saldo:</span> {report.keuangan.saldo}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <i className="fa-solid fa-print mr-1"></i> Cetak
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-bold mb-3">Statistik Jemaat</h4>
            <div className="space-y-2 text-sm mb-4">
              <p>
                <span className="font-semibold">Total:</span> {report.jemaat.total} orang
              </p>
              <p>
                <span className="font-semibold">Aktif:</span> {report.jemaat.aktif} orang
              </p>
              <p>
                <span className="font-semibold">Pria:</span> {report.jemaat.pria} orang
              </p>
              <p>
                <span className="font-semibold">Wanita:</span> {report.jemaat.wanita} orang
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <i className="fa-solid fa-print mr-1"></i> Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
