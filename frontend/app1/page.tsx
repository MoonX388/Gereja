import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">⛪ GerejaDigital</h1>
      <p className="text-lg text-gray-600 mb-8">Sistem Manajemen Jemaat</p>
      <div className="flex gap-4">
        <Link href="/auth/register" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Daftar sebagai Jemaat</Link>
        <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Login Admin</Link>
      </div>
    </div>
  );
}