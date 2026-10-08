import React from 'react';
import { ActiveScreen } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR } from '../data/mockData';

interface ReservationsViewProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenBooking: (bookingDetails: {
    salonName: string;
    serviceName: string;
    price?: string;
    slot: string;
    provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  }) => void;
  onShowToast: (msg: string, icon?: string) => void;
  unreadCount: number;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  onNavigate,
  onOpenBooking,
  onShowToast,
  unreadCount,
}) => {
  return (
    <div className="flex flex-col w-full pb-24 bg-[#FFF8F9] min-h-screen">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#FFF8F9]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(87,28,49,0.04)]">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <GlowBuzzLogo variant="header" size={32} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate({ name: 'notifications' })}
              aria-label="Notificaciones"
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#181416] hover:text-[#B82E5F] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B82E5F] ring-2 ring-[#FFF8F9]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'profile' })}
              className="rounded-full ring-1 ring-[#F5DCE5] overflow-hidden"
              aria-label="Mi Perfil"
            >
              <img
                alt="Valentina Rossi"
                className="w-8 h-8 rounded-full object-cover"
                src={USER_AVATAR}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full pt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="pt-3 pb-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#181416] tracking-tight">Mis Reservas &amp; Citas</h1>
          <span className="text-xs text-[#B82E5F] font-semibold bg-[#F5DCE5] px-2.5 py-0.5 rounded-full">
            1 próxima cita
          </span>
        </div>

        {/* Section 1: Upcoming Appointment */}
        <section className="flex flex-col gap-2.5 mt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs uppercase font-bold text-[#571C31] tracking-wider">
              Próxima Cita
            </h2>
            <span className="text-[11px] text-[#B82E5F] font-bold">En 3 días</span>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#EAD8DE] flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrVocG-HFvOIk8EwLh9YGNuj1IZNSLixooDpM9jQkkPxa4mm8P2hQHiveNuDdrAZmbbQn953SKJXfkBpb_E9I4qQoQww8ehT3GNMVx70oljngvF5GTiIR97c3dZcfvH9ZGo7nj_Hc90CAjGkA_ofyH8M-o502hfJSKXpjj4lzStwDJqJfmmqG-JX6s3w4KM783kwqH16EK9pbx_iFu8uhWVQr-sPWGuVBaRvJtvyLg4QIIlXv4zZ9K"
                  alt="Maison Hair Co"
                  className="w-12 h-12 rounded-full object-cover border border-[#F5DCE5]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#181416]">Maison Hair Co. Studio</h3>
                  <p className="text-xs text-[#574145]">Balayage Signature &amp; Nutrición</p>
                  <p className="text-[11px] text-[#B82E5F] font-medium">Colorista: Sofía Navarro</p>
                </div>
              </div>
              <span className="bg-[#FFD9E0] text-[#3F0019] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Confirmada
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FBF1F4] flex flex-col gap-1.5 text-xs text-[#574145]">
              <div className="flex items-center gap-2 text-[#181416] font-semibold">
                <span className="material-symbols-outlined text-[#B82E5F] text-[17px]">
                  schedule
                </span>
                <span>Martes 24 Octubre · 15:30 hs (3h 30m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6C5961] text-[17px]">
                  location_on
                </span>
                <span>Armenia 1840, Palermo Soho, Buenos Aires</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#F5EBEE]">
              <button
                type="button"
                onClick={() =>
                  onNavigate({ name: 'look_detail', lookId: 'look-balayage-vainilla' })
                }
                className="flex-1 py-2 px-3 rounded-full bg-[#EFE6E8] text-[#181416] hover:bg-[#F5DCE5] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">info</span>
                <span>Ver look y cuidados</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenBooking({
                    salonName: 'Maison Hair Co. Studio',
                    serviceName: 'Balayage Signature',
                    slot: 'Martes 24 Octubre 15:30 hs',
                    provider: 'Fresha',
                  })
                }
                className="flex-1 py-2 px-3 rounded-full bg-[#B82E5F] text-white hover:bg-[#971047] text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">edit_calendar</span>
                <span>Modificar en agenda</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Alert / Waitlist Slot */}
        <section className="flex flex-col gap-2 mt-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs uppercase font-bold text-[#571C31] tracking-wider">
              Alertas de Lista de Espera
            </h2>
            <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-pulse" />
          </div>

          <div className="p-4 rounded-3xl bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#181416]">¡Se liberó un turno para hoy!</h4>
                  <p className="text-[11px] text-[#574145]">Studio Velvet Nails · Recoleta</p>
                </div>
              </div>
              <span className="text-[10px] text-[#BA1A1A] font-bold uppercase">Hoy 18:00 hs</span>
            </div>

            <p className="text-xs text-[#574145] leading-snug">
              Disponibilidad inmediata para <strong>Kapping Gel con Nail Art</strong>. Cancelación de última hora.
            </p>

            <button
              type="button"
              onClick={() =>
                onOpenBooking({
                  salonName: 'Studio Velvet Nails',
                  serviceName: 'Kapping Gel + Nail Art',
                  price: '$ 1.450',
                  slot: 'Hoy 18:00 hs',
                  provider: 'Timely',
                })
              }
              className="py-2.5 px-4 rounded-full bg-[#BA1A1A] hover:bg-[#93000A] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>Aprovechar turno en agenda externa</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Section 3: Past Visits */}
        <section className="flex flex-col gap-2.5 mt-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs uppercase font-bold text-[#571C31] tracking-wider">
              Historial de Visitas
            </h2>
            <span className="text-xs text-[#6C5961]">2 en los últimos 60 días</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EAD8DE] flex flex-col gap-2 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F5DCE5] text-[#B82E5F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">content_cut</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#181416]">Corte Bob Texturado &amp; Baño de Brillo</h4>
                  <p className="text-[11px] text-[#6C5961]">Maison Hair Co. · Lucas</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#B82E5F]">$ 1.600</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#F5EBEE] text-xs text-[#6C5961]">
              <span>12 Sep 2024 · 17:00 hs</span>
              <button
                type="button"
                onClick={() =>
                  onOpenBooking({
                    salonName: 'Maison Hair Co. Studio',
                    serviceName: 'Corte Bob Texturado',
                    price: '$ 1.600',
                    slot: 'Próxima semana',
                    provider: 'Fresha',
                  })
                }
                className="text-[#B82E5F] font-bold hover:underline"
              >
                Volver a reservar
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EAD8DE] flex flex-col gap-2 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F5DCE5] text-[#B82E5F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">brush</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#181416]">Kapping Gel + Esmaltado Semipermanente</h4>
                  <p className="text-[11px] text-[#6C5961]">Studio Velvet Nails · Camila</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#B82E5F]">$ 1.450</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#F5EBEE] text-xs text-[#6C5961]">
              <span>28 Ago 2024 · 14:00 hs</span>
              <button
                type="button"
                onClick={() =>
                  onOpenBooking({
                    salonName: 'Studio Velvet Nails',
                    serviceName: 'Kapping Gel + Esmaltado',
                    price: '$ 1.450',
                    slot: 'Próximo viernes',
                    provider: 'Timely',
                  })
                }
                className="text-[#B82E5F] font-bold hover:underline"
              >
                Volver a reservar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
