import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 id="modal-title" className="text-xl font-bold text-white">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-slate-400 whitespace-pre-wrap">{message}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 px-6 py-3 flex justify-end items-center gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-sm font-medium text-white rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 text-sm font-medium text-white rounded-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-rose-500 transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
