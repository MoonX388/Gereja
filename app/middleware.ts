// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isLoggedIn = !!token;

  console.log('[Middleware] Request:', request.nextUrl.pathname, 'isLoggedIn:', isLoggedIn);

  // Proteksi semua rute /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      console.log('[Middleware] No token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Token ada, biarkan frontend handle role check via auth-context
    console.log('[Middleware] Token exists, allowing access');
  }

  // Bisa tambahkan proteksi untuk rute lain jika perlu
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'], // sesuaikan
};