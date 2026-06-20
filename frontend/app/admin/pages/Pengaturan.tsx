"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function Pengaturan() {
  const { settings, updateSettings } = useAdmin();
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profil");
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = (data: Partial<typeof settings>) => {
    updateSettings(data);
    alert("Pengaturan disimpan");
  };

  // Fungsi logout
  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("token");
      // Jika ada fungsi logout dari context, bisa dipanggil di sini
      // misal: logout();
      router.push("/auth/login");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 px-2 md:px-5">
          <nav className="flex flex-nowrap overflow-x-auto -mb-px space-x-1 md:space-x-2">
            {[
              "profil",
              "akun",
              "database",
              "notif",
              "tampilan",
              "integrasi",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-[#1e3a5f] text-[#1e3a5f] bg-[#1e3a5f] text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* ========== TAB PROFIL ========== */}
          {activeTab === "profil" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Profil Gereja</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nama Gereja
                  </label>
                  <input
                    type="text"
                    value={localSettings.namaGereja}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        namaGereja: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Kode
                  </label>
                  <input
                    type="text"
                    value={localSettings.kodeGereja}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        kodeGereja: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">
                    Alamat
                  </label>
                  <textarea
                    rows={2}
                    value={localSettings.alamat}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        alamat: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    value={localSettings.telp}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        telp: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={localSettings.email}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        email: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={localSettings.website}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        website: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
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

          {/* ========== TAB AKUN ========== */}
          {activeTab === "akun" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Pengaturan Akun</h3>
              <div className="space-y-4 max-w-md">
                {/* Informasi user */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Nama:</span>{" "}
                    {user?.name || "Tidak diketahui"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Email:</span>{" "}
                    {user?.email || "Tidak diketahui"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Role:</span>{" "}
                    {user?.role || "Tidak diketahui"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={localSettings.username}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        username: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    defaultValue=""
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      handleSave({ username: localSettings.username })
                    }
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

          {/* ========== TAB DATABASE ========== */}
          {activeTab === "database" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Manajemen Data</h3>
              <div className="space-y-4 max-w-lg">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold mb-2">Backup</h4>
                  <button
                    onClick={() => alert("Export functionality coming soon")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Ekspor JSON
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold mb-2">Restore</h4>
                  <input
                    type="file"
                    accept=".json"
                    className="block mb-2 text-sm"
                  />
                  <button
                    onClick={() => alert("Restore functionality coming soon")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Pulihkan
                  </button>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <h4 className="font-semibold mb-2 text-red-800">Reset</h4>
                  <button
                    onClick={() => {
                      if (confirm("Yakin reset semua data?")) {
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

          {/* ========== TAB NOTIFIKASI ========== */}
          {activeTab === "notif" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Preferensi Notifikasi</h3>
              <div className="space-y-3 max-w-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSettings.notifWA}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        notifWA: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  WhatsApp
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSettings.notifSMS}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        notifSMS: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  SMS
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSettings.notifEmail}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        notifEmail: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
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

          {/* ========== TAB TAMPILAN ========== */}
          {activeTab === "tampilan" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Tampilan</h3>
              <div className="space-y-3 max-w-xs">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Ukuran Font
                  </label>
                  <select
                    value={localSettings.fontSize}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        fontSize: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  >
                    <option value="small">Kecil</option>
                    <option value="normal">Normal</option>
                    <option value="large">Besar</option>
                  </select>
                </div>
                <button
                  onClick={() =>
                    handleSave({ fontSize: localSettings.fontSize })
                  }
                  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}

          {/* ========== TAB INTEGRASI ========== */}
          {activeTab === "integrasi" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Integrasi API</h3>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    WhatsApp API Key
                  </label>
                  <input
                    type="text"
                    value={localSettings.waKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        waKey: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={localSettings.smtpHost}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        smtpHost: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email Pengirim
                  </label>
                  <input
                    type="email"
                    value={localSettings.emailFrom}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        emailFrom: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white
         focus:outline-none focus:ring-2 focus:ring-primary
         hover:border-gray-400 hover:bg-gray-50"
                  />
                </div>
                <button
                  onClick={() =>
                    handleSave({
                      waKey: localSettings.waKey,
                      smtpHost: localSettings.smtpHost,
                      emailFrom: localSettings.emailFrom,
                    })
                  }
                  className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
