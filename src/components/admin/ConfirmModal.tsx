import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Are you sure you want to continue?",
  message = "This action will move the selected record to Trash.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-[#c5a059]/40 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 relative font-outfit">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'danger' ? 'bg-red-950/80 border border-red-500/40 text-red-400' : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base leading-snug">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                : 'bg-[#c5a059] hover:bg-[#e5c178] text-[#070b19]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
