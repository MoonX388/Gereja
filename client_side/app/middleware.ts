// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isLoggedIn = !!token;

  // Proteksi semua rute /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Optional: cek role dari token (jika disimpan di cookie/JWT)
    // Jika role bukan admin → redirect ke /error/403
  }

  // Bisa tambahkan proteksi untuk rute lain jika perlu
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'], // sesuaikan
};