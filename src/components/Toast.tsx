import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'favorite' }) => {
  if (!message) return null;

  return (
    <aside
      aria-label="Notificación flotante"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform translate-y-0"
    >
      <div className="bg-[#111111] text-[#FFFFFF] px-4 py-2.5 rounded-full text-[13px] font-medium shadow-2xl flex items-center gap-2 border border-white/10 max-w-[90vw]">
        <span
          className="material-symbols-outlined text-[#E5E5E5] text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <span className="truncate">{message}</span>
      </div>
    </aside>
  );
};
