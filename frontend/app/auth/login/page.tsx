"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleIframeMessage = async (event: MessageEvent) => {
      // Pastikan pesan datang dari pengiriman form di iframe kita
      if (event.data && event.data.type === "SUBMIT_LOGIN") {
        const { identifier, password } = event.data.payload;

        try {
          // Jalankan fungsi login bawaan context Next.js kamu
          await login(identifier, password);

          // Jika sukses, arahkan langsung ke halaman admin luar
          router.push("/admin");
        } catch (err: any) {
          const errMsg =
            err.response?.data?.message || "Login gagal, periksa akun Anda.";

          // Cari elemen iframe, lalu kirim balik pesan error-nya ke dalam HTML
          const iframe = document.getElementById(
            "loginIframe",
          ) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: "LOGIN_ERROR",
                message: errMsg,
              },
              "*",
            );
          }
        }
      }
    };

    // Pasang pendengar jembatan udara window
    window.addEventListener("message", handleIframeMessage);

    // Bersihkan penangkap event saat pindah page
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [login, router]);

  return (
    <iframe
      id="loginIframe"
      src="/login.html"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      title="Masuk Admin GerejaDigital"
    />
  );
}
