import React, { useState } from 'react';
import { SALONS_DATA } from '../data/mockData';

interface UploadLookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadLook: (newLook: {
    imageUrl: string;
    caption: string;
    salonName: string;
    salonId: string;
    treatment: string;
    rating: number;
  }) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const UploadLookModal: React.FC<UploadLookModalProps> = ({
  isOpen,
  onClose,
  onUploadLook,
  onShowToast,
}) => {
  const samplePhotos = [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr9e3NUEyjIimALfLvLc35kg8wSr1erLyy_GzoE2A5icTypHnNIqOdFd-X8j_j9f-I6tuT0x01pQ_GSfi9dhLE-8jIszDq1SOiHXteAP1UIwYAZ83n2uk-F8y4S2deCQl24IbAk5dfgVFjQaBXjSzVAZq8geQviKug-4e_7EQ_Ge75r6s1oa2TOk0V5peHrCc_rSCYQ3EvvEpQQIBxSUdHkodw3dKUVwb5zuhGh0tvhkf_xVJ58FFA',
      label: 'Balayage Caramelo',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgOLvEtQCq68fBFgATYYp5_sBkz2XNxFPfRh-xAIvcTnAVWCViysJ7pyPy9k1IY7DCyPCOklMKp0YCugcYSd22tyBa7PQaDP7GjJ6r7Cl4iJKyt60kA6yVtfpSUD9vha9ggMr_dKr5dld0szI8L01Iqzx7YlIqJAxhh_meT_wKZYTTKvl1JFgcpXTLgdswP8DJahj6xtP_FW1a470znp1owjavW4X88OYrfm_wigykdKK6nOfMcChy',
      label: 'Uñas Cherry Glaze',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwclwZDeT02AdqTMXr5JYvV08zmT8emxCT3h8JJvGpnWG4jIWHbX3ophB78VUsEaP2N6Fu0tXxOAkw3vwJznYWxqnxPdS6fP31_onUevmfwEih9-aL5lIlQQKrMnNYYy54esEAvKB0ZnGUqjuPWhQ3v7ukmvOCKy98YfR_JkvcfO0inYQFli6ywMIdjNcw1JBEQKeJ3lK1k9l4vJXohziCmuV3kF1PpTCAId7nMuhKrswLXWwFBGeT',
      label: 'Laminado de cejas HD',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG9RvTdY_daRtOP9TGTJRaNQqQI5jJz-w6-Dek_kmngCPOHwQ273_MVqEXlpYwkoSbVALk9_uKwBRVhm5bD-kC8HSfBzUYasekXKvCrXkvV8OeA7I9irrd2wMDCFIOeWaj9LEcw5oMX9T5h-EvBsfvbLznZ0Cy1OM0vLiztSjiGV6ZBALSR093P8eZcPftDnHWbt_WL0pHXxdSqUqqcAR-pXQoq2QsD_449kr3QuQtGZBjwtfRIWNx',
      label: 'Piel Glow & Blush',
    },
  ];

  const [selectedPhoto, setSelectedPhoto] = useState(samplePhotos[0].url);
  const [caption, setCaption] = useState('¡Quedó soñado! El acabado y la textura súper sedosa.');
  const [salonId, setSalonId] = useState('maison-hair-co');
  const [treatment, setTreatment] = useState('Balayage Signature & Nutrición Gloss');
  const [rating, setRating] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salon = SALONS_DATA[salonId] || SALONS_DATA['maison-hair-co'];
    onUploadLook({
      imageUrl: selectedPhoto,
      caption,
      salonName: salon.name,
      salonId: salon.id,
      treatment,
      rating,
    });
    onShowToast('¡Look subido con éxito a tu perfil!', 'add_a_photo');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Subir look de belleza"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFF8F3] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 border-t border-[#F5DCE5] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[#8B7075]/30 mx-auto" />

        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B82E5F] text-[22px]">
              photo_camera
            </span>
            <h3 className="text-base font-bold text-[#181416]">Subir Look Real</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE6E8] flex items-center justify-center text-[#574145] hover:text-[#181416]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Photo selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#571C31] uppercase tracking-wider">
              Elegí o capturá tu foto
            </label>
            <div className="grid grid-cols-4 gap-2">
              {samplePhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedPhoto === photo.url
                      ? 'border-[#B82E5F] ring-2 ring-[#B82E5F]/30 scale-102'
                      : 'border-[#DEBFC4] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Salón de atención */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#181416]">Salón o Profesional</label>
            <select
              value={salonId}
              onChange={(e) => setSalonId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#DEBFC4] text-xs text-[#181416] outline-none"
            >
              {Object.values(SALONS_DATA).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.neighborhood})
                </option>
              ))}
            </select>
          </div>

          {/* Tratamiento */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#181416]">Tratamiento realizado</label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Ej: Balayage, Kapping Gel..."
              className="w-full p-2.5 rounded-xl bg-white border border-[#DEBFC4] text-xs text-[#181416] outline-none"
              required
            />
          </div>

          {/* Calificación */}
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#DEBFC4]">
            <span className="text-xs font-semibold text-[#181416]">Tu valoración:</span>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comentario / Experiencia */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#181416]">Comentario o tips de cuidado</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl bg-white border border-[#DEBFC4] text-xs text-[#181416] outline-none"
              placeholder="Contale a la comunidad cómo quedó..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#B82E5F] text-white font-bold text-xs shadow-md mt-1 active:scale-98 transition-transform"
          >
            Publicar en Mis Fotos
          </button>
        </form>
      </div>
    </div>
  );
};
