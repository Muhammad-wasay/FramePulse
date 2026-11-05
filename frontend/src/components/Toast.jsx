import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-spring-pop">
      <div className="bg-surface-container-lowest p-4 rounded-xl border-[2px] border-[#18181b] flex items-center gap-3 max-w-sm">
        <div
          className={`w-10 h-10 rounded-full border-[2px] border-[#18181b] flex items-center justify-center text-[#18181b] flex-shrink-0 ${
            toast.type === 'warning'
              ? 'bg-secondary-container'
              : toast.type === 'danger'
              ? 'bg-tertiary-container'
              : 'bg-[#4ade80]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {toast.icon || 'task_alt'}
          </span>
        </div>
        <div className="flex flex-col pr-2">
          <span className="font-headline-sm text-[16px] uppercase text-on-surface leading-tight">
            {toast.title}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {toast.message}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-on-surface-variant hover:text-[#18181b] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
