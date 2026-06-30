'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave?: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, onSave, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#0f1a2e] mb-5">{title}</h2>
        {children}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              <i className="fa-solid fa-save mr-1"></i> Simpan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
