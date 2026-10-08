import React, { useState } from 'react';

interface ExternalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  serviceName?: string;
  stylistName?: string;
  price?: string;
  slot?: string;
  provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  onBookingConfirmed?: (details: { salon: string; service: string; slot: string }) => void;
}

export const ExternalBookingModal: React.FC<ExternalBookingModalProps> = ({
  isOpen,
  onClose,
  salonName,
  serviceName = 'Servicio general',
  stylistName,
  price,
  slot = 'Próximo turno disponible',
  provider = 'Fresha',
  onBookingConfirmed,
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleExternalHandover = (channel: string) => {
    setIsRedirecting(true);
    setTimeout(() => {
      setIsRedirecting(false);
      setCompleted(true);
      if (onBookingConfirmed) {
        onBookingConfirmed({
          salon: salonName,
          service: serviceName,
          slot,
        });
      }
    }, 1200);
  };

  const handleFinish = () => {
    setCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFF8F3] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 border-t border-[#F5DCE5] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 rounded-full bg-[#8B7075]/30 mx-auto" />

        {!completed ? (
          <>
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B82E5F] bg-[#F5DCE5] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Derivación a Agenda Externa
                </span>
                <h3 className="text-xl font-bold text-[#181416] tracking-tight">
                  {salonName}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#EFE6E8] flex items-center justify-center text-[#574145] hover:text-[#181416]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Selected Service Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAD8DE] shadow-xs flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs text-[#6C5961]">Tratamiento seleccionado:</span>
                  <span className="text-base font-semibold text-[#181416]">{serviceName}</span>
                  {stylistName && (
                    <span className="text-xs text-[#B82E5F] font-medium mt-0.5">
                      Profesional: {stylistName}
                    </span>
                  )}
                </div>
                {price && (
                  <span className="text-base font-bold text-[#B82E5F]">{price}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-[#F5EBEE] text-xs text-[#574145]">
                <span className="material-symbols-outlined text-[16px] text-[#B82E5F]">
                  schedule
                </span>
                <span>Horario previsto: <strong className="text-[#181416]">{slot}</strong></span>
              </div>
            </div>

            {/* Explanatory Trust Strip */}
            <div className="p-3 rounded-xl bg-[#F5DCE5]/50 border border-[#F5DCE5] text-xs text-[#571C31] flex items-start gap-2 leading-relaxed">
              <span className="material-symbols-outlined text-[18px] text-[#B82E5F] shrink-0 mt-0.5">
                verified_user
              </span>
              <div>
                <p className="font-semibold">Reserva directa con el comercio</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Glow Buzz no cobra comisiones ni adelantos. Te derivamos a la agenda oficial ({provider}) para que confirmes tu turno en tiempo real.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                disabled={isRedirecting}
                onClick={() => handleExternalHandover('provider')}
                className="w-full py-3.5 px-4 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isRedirecting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Conectando con agenda externa...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span>Abrir agenda oficial ({provider})</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleExternalHandover('whatsapp')}
                className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#F5EBEE] text-[#181416] border border-[#DEBFC4] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-600">chat</span>
                <span>Consultar por WhatsApp del salón</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-[#6C5961]">
              Cancelación gratuita hasta 24 hs previas · Sin pago anticipado
            </p>
          </>
        ) : (
          /* Handover Success Confirmation */
          <div className="py-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#F5DCE5] text-[#B82E5F] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[32px]">check</span>
            </div>
            <h3 className="text-xl font-bold text-[#181416]">
              ¡Derivación iniciada con éxito!
            </h3>
            <p className="text-xs text-[#574145] max-w-xs leading-relaxed">
              Te hemos conectado con la agenda de <strong>{salonName}</strong> para el turno de <strong>{slot}</strong>.
            </p>
            <div className="p-3 bg-white rounded-xl border border-[#EAD8DE] w-full text-xs text-left text-[#6C5961]">
              <p className="font-semibold text-[#181416] mb-1">Registro de actividad guardado</p>
              <p>Podrás consultar este recordatorio en la pestaña <strong>Reservas</strong> de Glow Buzz.</p>
            </div>
            <button
              onClick={handleFinish}
              className="w-full mt-2 py-3 rounded-full bg-[#B82E5F] text-white font-bold text-sm shadow-md active:scale-98 transition-transform"
            >
              Continuar navegando looks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
