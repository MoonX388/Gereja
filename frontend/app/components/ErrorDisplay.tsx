'use client';

import React from 'react';
import { IconType } from 'react-icons';
import {
  FaCircleCheck,
  FaArrowRightArrowLeft,
  FaArrowRight,
  FaCircleExclamation,
  FaLock,
  FaBan,
  FaCompass,
  FaCircleXmark,
  FaClock,
  FaGaugeHigh,
  FaTriangleExclamation,
  FaServer,
  FaWrench,
  FaHourglassHalf,
  FaQuestion,
} from 'react-icons/fa6';

interface ErrorData {
  icon: IconType;
  badge: string;
  title: string;
  desc: string;
}

const errorMap: Record<number, ErrorData> = {
  200: { icon: FaCircleCheck, badge: 'OK', title: 'Permintaan Berhasil', desc: 'Server telah memproses permintaan Anda dengan sukses.' },
  201: { icon: FaCircleCheck, badge: 'Created', title: 'Data Berhasil Dibuat', desc: 'Sumber daya baru telah berhasil dibuat.' },
  204: { icon: FaCircleCheck, badge: 'No Content', title: 'Tidak Ada Konten', desc: 'Permintaan berhasil tetapi tidak ada konten yang dikembalikan.' },
  301: { icon: FaArrowRightArrowLeft, badge: 'Moved Permanently', title: 'Halaman Telah Dipindahkan', desc: 'Halaman ini telah dipindahkan secara permanen ke URL baru.' },
  302: { icon: FaArrowRight, badge: 'Found', title: 'Pengalihan Sementara', desc: 'Halaman ini dialihkan sementara ke URL lain.' },
  400: { icon: FaCircleExclamation, badge: 'Bad Request', title: 'Permintaan Tidak Valid', desc: 'Server tidak dapat memproses permintaan karena kesalahan sintaks.' },
  401: { icon: FaLock, badge: 'Unauthorized', title: 'Akses Ditolak', desc: 'Anda perlu login untuk mengakses halaman ini.' },
  403: { icon: FaBan, badge: 'Forbidden', title: 'Akses Dilarang', desc: 'Anda tidak memiliki izin untuk mengakses halaman ini.' },
  404: { icon: FaCompass, badge: 'Not Found', title: 'Halaman Tidak Ditemukan', desc: 'Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.' },
  405: { icon: FaCircleXmark, badge: 'Method Not Allowed', title: 'Metode Tidak Diizinkan', desc: 'Metode HTTP yang digunakan tidak didukung untuk halaman ini.' },
  408: { icon: FaClock, badge: 'Request Timeout', title: 'Waktu Permintaan Habis', desc: 'Server tidak menerima permintaan lengkap dalam waktu yang ditentukan.' },
  429: { icon: FaGaugeHigh, badge: 'Too Many Requests', title: 'Terlalu Banyak Permintaan', desc: 'Anda telah mengirim terlalu banyak permintaan dalam waktu singkat.' },
  500: { icon: FaTriangleExclamation, badge: 'Internal Server Error', title: 'Kesalahan Server Internal', desc: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.' },
  502: { icon: FaServer, badge: 'Bad Gateway', title: 'Gateway Tidak Valid', desc: 'Server menerima respons tidak valid dari server upstream.' },
  503: { icon: FaWrench, badge: 'Service Unavailable', title: 'Layanan Tidak Tersedia', desc: 'Server sedang dalam pemeliharaan atau kelebihan beban. Coba lagi nanti.' },
  504: { icon: FaHourglassHalf, badge: 'Gateway Timeout', title: 'Gateway Kehabisan Waktu', desc: 'Server upstream tidak merespons tepat waktu.' },
};

const fallback: ErrorData = {
  icon: FaQuestion,
  badge: 'Unknown',
  title: 'Kode Error Tidak Dikenal',
  desc: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
};

interface ErrorDisplayProps {
  statusCode?: number;
  title?: string;
  description?: string;
  showReset?: boolean;
  onReset?: () => void;
}

export default function ErrorDisplay({
  statusCode = 404,
  title,
  description,
  showReset = false,
  onReset,
}: ErrorDisplayProps) {
  const data = errorMap[statusCode] || fallback;
  const displayCode = errorMap[statusCode] ? statusCode : '?';

  let iconColor = 'text-primary/20';
  let badgeColor = 'bg-gray-100 text-gray-700';
  if (statusCode >= 200 && statusCode < 300) {
    iconColor = 'text-green-400/30';
    badgeColor = 'bg-green-100 text-green-700';
  } else if (statusCode >= 300 && statusCode < 400) {
    iconColor = 'text-amber-400/30';
    badgeColor = 'bg-amber-100 text-amber-700';
  } else if (statusCode >= 400 && statusCode < 500) {
    iconColor = 'text-red-400/30';
    badgeColor = 'bg-red-100 text-red-700';
  } else if (statusCode >= 500) {
    iconColor = 'text-rose-400/30';
    badgeColor = 'bg-rose-100 text-rose-700';
  }

  const IconComponent = data.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-light">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl p-8 md:p-12 text-center transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]">
        <div className={`text-7xl mb-2 ${iconColor}`}>
          <IconComponent />
        </div>

        <div className="text-8xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none">
          {displayCode}
        </div>

        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold tracking-wide mt-2 mb-4 ${badgeColor}`}>
          {data.badge}
        </span>

        <h1 className="text-2xl font-bold text-dark mb-2">{title || data.title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description || data.desc}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </a>
          <button
            onClick={() => window.history.back()}
            className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-50 transition text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Kembali
          </button>
        </div>

        {showReset && onReset && (
          <div className="mt-4">
            <button
              onClick={onReset}
              className="bg-accent hover:bg-yellow-600 text-dark px-6 py-2 rounded-full font-semibold transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Jika masalah berlanjut, hubungi administrator.
        </p>

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400 flex justify-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14" />
            </svg>
            GerejaDigital
          </span>
          <span>|</span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
  );
}