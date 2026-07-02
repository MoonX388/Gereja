import Link from 'next/link';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15,26,46,0.9) 0%, rgba(30,58,95,0.85) 100%), url('/church-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center">
        <i className="fa-solid fa-church text-6xl text-[#e8c547] mb-6"></i>
        <h1 className="text-5xl font-bold text-white mb-4">Gereja Pintar</h1>
        <p className="text-xl text-gray-200 mb-8">Sistem Manajemen Gereja Terpadu</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-[#e8c547] text-[#0f1a2e] px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition"
          >
            <i className="fa-solid fa-user-plus mr-2"></i>
            Daftar sebagai Jemaat
          </Link>
          <Link
            href="/login"
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition"
          >
            <i className="fa-solid fa-key mr-2"></i>
            Login Admin
          </Link>
        </div>
      </div>
    </div>
  );
}