import React, { useState } from 'react';
import { NotificationItem, ActiveScreen } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR } from '../data/mockData';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onDismissNotification?: (id: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
  onOpenBooking: (bookingDetails: {
    salonName: string;
    serviceName: string;
    price?: string;
    slot: string;
    provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  }) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onDismissNotification,
  onNavigate,
  onBack,
  onOpenBooking,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'todas' | 'turnos' | 'espera' | 'inspiracion'>('todas');
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [isMarkedDone, setIsMarkedDone] = useState(false);

  const handleMarkRead = () => {
    setIsMarkedDone(true);
    onMarkAllAsRead();
    onShowToast('Todas las alertas marcadas como leídas', 'done_all');
  };

  const handleIgnore = (id: string) => {
    setIgnoredIds((prev) => [...prev, id]);
    if (onDismissNotification) {
      onDismissNotification(id);
    }
    onShowToast('Alerta descartada permanentemente');
  };

  const unreadCount = isMarkedDone ? 0 : notifications.filter((n) => n.unread && !ignoredIds.includes(n.id)).length;

  const visibleNotifications = notifications
    .filter((n) => !ignoredIds.includes(n.id))
    .filter((n) => {
      if (filter === 'todas') return true;
      if (filter === 'turnos') return n.category === 'turnos';
      if (filter === 'espera') return n.category === 'espera';
      if (filter === 'inspiracion') return n.category === 'inspiracion';
      return true;
    });

  const hoyItems = visibleNotifications.filter((n) => n.section === 'hoy');
  const estaSemanaItems = visibleNotifications.filter((n) => n.section === 'esta_semana');
  const anterioresItems = visibleNotifications.filter((n) => n.section === 'anteriores');

  return (
    <div className="flex flex-col w-full pb-24 bg-[#FFF8F9] min-h-screen">
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#FFF8F9]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(87,28,49,0.04)]">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center text-[#181416] hover:text-[#B82E5F] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
            <GlowBuzzLogo variant="icon" size={26} />
            <h1 className="text-base font-bold text-[#181416] tracking-tight ml-1 truncate max-w-[200px]">
              Notificaciones
            </h1>
          </div>

          <div className="flex items-center gap-2">
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

      {/* Main Body */}
      <main className="flex-1 flex flex-col w-full pt-16 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Top Subtle Context Strip & Quick Actions */}
        <div className="flex items-center justify-between pt-3 pb-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex w-2 h-2 rounded-full ${
                unreadCount > 0 ? 'bg-[#B82E5F] animate-pulse' : 'bg-[#6C5961]/40'
              }`}
            />
            <span className="text-xs text-[#574145] font-medium">
              {unreadCount > 0 ? `${unreadCount} alertas sin leer` : 'Todo al día'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleMarkRead}
            className={`text-xs py-1 px-2 rounded-full font-semibold transition-colors ${
              isMarkedDone
                ? 'text-[#6C5961]'
                : 'text-[#B82E5F] hover:bg-[#F5DCE5]/50'
            }`}
          >
            {isMarkedDone ? 'Todo al día ✓' : 'Marcar todo leído'}
          </button>
        </div>

        {/* Horizontal Filter Pills */}
        <nav
          aria-label="Filtros de actividad"
          className="flex items-center gap-2 overflow-x-auto py-2 -mx-5 px-5 no-scrollbar"
        >
          <button
            type="button"
            onClick={() => setFilter('todas')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'todas'
                ? 'bg-[#B82E5F] text-white shadow-xs'
                : 'bg-[#EFE6E8] text-[#574145] hover:bg-[#F5DCE5]'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilter('turnos')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'turnos'
                ? 'bg-[#B82E5F] text-white shadow-xs'
                : 'bg-[#EFE6E8] text-[#574145] hover:bg-[#F5DCE5]'
            }`}
          >
            Turnos &amp; Citas
          </button>
          <button
            type="button"
            onClick={() => setFilter('espera')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              filter === 'espera'
                ? 'bg-[#B82E5F] text-white shadow-xs'
                : 'bg-[#EFE6E8] text-[#574145] hover:bg-[#F5DCE5]'
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#BA1A1A]" />
            <span>Lista de Espera</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('inspiracion')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'inspiracion'
                ? 'bg-[#B82E5F] text-white shadow-xs'
                : 'bg-[#EFE6E8] text-[#574145] hover:bg-[#F5DCE5]'
            }`}
          >
            Inspiración
          </button>
        </nav>

        {/* Notifications Feed */}
        <div className="flex flex-col gap-5 mt-2">
          {/* SECCIÓN: HOY */}
          {hoyItems.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-[#181416] tracking-tight">Hoy</h2>
                <span className="text-[10px] text-[#6C5961] uppercase tracking-wider font-bold">
                  Prioritarias
                </span>
              </div>

              {hoyItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-[#EAD8DE] transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon platter */}
                    <div
                      className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center relative ${
                        item.category === 'espera'
                          ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                          : 'bg-[#F5DCE5] text-[#571C31]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {item.category === 'espera' ? 'bolt' : 'event_upcoming'}
                      </span>
                      {item.unread && !isMarkedDone && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#BA1A1A] rounded-full ring-2 ring-white animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.category === 'espera'
                              ? 'bg-[#BA1A1A] text-white'
                              : 'bg-[#FFD9E0] text-[#3F0019]'
                          }`}
                        >
                          {item.tag}
                        </span>
                        <span className="text-[11px] text-[#6C5961]">{item.timeAgo}</span>
                      </div>

                      <p className="text-sm font-bold text-[#181416]">{item.title}</p>
                      <p className="text-xs text-[#574145] mt-0.5 leading-snug">
                        {item.body}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        {item.category === 'espera' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onOpenBooking({
                                  salonName: 'Studio Velvet Nails',
                                  serviceName: 'Kapping Gel (Turno liberado)',
                                  price: '$ 1.450',
                                  slot: 'Hoy 18:00 hs',
                                  provider: 'Timely',
                                });
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1"
                            >
                              <span>Aprovechar turno</span>
                              <span className="material-symbols-outlined text-[15px]">
                                arrow_forward
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleIgnore(item.id)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#6C5961] hover:text-[#181416]"
                            >
                              Ignorar
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center justify-between w-full pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate({
                                  name: 'look_detail',
                                  lookId: 'look-balayage-vainilla',
                                })
                              }
                              className="px-3 py-1.5 rounded-full bg-[#EFE6E8] hover:bg-[#F5DCE5] text-[#B82E5F] text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[15px]">info</span>
                              <span>Ver detalles</span>
                            </button>
                            <span className="text-[11px] text-[#6C5961] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                location_on
                              </span>
                              <span>Palermo Soho</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* SECCIÓN: ESTA SEMANA */}
          {estaSemanaItems.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-[#181416] tracking-tight">Esta semana</h2>
                <span className="text-[10px] text-[#6C5961] uppercase tracking-wider font-bold">
                  Comunidad
                </span>
              </div>

              {estaSemanaItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-[#EAD8DE] transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar or Icon */}
                    {item.thumbnail ? (
                      <div className="relative shrink-0 w-11 h-11 rounded-full overflow-hidden border border-[#F5DCE5]">
                        <img
                          src={item.thumbnail}
                          alt="Salón avatar"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#B82E5F] text-white rounded-full flex items-center justify-center text-[8px]">
                          ✓
                        </span>
                      </div>
                    ) : (
                      <div className="shrink-0 w-11 h-11 rounded-full bg-[#964F65] text-white flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          hotel_class
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5DCE5] text-[#571C31]">
                          {item.tag}
                        </span>
                        <span className="text-[11px] text-[#6C5961]">{item.timeAgo}</span>
                      </div>

                      <p className="text-sm font-bold text-[#181416]">{item.title}</p>
                      <p className="text-xs text-[#574145] mt-0.5 leading-snug">
                        {item.body}
                      </p>

                      {/* Photo Reel if present */}
                      {item.photoReel && (
                        <div
                          className="grid grid-cols-2 gap-2 mt-2.5 rounded-xl overflow-hidden cursor-pointer"
                          onClick={() =>
                            onNavigate({ name: 'salon_profile', salonId: 'brow-bar-atelier' })
                          }
                        >
                          {item.photoReel.map((pr, idx) => (
                            <div key={idx} className="relative h-20 bg-[#EFE6E8]">
                              <img
                                src={pr.image}
                                alt={pr.label}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold">
                                {pr.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Points badge if present */}
                      {item.pointsBadge && (
                        <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-[#F5EBEE]">
                          <span className="text-xs text-[#7A384D] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">stars</span>
                            <span>{item.pointsBadge}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onShowToast('¡Puntos aplicados a tu perfil!', 'stars')}
                            className="text-xs text-[#B82E5F] font-bold hover:underline"
                          >
                            Canjear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* SECCIÓN: ANTERIORES */}
          {anterioresItems.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-[#181416] tracking-tight">Anteriores</h2>
                <span className="text-[10px] text-[#6C5961] uppercase tracking-wider font-bold">
                  Descubrimientos
                </span>
              </div>

              {anterioresItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-[#EAD8DE] transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-[#F5DCE5] text-[#B82E5F] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFE6E8] text-[#574145]">
                          {item.tag}
                        </span>
                        <span className="text-[11px] text-[#6C5961]">{item.timeAgo}</span>
                      </div>

                      <p className="text-sm font-bold text-[#181416]">{item.title}</p>
                      <p className="text-xs text-[#574145] mt-0.5 leading-snug">
                        {item.body}
                      </p>

                      {/* Mini Salon Snippet Pill */}
                      <div className="mt-2.5 p-2 rounded-xl bg-[#FBF1F4] flex items-center justify-between gap-2 border border-[#F5EBEE]">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-[#FFD9E0] flex items-center justify-center text-[#B82E5F] text-[10px] font-bold">
                            1
                          </span>
                          <span className="text-xs text-[#181416] font-semibold truncate">
                            Studio Velvet Nails (4.9 ★)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate({
                              name: 'look_detail',
                              lookId: 'look-kapping-cherry',
                            })
                          }
                          className="px-2.5 py-1 rounded-full bg-white text-[#B82E5F] text-xs font-bold shadow-xs hover:bg-[#F5DCE5] transition-colors shrink-0"
                        >
                          Explorar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Empty state when no notifications */}
          {visibleNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-[#F5DCE5] text-[#B82E5F] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[28px]">notifications_paused</span>
              </div>
              <p className="text-base font-bold text-[#181416]">Sin novedades por aquí</p>
              <p className="text-xs text-[#6C5961] mt-1 max-w-[240px]">
                Estás al día con esta categoría. Te avisaremos en cuanto haya nueva actividad.
              </p>
            </div>
          )}

          {/* Friendly Footer Touch */}
          <div className="flex items-center justify-center gap-1.5 py-6 opacity-60">
            <span className="material-symbols-outlined text-[16px] text-[#6C5961]">spa</span>
            <span className="text-xs text-[#6C5961]">Fin de las novedades recientes</span>
          </div>
        </div>
      </main>
    </div>
  );
};
