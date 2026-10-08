import React, { useState } from 'react';

interface ShareSheetModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  url?: string;
  onClose: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  isOpen,
  title,
  subtitle,
  url,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    onShowToast('¡Enlace copiado al portapapeles!', 'link');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Mirá este trabajo real en Glow Buzz: ${title} ✨ ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compartir look o salón"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFF8F3] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 border-t border-[#F5DCE5]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[#8B7075]/30 mx-auto" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#B82E5F] tracking-wider">
              Compartir Inspiración
            </span>
            <h3 className="text-base font-bold text-[#181416] line-clamp-1">{title}</h3>
            {subtitle && <p className="text-xs text-[#6C5961]">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE6E8] flex items-center justify-center text-[#574145] hover:text-[#181416]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Copy link bar */}
        <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-[#DEBFC4]">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-[#574145] truncate px-2 outline-none font-mono"
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#B82E5F] text-white hover:bg-[#971047]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        {/* Social channels */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl bg-white border border-[#DEBFC4] flex items-center justify-center gap-2 text-xs font-semibold text-[#181416] hover:bg-[#FBF1F4] transition-colors"
          >
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">chat</span>
            <span>Enviar por WhatsApp</span>
          </button>
          <button
            onClick={() => {
              handleCopy();
              onShowToast('Enlace listo para Stories o Instagram Direct', 'content_copy');
              onClose();
            }}
            className="p-3 rounded-2xl bg-white border border-[#DEBFC4] flex items-center justify-center gap-2 text-xs font-semibold text-[#181416] hover:bg-[#FBF1F4] transition-colors"
          >
            <span className="material-symbols-outlined text-[#B82E5F] text-[18px]">photo_camera</span>
            <span>Instagram / Stories</span>
          </button>
        </div>
      </div>
    </div>
  );
};
