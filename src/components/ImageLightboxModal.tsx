import React from 'react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  caption?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageUrl,
  caption,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada de imagen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Cerrar imagen"
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors z-10"
      >
        <span className="material-symbols-outlined text-[24px]">close</span>
      </button>

      <div
        className="relative max-w-lg max-h-[85vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={caption || 'Vista ampliada'}
          className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
        />
        {caption && (
          <p className="mt-3 text-white/90 text-center text-xs px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
