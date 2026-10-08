import React, { useState } from 'react';
import { Salon, ActiveScreen } from '../types';
import { USER_AVATAR } from '../data/mockData';

interface SalonProfileViewProps {
  salon: Salon;
  initialTab?: string;
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
  onOpenBooking: (bookingDetails: {
    salonName: string;
    serviceName: string;
    price?: string;
    slot: string;
    provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  }) => void;
  onOpenChat: (salon: Salon) => void;
  onOpenLightbox: (imageUrl: string, caption?: string) => void;
  onOpenShare: (title: string, subtitle?: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const SalonProfileView: React.FC<SalonProfileViewProps> = ({
  salon,
  initialTab = 'trabajos',
  onNavigate,
  onBack,
  onOpenBooking,
  onOpenChat,
  onOpenLightbox,
  onOpenShare,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'trabajos' | 'clientes' | 'servicios' | 'resenas' | 'ubicacion'>(
    (initialTab as any) || 'trabajos'
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [favWorks, setFavWorks] = useState<string[]>([]);

  const handleFollowToggle = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    onShowToast(next ? `Ahora sigues a ${salon.name}` : `Dejaste de seguir a ${salon.name}`, 'person');
  };

  const toggleFavWork = (workId: string) => {
    setFavWorks((prev) =>
      prev.includes(workId) ? prev.filter((id) => id !== workId) : [...prev, workId]
    );
    onShowToast('Actualizado en tus tableros de inspiración', 'favorite');
  };

  const handleSelectService = (name: string, price: string) => {
    setSelectedService(name);
    setSelectedPrice(price);
    onShowToast(`Seleccionado: ${name}`, 'check');
    document.getElementById('booking-sheet')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConfirmBooking = () => {
    onOpenBooking({
      salonName: salon.name,
      serviceName: selectedService || 'Consulta & Servicio de Autor',
      price: selectedPrice || undefined,
      slot: salon.nextSlot,
      provider: salon.externalBookingProvider,
    });
  };

  const handleShare = () => {
    onOpenShare(salon.name, `${salon.neighborhood} · Salón Verificado en Glow Buzz`);
  };

  return (
    <div className="flex flex-col w-full pb-32 bg-[#FFF8F9] min-h-screen">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#FFF8F9]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(87,28,49,0.04)]">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center text-[#181416] hover:text-[#B82E5F] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
            <h1 className="text-base font-bold text-[#181416] tracking-tight ml-1 truncate max-w-[200px]">
              Perfil De Comercio
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartir"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#181416] hover:text-[#B82E5F] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
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
      <main className="flex-1 flex flex-col w-full pt-16 max-w-6xl mx-auto sm:px-6 lg:px-8">
        {/* Hero / Cover Image Section */}
        <div className="relative w-full h-56 bg-[#EFE6E8] overflow-hidden shadow-xs">
          <img
            src={salon.coverImage}
            alt={salon.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onOpenLightbox(salon.coverImage, salon.name)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px]">photo_camera</span>
              <span>Trabajo Real</span>
            </span>
          </div>
        </div>

        {/* Profile Identity Card (Overlapping Cover) */}
        <div className="relative -mt-10 px-5 flex flex-col z-10">
          <div className="bg-white rounded-3xl p-4 shadow-md border border-[#EAD8DE]/60 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              {/* Logo Emblem Avatar with Verified Icon */}
              <div className="relative -mt-12">
                <div className="w-20 h-20 rounded-full bg-[#FBF1F4] shadow-md overflow-hidden border-2 border-white">
                  <img
                    src={salon.logo}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#B82E5F] flex items-center justify-center text-white shadow-xs"
                  title="Verificado"
                >
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                    isFollowing
                      ? 'bg-[#B82E5F] text-white'
                      : 'bg-[#F5DCE5] text-[#571C31] hover:bg-[#F5DCE5]/80'
                  }`}
                >
                  {isFollowing ? 'Siguiendo' : '+ Seguir'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChat(salon)}
                  aria-label="Enviar mensaje directo"
                  className="w-9 h-9 rounded-full bg-[#EFE6E8] text-[#181416] flex items-center justify-center hover:text-[#B82E5F] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                </button>
              </div>
            </div>

            {/* Business Name & Verification Pill */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-[#181416] tracking-tight">
                {salon.name}
              </h2>
              <div className="inline-flex items-center gap-1.5 mt-1 self-start px-2.5 py-0.5 rounded-full bg-[#F5DCE5]/80 text-[#B82E5F] text-[10px] font-bold uppercase tracking-wider">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
                <span>Salón Verificado por Glow Buzz</span>
              </div>
            </div>

            {/* Bio / Specialties */}
            <p className="text-xs text-[#574145] leading-relaxed">
              {salon.bio}
            </p>

            {/* Location row (Clickable to jump to Map!) */}
            <button
              type="button"
              onClick={() => onNavigate({ name: 'explore', initialSalonId: salon.id })}
              className="flex items-start gap-1.5 text-xs text-[#574145] text-left hover:text-[#B82E5F] transition-colors group"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B82E5F] shrink-0 mt-0.5">
                location_on
              </span>
              <span>
                {salon.neighborhood} · {salon.address}{' '}
                <span className="text-[#B82E5F] font-semibold group-hover:underline">
                  ({salon.distance} · Ver en mapa)
                </span>
              </span>
            </button>

            {/* Social Proof / Mutuals */}
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#FBF1F4] text-xs text-[#181416]">
              {salon.mutualFollowers.length > 0 && (
                <div className="flex -space-x-2 shrink-0">
                  {salon.mutualFollowers.map((m, i) => (
                    <img
                      key={i}
                      src={m.avatar}
                      alt={m.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (m.userId) {
                          onNavigate({ name: 'user_profile', userId: m.userId });
                        }
                      }}
                      className="w-6 h-6 rounded-full object-cover border border-white cursor-pointer"
                    />
                  ))}
                </div>
              )}
              <p className="truncate text-[11px] text-[#574145]">
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'user_profile', userId: 'sofia-val' })}
                  className="text-[#B82E5F] font-semibold hover:underline mr-1"
                >
                  @sofia.val
                </button>
                y 2 personas que seguís son clientas habituales
              </p>
            </div>

            {/* Metrics Ribbon (Reseñas is clickable to switch to tab!) */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('resenas')}
                className="flex flex-col items-center p-2 rounded-xl bg-[#FBF1F4] hover:bg-[#F5EBEE] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[#181416] font-bold text-sm">
                  <span>{salon.rating.toFixed(1)}</span>
                  <span
                    className="material-symbols-outlined text-[15px] text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <span className="text-[10px] text-[#B82E5F] font-bold underline">
                  {salon.reviewsCount} reseñas
                </span>
              </button>

              <div className="flex flex-col items-center p-2 rounded-xl bg-[#FBF1F4]">
                <span className="font-bold text-sm text-[#181416]">
                  {salon.followersCount}
                </span>
                <span className="text-[10px] text-[#6C5961]">seguidoras</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-xl bg-[#FBF1F4]">
                <span className="font-bold text-sm text-[#181416]">
                  {salon.worksCount}
                </span>
                <span className="text-[10px] text-[#6C5961]">trabajos</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-12 gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  document.getElementById('booking-sheet')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="col-span-8 py-3 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Reservar turno</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'explore', initialSalonId: salon.id })}
                className="col-span-4 py-3 rounded-full bg-[#EFE6E8] text-[#181416] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors hover:bg-[#F5DCE5]"
              >
                <span className="material-symbols-outlined text-[17px] text-[#B82E5F]">map</span>
                <span>Mapa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Sticky Organizing Tabs */}
        <div className="sticky top-16 z-30 mt-4 bg-[#FFF8F9]/95 backdrop-blur-md px-5 py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'trabajos', label: 'Trabajos del Salón' },
              { id: 'clientes', label: '✨ Subidos por Clientes' },
              { id: 'servicios', label: 'Servicios & Precios' },
              { id: 'resenas', label: `Reseñas (${salon.reviewsCount})` },
              { id: 'ubicacion', label: 'Ubicación' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#B82E5F] text-white shadow-xs'
                      : 'bg-[#EFE6E8] text-[#574145] hover:bg-[#F5DCE5]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panels Container */}
        <div className="px-5 mt-4 flex flex-col gap-5">
          {/* TAB 1: Trabajos del Salón */}
          {activeTab === 'trabajos' && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#181416]">Portfolio de Autor</h3>
                  <p className="text-xs text-[#6C5961]">
                    Técnicas realizadas por el equipo técnico de {salon.name}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#B82E5F] uppercase tracking-wider">
                  {salon.portfolio.length} Looks
                </span>
              </div>

              {/* Multi-Column Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {salon.portfolio.map((work) => {
                  const isFav = favWorks.includes(work.id);
                  return (
                    <div key={work.id} className="flex flex-col gap-1.5 group">
                      <div
                        className="relative w-full aspect-[4/5] rounded-2xl bg-[#EFE6E8] overflow-hidden shadow-xs cursor-pointer"
                        onClick={() => {
                          if (work.lookId) {
                            onNavigate({ name: 'look_detail', lookId: work.lookId });
                          } else {
                            onNavigate({ name: 'look_detail', lookId: 'look-balayage-vainilla' });
                          }
                        }}
                      >
                        <img
                          src={work.image}
                          alt={work.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-white text-[9px] font-bold tracking-wider uppercase">
                          {work.technique}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavWork(work.id);
                          }}
                          aria-label="Favorito"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#181416] active:scale-75 transition-transform"
                        >
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={isFav ? { fontVariationSettings: "'FILL' 1", color: '#B82E5F' } : undefined}
                          >
                            favorite
                          </span>
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-between text-[#181416]">
                          <span className="text-xs font-bold text-[#B82E5F]">{work.price}</span>
                          <span className="text-[10px] text-[#6C5961]">{work.duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-col px-1">
                        <span className="text-xs font-bold text-[#181416] truncate">
                          {work.title}
                        </span>
                        <span className="text-[11px] text-[#6C5961]">{work.stylist}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* TAB 2: Subidos por Clientes */}
          {activeTab === 'clientes' && (
            <section className="flex flex-col gap-4">
              <div className="p-3.5 rounded-2xl bg-[#F5DCE5]/60 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#B82E5F] text-[24px] mt-0.5 shrink-0">
                  verified_user
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#25181E]">
                    Pruebas Reales de Clientas
                  </span>
                  <p className="text-[11px] text-[#534249] mt-0.5 leading-snug">
                    Selfies y fotos espontáneas subidas por personas con reserva completada y verificada en la app.
                  </p>
                </div>
              </div>

              {salon.clientProofs.map((proof) => (
                <div
                  key={proof.id}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-[#EAD8DE] flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        if (proof.userId) {
                          onNavigate({ name: 'user_profile', userId: proof.userId });
                        }
                      }}
                    >
                      <img
                        src={proof.clientAvatar}
                        alt={proof.clientName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#181416] hover:text-[#B82E5F]">
                            {proof.clientName}
                          </span>
                          <span
                            className="material-symbols-outlined text-[14px] text-[#B82E5F]"
                            title="Clienta Verificada"
                          >
                            check_circle
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6C5961]">
                          Tratamiento: {proof.treatment} · {proof.timeframe}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-xs font-bold text-[#181416]">
                        {proof.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="relative w-full h-60 rounded-xl overflow-hidden bg-[#EFE6E8] cursor-pointer"
                    onClick={() => onOpenLightbox(proof.image, `${proof.caption} (${proof.clientName})`)}
                  >
                    <img
                      src={proof.image}
                      alt={proof.caption}
                      className="w-full h-full object-cover hover:scale-103 transition-transform"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                      {proof.caption}
                    </div>
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white">
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#181416] leading-relaxed">
                    &ldquo;{proof.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#6C5961] pt-1 border-t border-[#F5EBEE]">
                    <button
                      type="button"
                      onClick={() => onShowToast('¡Te gusta esta reseña!', 'favorite')}
                      className="flex items-center gap-1 hover:text-[#B82E5F]"
                    >
                      <span className="material-symbols-outlined text-[16px]">favorite_border</span>
                      <span>{proof.likes}</span>
                    </button>
                    <span>·</span>
                    <span className="text-[#B82E5F] font-semibold">
                      Servicio: {proof.price}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* TAB 3: Servicios & Precios */}
          {activeTab === 'servicios' && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#181416]">Carta de Servicios</h3>
                <span className="text-xs text-[#B82E5F] font-medium">Precios en Pesos (ARS)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {salon.services.map((serv) => (
                  <div
                    key={serv.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#EAD8DE] shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#181416]">{serv.name}</span>
                      <span className="text-[11px] text-[#6C5961] mt-0.5 leading-snug">
                        {serv.description}
                      </span>
                      <span className="text-[11px] text-[#B82E5F] font-medium mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{serv.duration} {serv.includesNotes && `· ${serv.includesNotes}`}</span>
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <span className="text-sm font-bold text-[#B82E5F]">{serv.price}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectService(serv.name, serv.price)}
                        className="px-3 py-1 rounded-full bg-[#B82E5F] text-white text-xs font-bold active:scale-95 transition-transform"
                      >
                        Elegir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: Reseñas */}
          {activeTab === 'resenas' && (
            <section className="flex flex-col gap-4" id="section-resenas">
              <div className="p-4 rounded-2xl bg-white border border-[#EAD8DE] shadow-xs flex items-center gap-4">
                <div className="flex flex-col items-center justify-center shrink-0 pr-3 border-r border-[#F5EBEE]">
                  <span className="text-3xl font-black text-[#181416]">4.9</span>
                  <div className="flex text-amber-500 my-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#6C5961]">{salon.reviewsCount} valoraciones</span>
                </div>

                <div className="flex-1 flex flex-col gap-1 text-[11px] text-[#574145]">
                  <div className="flex items-center gap-2">
                    <span>5★</span>
                    <div className="flex-1 h-2 rounded-full bg-[#EFE6E8] overflow-hidden">
                      <div className="h-full bg-[#B82E5F] rounded-full" style={{ width: '92%' }} />
                    </div>
                    <span className="w-6 text-right">92%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>4★</span>
                    <div className="flex-1 h-2 rounded-full bg-[#EFE6E8] overflow-hidden">
                      <div className="h-full bg-[#B82E5F] rounded-full" style={{ width: '6%' }} />
                    </div>
                    <span className="w-6 text-right">6%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>3★</span>
                    <div className="flex-1 h-2 rounded-full bg-[#EFE6E8] overflow-hidden">
                      <div className="h-full bg-[#B82E5F] rounded-full" style={{ width: '2%' }} />
                    </div>
                    <span className="w-6 text-right">2%</span>
                  </div>
                </div>
              </div>

              {/* Review items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {salon.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-[#EAD8DE] shadow-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          if (rev.userId) {
                            onNavigate({ name: 'user_profile', userId: rev.userId });
                          }
                        }}
                      >
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#181416] hover:text-[#B82E5F]">
                            {rev.author}
                          </p>
                          <p className="text-[10px] text-[#6C5961]">
                            Cliente verificada · Reservó por Glow Buzz
                          </p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#574145] leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    {rev.photos && (
                      <div className="flex gap-2 mt-1">
                        {rev.photos.map((p, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 rounded-xl overflow-hidden border border-[#EAD8DE] cursor-pointer relative group"
                            onClick={() => onOpenLightbox(p, `Foto de reseña por ${rev.author}`)}
                          >
                            <img
                              src={p}
                              alt="Foto reseña"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: Ubicación interactiva en mapa */}
          {activeTab === 'ubicacion' && (
            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-base font-bold text-[#181416]">Ubicación del Estudio</h3>
                <p className="text-xs text-[#6C5961]">{salon.address}, {salon.neighborhood}</p>
              </div>

              {/* Static / Styled Map Image */}
              <div
                className="w-full h-60 bg-cover bg-center rounded-2xl shadow-xs relative overflow-hidden border border-[#EAD8DE] cursor-pointer"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLthwlRFG4pJH7AbbshQrLLXAFYgL60ii8DCesHqpLYOVr3aC1fBSqqn7mCspkHwF6gnyrTG4xsh529arv3jlRa1ee9bao40MkbXs_Eq3K-bCYuwSLVnOb4c_9WpXBCP2erVJzNnHBnRHj8ORblAbYhVlEy1A406e729oB78yK_oRqCyIY2ZhL4tbDSNIvhqpMbw98hgrDw3ylTdCCSPGidH_Kz188TLwakdJqL2IpPNXFOaNqIuea')`,
                }}
                onClick={() => onNavigate({ name: 'explore', initialSalonId: salon.id })}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#181416] text-xs font-bold shadow-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#B82E5F] text-[16px]">
                    near_me
                  </span>
                  <span>{salon.distance} · Ver en pantalla de mapa</span>
                </div>
              </div>

              {/* Horarios */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAD8DE] shadow-xs flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#181416]">Horarios de Atención</span>
                <div className="flex justify-between text-xs text-[#574145] py-1 border-b border-[#F5EBEE]">
                  <span>Martes a Viernes</span>
                  <span className="font-semibold text-[#181416]">{salon.openingHours.weekdays}</span>
                </div>
                <div className="flex justify-between text-xs text-[#574145] py-1 border-b border-[#F5EBEE]">
                  <span>Sábados</span>
                  <span className="font-semibold text-[#181416]">{salon.openingHours.saturday}</span>
                </div>
                <div className="flex justify-between text-xs text-[#574145] py-1">
                  <span>Domingos &amp; Lunes</span>
                  <span className="text-[#B82E5F] font-semibold">{salon.openingHours.sunday}</span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sticky Bottom Quick Booking Drawer Target */}
        <div className="mt-8 px-5" id="booking-sheet">
          <div className="p-4 rounded-3xl bg-[#EFE6E8]/70 backdrop-blur-md border border-[#F5DCE5] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#B82E5F] tracking-wider">
                  Disponibilidad Inmediata
                </span>
                <span className="text-sm font-bold text-[#181416]">
                  Próximo turno libre: {salon.nextSlot}
                </span>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {selectedService && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFD9E0] text-[#3F0019] text-xs font-semibold">
                <span>{selectedService} {selectedPrice && `(${selectedPrice})`}</span>
                <span className="material-symbols-outlined text-[15px]">check</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirmBooking}
              className="w-full py-3.5 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              <span>Reservar con Glow Buzz</span>
            </button>

            <p className="text-[11px] text-center text-[#6C5961]">
              Cancelación gratuita hasta 24 hs previas · Sin cobro por adelantado
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
