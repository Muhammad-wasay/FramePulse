import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-spring-pop">
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-[#2b1d14]/15 shadow-lg flex items-center gap-3 max-w-sm">
        <div
          className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${
            toast.type === 'warning'
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : toast.type === 'danger'
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.icon || 'task_alt'}
          </span>
        </div>
        <div className="flex flex-col pr-2">
          <span className="font-headline-sm text-[15px] text-on-surface leading-tight">
            {toast.title}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {toast.message}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-on-surface-variant hover:text-[#2b1d14] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
