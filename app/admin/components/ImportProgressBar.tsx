'use client';

interface ImportProgressBarProps {
  isImporting: boolean;
  progress: {
    current: number;
    total: number;
    percent: number;
  };
}

export default function ImportProgressBar({ isImporting, progress }: ImportProgressBarProps) {
  if (!isImporting) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white py-2 px-4 z-50 flex items-center gap-4">
      <div className="flex-1">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1">
          Mengimpor: {progress.current}/{progress.total} ({progress.percent}%)
        </p>
      </div>
      <span className="text-sm animate-pulse">Sedang memproses...</span>
    </div>
  );
}