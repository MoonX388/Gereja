"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/app/components/ToastContext";
import "@/app/ui/auth.css";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
      router.push("/admin");
    } catch (error: unknown) {
      const typedError = error as { response?: { data?: { message?: string } } };
      showToast(typedError.response?.data?.message ?? 'Login gagal, periksa akun Anda.', 'error');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-4 font-sans bg-light"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(15,26,46,0.9) 0%, rgba(30,58,95,0.85) 100%), url('/church-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full max-w-md login-card page-transition">
        <div className="text-center pt-5 pb-2">
          <i className="fa-solid fa-church text-4xl text-primary mb-1"></i>
          <h2 className="text-xl font-bold text-dark">GerejaDigital</h2>
          <p className="text-gray-500 text-xs">Sistem Manajemen Gereja</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button className="tab-btn active w-1/2 py-2 text-center font-semibold text-sm">
            <i className="fa-solid fa-key mr-1"></i> Masuk Admin
          </button>
          <Link
            href="/register"
            className="tab-btn w-1/2 py-2 text-center font-semibold text-sm block text-gray-500 hover:bg-gray-50"
          >
            <i className="fa-solid fa-user-plus mr-1"></i> Daftar Anggota
          </Link>
        </div>

        <div className="p-5 md:p-6">
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <i className="fa-regular fa-envelope mr-1"></i> Email atau Username
              </label>
              <input
                id="loginIdentifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="form-input w-full"
                placeholder="admin@gereja.com / admin"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <i className="fa-solid fa-lock mr-1"></i> Password
              </label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full"
                placeholder="********"
                required
              />
            </div>
            <button
              id="submitBtn"
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i> Mohon Tunggu...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket mr-2"></i> Masuk sebagai Admin
                </>
              )}
            </button>
          </form>
          <div className="text-center text-xs text-gray-400 mt-5">
            <i className="fa-regular fa-building mr-1"></i> Gunakan akun admin: admin / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
