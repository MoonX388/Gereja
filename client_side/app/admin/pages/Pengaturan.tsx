"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/app/components/ToastContext";
import QRCode from "react-qr-code";

export default function Pengaturan() {
  const { settings, updateSettings } = useAdmin();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profil");
  const [localSettings, setLocalSettings] = useState(settings);

  // State untuk bot WhatsApp
  const [waToken, setWaToken] = useState("");
  const [botPhone, setBotPhone] = useState("");
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState("");
  const [loginMethod, setLoginMethod] = useState<"pairing" | "qr">("pairing");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Ambil token WA
  useEffect(() => {
    if (activeTab === "integrasi") {
      const fetchToken = async () => {
        try {
          let extractedToken = "";

          try {
            const res = await api.get("/wa/token");
            if (res.data?.token) extractedToken = res.data.token;
          } catch {
            const res = await api.get("/wa/login-url");
            if (res.data?.loginUrl) {
              extractedToken = res.data.loginUrl.split("token=")[1] || "";
            }
          }

          if (extractedToken) {
            setWaToken(extractedToken);
          } else {
            setBotStatus("❌ Token gagal dimuat.");
          }
        } catch (error) {
          console.error("Gagal mengambil token:", error);
          setBotStatus("❌ Gagal terhubung ke backend NestJS.");
        }
      };
      fetchToken();
    }
  }, [activeTab]);

  // Polling QR
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeTab === "integrasi" && loginMethod === "qr") {
      const fetchQr = async () => {
        try {
          const res = await api.get("/wa/qr");
          if (res.data.qr) {
            setQrCodeData(res.data.qr);
          } else {
            setQrCodeData(null);
            setBotStatus("⏳ Memuat QR... (Bot mungkin sudah login atau sedang mereset)");
          }
        } catch (error) {
          console.error("Error mengambil QR:", error);
        }
      };

      fetchQr();
      interval = setInterval(fetchQr, 5000);
    }

    return () => clearInterval(interval);
  }, [activeTab, loginMethod]);

  const handleSave = (data: Partial<typeof settings>) => {
    updateSettings(data);
    showToast("Pengaturan disimpan", "success");
  };

  const handleUpdateAccount = async () => {
    try {
      const payload: any = { username: localSettings.username };
      if (newPassword.trim()) {
        payload.password = newPassword;
      }
      if (!user?.id) {
        showToast('User tidak ditemukan, silakan login ulang', 'error');
        return;
      }
      await api.put(`/users/${user.id}`, payload);
      showToast('Akun berhasil diperbarui!', 'success');
      setNewPassword('');
      await api.get('/auth/profile');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal update akun', 'error');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("token");
      router.push("/auth/login");
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
    } catch (error) {
      console.error("Error Pairing:", error);
      setBotStatus("❌ Gagal mendapatkan kode pairing. Sesi mungkin error.");
    }
  };

  const copyToken = () => {
    if (!waToken) return;
    navigator.clipboard.writeText(waToken);
    showToast("Token berhasil disalin!", "success");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* ===== TAB NAVIGASI - STICKY ===== */}
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
                  onChange={(e) => setLocalSettings({ ...localSettings, namaGereja: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Kode</label>
                <input
                  type="text"
                  value={localSettings.kodeGereja}
                  onChange={(e) => setLocalSettings({ ...localSettings, kodeGereja: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Alamat</label>
                <textarea
                  rows={2}
                  value={localSettings.alamat}
                  onChange={(e) => setLocalSettings({ ...localSettings, alamat: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Telepon</label>
                <input
                  type="text"
                  value={localSettings.telp}
                  onChange={(e) => setLocalSettings({ ...localSettings, telp: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Website</label>
                <input
                  type="text"
                  value={localSettings.website}
                  onChange={(e) => setLocalSettings({ ...localSettings, website: e.target.value })}
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
                <p className="text-sm text-gray-700"><span className="font-semibold">Role:</span> {user?.role || "Tidak diketahui"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Username:</span> {user?.username || "Tidak diketahui"}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Username</label>
                <input
                  type="text"
                  value={localSettings.username || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, username: e.target.value })}
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
                  onClick={() => {
                    if (window.confirm("Yakin reset semua data?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
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
                  onChange={(e) => setLocalSettings({ ...localSettings, notifWA: e.target.checked })}
                  className="rounded"
                />{" "}
                WhatsApp
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localSettings.notifSMS}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifSMS: e.target.checked })}
                  className="rounded"
                />{" "}
                SMS
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localSettings.notifEmail}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifEmail: e.target.checked })}
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
                  onChange={(e) => setLocalSettings({ ...localSettings, fontSize: e.target.value })}
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
              {/* Kolom Kiri: Email SMTP }
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 border-b pb-2">Email Pengirim (SMTP)</h4>
                <div>
                  <label className="block text-sm font-semibold mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={localSettings.smtpHost || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, smtpHost: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email Pengirim</label>
                  <input
                    type="email"
                    value={localSettings.emailFrom || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, emailFrom: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="admin@gereja.com"
                  />
                </div>
                <button
                  onClick={() =>
                    handleSave({
                      smtpHost: localSettings.smtpHost,
                      emailFrom: localSettings.emailFrom,
                    })
                  }
                  className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Simpan Email
                </button>
              </div>*/}

              {/* Kolom Kanan: WhatsApp Bot */}
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
                        Bot WhatsApp sudah terhubung.
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
  );
}