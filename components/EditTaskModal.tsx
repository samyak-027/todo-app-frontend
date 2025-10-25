import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newText: string) => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setText(task.text);
      // Focus the textarea when the modal opens
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
        onSave(text.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form 
        onSubmit={handleSave} 
        className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 id="modal-title" className="text-xl font-bold text-white">Edit Task</h3>
          <div className="mt-4">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded-md py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              required
              aria-label="Task text"
            />
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
            type="submit"
            className="px-4 py-2 bg-cyan-600 text-sm font-medium text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-cyan-800 disabled:cursor-not-allowed"
            disabled={!text.trim() || text.trim() === task.text}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;
