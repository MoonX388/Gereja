"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/app/components/ToastContext";
import QRCode from "react-qr-code";
import ConfirmationModalPortal from "../components/ConfirmationModalPortal";

export default function Pengaturan() {
  const { settings, updateSettings } = useAdmin();
  const { user } = useAuth(); 
  const { showToast } = useToast();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profil");
  const [confirmationAction, setConfirmationAction] = useState<"logout" | "reset" | null>(null);
  const [draftSettings, setDraftSettings] = useState<Partial<typeof settings>>({});
  const localSettings = { ...settings, ...draftSettings };

  // State untuk bot WhatsApp
  const [waToken, setWaToken] = useState("");
  const [botPhone, setBotPhone] = useState("");
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState("");
  const [loginMethod, setLoginMethod] = useState<"pairing" | "qr">("pairing");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // Ambil token WA
  useEffect(() => {
    if (activeTab === "integrasi") {
      const fetchToken = async () => {
        try {
          const res = await api.get("/wa/token");
          if (!res.data?.token) throw new Error("Token bot tidak tersedia.");
          setWaToken(res.data.token);
          setBotStatus("Token bot berhasil dimuat.");
        } catch (error) {
          console.error("Gagal mengambil token:", error);
          const typedError = error as { response?: { data?: { message?: string } }; message?: string };
          const message = typedError.response?.data?.message || typedError.message || "Gagal terhubung ke backend.";
          setBotStatus(message);
          showToast(message, "error");
        }
      };
      fetchToken();
    }
  }, [activeTab, showToast]);

  // Polling QR
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    if (activeTab === "integrasi" && loginMethod === "qr") {
      const fetchQr = async () => {
        try {
          const res = await api.get("/wa/qr");
          if (cancelled) return;
          setQrCodeData(res.data?.qr || null);
          const messages: Record<string, string> = {
            connected: "WhatsApp sudah terhubung.",
            qr: "Pindai QR menggunakan WhatsApp.",
            connecting: "Menunggu QR dari server...",
            reconnecting: "Menyambungkan ulang ke WhatsApp...",
            disconnected: "Sesi terputus. Menunggu sesi baru...",
          };
          setBotStatus(res.data?.error || messages[res.data?.status] || "Status koneksi tidak diketahui.");
        } catch (error) {
          console.error("Error mengambil QR:", error);
          if (cancelled) return;
          setQrCodeData(null);
          const typedError = error as { response?: { data?: { message?: string } }; message?: string };
          setBotStatus(typedError.response?.data?.message || typedError.message || "Gagal mengambil QR WhatsApp.");
        }
      };

      fetchQr();
      interval = setInterval(fetchQr, 5000);
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [activeTab, loginMethod]);

  const handleSave = async (data: Partial<typeof settings>) => {
    const settingsData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !['username', 'password', 'waKey'].includes(key)),
    ) as Partial<typeof settings>;
    try {
      await updateSettings(settingsData);
      showToast("Pengaturan disimpan", "success");
    } catch (error: unknown) {
      const typedError = error as { response?: { data?: { message?: string } }; message?: string };
      showToast(typedError.response?.data?.message || typedError.message || "Gagal menyimpan pengaturan", "error");
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const payload: Record<string, string> = { username: localSettings.username };
      if (newPassword.trim()) {
        payload.password = newPassword;
      }
      if (!user?.id) {
        showToast('User tidak ditemukan, silakan login ulang', 'error');
        return;
      }
      await api.put(`/users/${user.id}`, payload);
      showToast('Akun berhasil diperbarui!', 'success');
      setDraftSettings((prev) => ({ ...prev, username: payload.username || prev.username }));
      setNewPassword('');
      await api.get('/auth/profile');
    } catch (error: unknown) {
      const typedError = error as { response?: { data?: { message?: string } } };
      showToast(typedError.response?.data?.message || 'Gagal update akun', 'error');
    }
  };

  const handleLogout = () => {
    setConfirmationAction("logout");
  };

  const handleConfirmAction = () => {
    if (confirmationAction === "logout") {
      localStorage.removeItem("token");
      router.push("/login");
    }

    if (confirmationAction === "reset") {
      localStorage.clear();
      window.location.reload();
    }
  };

  const requestPairingCode = async () => {
    if (!botPhone.match(/^62\d{8,14}$/)) {
      showToast("Nomor tidak valid. Gunakan format 62xxx (contoh: 6281234567890)", "error");
      return;
    }
    setBotStatus("Meminta kode pairing...");
    setPairingCode(null);

    try {
      const res = await api.post("/wa/request-pairing-code", {
        phoneNumber: botPhone,
        token: waToken,
      });
      setPairingCode(res.data.code);
      setBotStatus("Masukkan kode ini di WhatsApp perangkat tertaut Anda:");
      showToast("Kode pairing berhasil diminta", "success");
    } catch (error) {
      console.error("Error Pairing:", error);
      const typedError = error as { response?: { data?: { message?: string } }; message?: string };
      const message = typedError.response?.data?.message || typedError.message || "Gagal mendapatkan kode pairing.";
      setBotStatus(message);
      showToast(message, "error");
    }
  };

  return (
    <>
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* ===== TAB NAVIGASI ===== */}
      <div className="border-b border-gray-200 px-2 md:px-5 sticky top-0 z-10 bg-white">
        <nav className="flex flex-nowrap overflow-x-auto -mb-px space-x-1 md:space-x-2 min-w-max py-1 scrollbar-hide">
          {["profil", "akun", "database", "notif", "tampilan", "integrasi"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-[#1e3a5f] text-[#1e3a5f]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab === "profil" && "Profil"}
              {tab === "akun" && "Akun"}
              {tab === "database" && "Database"}
              {tab === "notif" && "Notifikasi"}
              {tab === "tampilan" && "Tampilan"}
              {tab === "integrasi" && "Integrasi"}
            </button>
          ))}
        </nav>
      </div>

      {/* ===== KONTEN ===== */}
      <div className="p-4 md:p-6">
        {/* ===== TAB PROFIL ===== */}
        {activeTab === "profil" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Profil Gereja</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              <div>
                <label className="block text-sm font-semibold mb-1">Nama Gereja</label>
                <input
                  type="text"
                  value={localSettings.namaGereja}
                  disabled 
                  className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Kode</label>
                <input
                  type="text"
                  value={localSettings.kodeGereja}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, kodeGereja: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Alamat</label>
                <textarea
                  rows={2}
                  value={localSettings.alamat}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, alamat: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Telepon</label>
                <input
                  type="text"
                  value={localSettings.telp}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, telp: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan email khusus gereja"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Website</label>
                <input
                  type="text"
                  value={localSettings.website}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, website: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              onClick={() => handleSave(localSettings)}
              className="mt-4 bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold"
            >
              <i className="fa-solid fa-save mr-1"></i> Simpan
            </button>
          </div>
        )}

        {/* ===== TAB AKUN ===== */}
        {activeTab === "akun" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Pengaturan Akun</h3>
            <div className="space-y-4 max-w-md">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Nama:</span> {user?.nama || "Tidak diketahui"}</p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Email:</span> {user?.email || "Tidak diketahui"}</p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Role:</span> {user?.role || "Tidak diketahui"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Username:</span> {user?.username || "Tidak diketahui"}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Username</label>
                <input
                  type="text"
                  value={localSettings.username || ""}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin diubah"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleUpdateAccount}
                  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  <i className="fa-solid fa-key mr-1"></i> Simpan
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  <i className="fa-solid fa-sign-out-alt mr-1"></i> Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB DATABASE ===== */}
        {activeTab === "database" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Manajemen Data</h3>
            <div className="space-y-4 max-w-lg">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold mb-2">Backup</h4>
                <button
                  onClick={() => showToast("Fitur ekspor akan segera hadir", "info")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Ekspor JSON
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold mb-2">Restore</h4>
                <input type="file" accept=".json" className="block mb-2 text-sm" />
                <button
                  onClick={() => showToast("Fitur restore akan segera hadir", "info")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Pulihkan
                </button>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <h4 className="font-semibold mb-2 text-red-800">Reset</h4>
                <button
                  onClick={() => setConfirmationAction("reset")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Reset Semua
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB NOTIFIKASI ===== */}
        {activeTab === "notif" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Preferensi Notifikasi</h3>
            <div className="space-y-3 max-w-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localSettings.notifWA}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, notifWA: e.target.checked }))}
                  className="rounded"
                />{" "}
                WhatsApp
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localSettings.notifSMS}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, notifSMS: e.target.checked }))}
                  className="rounded"
                />{" "}
                SMS
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localSettings.notifEmail}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, notifEmail: e.target.checked }))}
                  className="rounded"
                />{" "}
                Email
              </label>
              <button
                onClick={() =>
                  handleSave({
                    notifWA: localSettings.notifWA,
                    notifSMS: localSettings.notifSMS,
                    notifEmail: localSettings.notifEmail,
                  })
                }
                className="mt-2 bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        {/* ===== TAB TAMPILAN ===== */}
        {activeTab === "tampilan" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Tampilan</h3>
            <div className="space-y-3 max-w-xs">
              <div>
                <label className="block text-sm font-semibold mb-1">Ukuran Font</label>
                <select
                  value={localSettings.fontSize}
                  onChange={(e) => setDraftSettings((prev) => ({ ...prev, fontSize: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="small">Kecil</option>
                  <option value="normal">Normal</option>
                  <option value="large">Besar</option>
                </select>
              </div>
              <button
                onClick={() => handleSave({ fontSize: localSettings.fontSize })}
                className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}

        {/* ===== TAB INTEGRASI ===== */}
        {activeTab === "integrasi" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Integrasi Bot WhatsApp</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 flex flex-col max-w-md">
                <h4 className="font-semibold text-green-800 border-b border-green-200 pb-2 mb-4">
                  <i className="fa-brands fa-whatsapp mr-2"></i>Koneksi WhatsApp Bot
                </h4>

                <div className="flex bg-gray-200 rounded-lg p-1 mb-4">
                  <button
                    onClick={() => setLoginMethod("pairing")}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      loginMethod === "pairing"
                        ? "bg-white shadow text-green-700"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Pairing Code
                  </button>
                  <button
                    onClick={() => setLoginMethod("qr")}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      loginMethod === "qr"
                        ? "bg-white shadow text-green-700"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Scan QR
                  </button>
                </div>

                {loginMethod === "pairing" ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Nomor WA Bot (Awalan 62)</label>
                    <input
                      type="text"
                      value={botPhone}
                      onChange={(e) => setBotPhone(e.target.value)}
                      placeholder="Contoh: 6281234567890"
                      className="w-full border-2 border-green-300 rounded-lg px-3 py-2 mb-2"
                    />
                    <button
                      onClick={requestPairingCode}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Dapatkan Kode Pairing
                    </button>
                    {pairingCode && (
                      <div className="mt-2 p-3 bg-white rounded-lg border border-green-300 text-center">
                        <p className="text-sm text-gray-600 mb-1">Kode Pairing:</p>
                        <div className="bg-green-100 text-green-800 text-3xl font-mono font-bold tracking-widest py-3 px-4 rounded-lg inline-block">
                          {pairingCode}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    {qrCodeData ? (
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <QRCode value={qrCodeData} size={200} />
                      </div>
                    ) : (
                      <div className="w-[200px] h-[200px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 text-sm text-center px-4">
                        {botStatus || "Menunggu status QR dari server..."}
                      </div>
                    )}
                  </div>
                )}

                {botStatus && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-green-300 text-center">
                    <p className="text-sm text-gray-600">{botStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <ConfirmationModalPortal
        isOpen={confirmationAction !== null}
        onClose={() => setConfirmationAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmationAction === "reset" ? "Reset data lokal?" : "Keluar dari akun?"}
        description={
          confirmationAction === "reset"
            ? "Semua data di penyimpanan browser akan dihapus dan halaman dimuat ulang. Data di server tidak terhapus."
            : "Sesi login di perangkat ini akan dihapus dan Anda diarahkan ke halaman login."
        }
        confirmText={confirmationAction === "reset" ? "Ya, Reset" : "Ya, Keluar"}
        cancelText="Tidak"
        variant={confirmationAction === "reset" ? "danger" : "warning"}
      />
    </>
  );
}