'use client';

import { useRef, useState } from 'react';

interface ImportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  importMenuRef: React.RefObject<HTMLDivElement>;
}

export default function ImportMenu({
  isOpen,
  onToggle,
  onFileSelect,
  onDownloadTemplate,
  importMenuRef
}: ImportMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="relative" ref={importMenuRef}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <button
        onClick={onToggle}
        title="Impor Data"
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
      >
        <i className="fa-solid fa-upload"></i>
        <span className="hidden sm:inline">Impor</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 ${
            isDragOver ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center mb-3">
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600">
              {isDragOver ? 'Lepas file di sini' : 'Drag & drop file atau'}
            </p>
          </div>
          <button
            onClick={handleImportClick}
            className="w-full px-3 py-2 text-sm hover:bg-gray-50 border border-gray-200 rounded-lg"
          >
            <i className="fa-solid fa-file-arrow-up mr-2"></i>
            Pilih File
          </button>
          <button
            onClick={onDownloadTemplate}
            className="w-full px-3 py-2 text-sm hover:bg-gray-50 border border-gray-200 rounded-lg mt-2"
          >
            <i className="fa-solid fa-file-excel mr-2"></i>
            Unduh Template
          </button>
        </div>
      )}
    </div>
  );
}