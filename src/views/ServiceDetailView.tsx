import React, { useState } from 'react';
import { Look, Salon, ActiveScreen } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR } from '../data/mockData';

interface ServiceDetailViewProps {
  look: Look;
  salon: Salon;
  isSaved: boolean;
  onToggleSave: (lookId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
  onOpenBooking: (bookingDetails: {
    salonName: string;
    serviceName: string;
    stylistName?: string;
    price?: string;
    slot: string;
    provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  }) => void;
  onOpenLightbox: (imageUrl: string, caption?: string) => void;
  onOpenShare: (title: string, subtitle?: string, url?: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  look,
  salon,
  isSaved,
  onToggleSave,
  onNavigate,
  onBack,
  onOpenBooking,
  onOpenLightbox,
  onOpenShare,
  onShowToast,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('Mañana 15:30 hs');
  const [isFollowing, setIsFollowing] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const images =
    look.images.length > 0
      ? look.images
      : [
          {
            url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
            alt: look.title,
            caption: 'Resultado en estudio',
          },
        ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleFollowToggle = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    onShowToast(
      next ? `Ahora sigues a ${salon.name}` : `Dejaste de seguir a ${salon.name}`,
      'person'
    );
  };

  const handleShareClick = () => {
    onOpenShare(
      `${look.title} en ${salon.name}`,
      `Descubrí este trabajo real en Glow Buzz · ${look.price}`
    );
  };

  const handleBookingClick = () => {
    onOpenBooking({
      salonName: salon.name,
      serviceName: look.title,
      stylistName: look.stylistName || 'Equipo técnico',
      price: look.specs.estimatedPrice || look.price,
      slot: selectedSlot,
      provider: salon.externalBookingProvider,
    });
  };

  return (
    <div className="flex flex-col w-full pb-44 md:pb-24 bg-[#FFF8F3] min-h-screen">
      {/* Sticky Top Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#FFF8F3]/90 backdrop-blur-xl border-b border-[#F5DCE5]/60">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#181416] hover:text-[#B82E5F] hover:bg-[#F5DCE5]/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
            <GlowBuzzLogo variant="icon" size={26} />
            <h1 className="text-sm sm:text-base font-bold text-[#181416] tracking-tight ml-1 truncate max-w-[220px] sm:max-w-md">
              Detalle del Servicio
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareClick}
              aria-label="Compartir look"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#181416] hover:text-[#B82E5F] hover:bg-[#F5DCE5]/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleSave(look.id)}
              aria-label="Guardar look"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isSaved ? 'text-[#B82E5F]' : 'text-[#181416] hover:text-[#B82E5F]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {isSaved ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'profile' })}
              className="rounded-full ring-2 ring-[#F5DCE5] hover:ring-[#B82E5F] overflow-hidden ml-1"
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

      {/* Main Container - Split Responsive on Desktop */}
      <main className="flex-1 w-full pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Media Showcase, Specs, Reviews, Similars   */}
          {/* ======================================================== */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Visual Showcase Carousel Section */}
            <section className="relative w-full rounded-3xl overflow-hidden bg-[#FBF1F4] shadow-sm border border-[#EAD8DE]">
              <div
                className="relative w-full h-[380px] sm:h-[460px] overflow-hidden select-none group touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Carousel Track */}
                <div
                  className="flex w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="w-full h-full shrink-0 relative">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => onOpenLightbox(img.url, img.caption)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                        <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <span className="material-symbols-outlined text-[14px] text-[#FFD9E0]">
                            photo_camera
                          </span>
                          <span>{img.caption}</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                          {idx + 1} / {images.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Imagen anterior"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 active:scale-90 transition-all z-20"
                    >
                      <span className="material-symbols-outlined text-[22px]">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Siguiente imagen"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 active:scale-90 transition-all z-20"
                    >
                      <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                    </button>
                  </>
                )}

                {/* Verified badge floating pill */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white shadow-md">
                    <span
                      className="material-symbols-outlined text-[15px] text-[#FFB1C6]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Trabajo real verificado
                    </span>
                  </div>
                </div>

                {/* Zoom / Fullscreen Button */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenLightbox(images[currentSlide].url, images[currentSlide].caption)
                  }
                  aria-label="Ver imagen en grande"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </button>

                {/* Slide Navigation Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Foto ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 bg-white border-t border-[#EAD8DE] overflow-x-auto no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        currentSlide === idx
                          ? 'border-[#B82E5F] ring-2 ring-[#B82E5F]/30 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Social & Engagement Metrics Strip */}
            <section className="px-4 py-3 bg-[#F5EBEE] rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden items-center">
                  <div className="w-6 h-6 rounded-full bg-[#FFD9E0] flex items-center justify-center text-[9px] font-bold text-[#3F0019]">
                    ML
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#F5DCE5] flex items-center justify-center text-[9px] font-bold text-[#25181E]">
                    CV
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#FFD9E1] flex items-center justify-center text-[9px] font-bold text-[#3B051B]">
                    AR
                  </div>
                </div>
                <p className="text-xs font-semibold text-[#181416]">
                  {look.savedCount} usuarias guardaron este look
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSave(look.id)}
                  aria-label="Guardar look"
                  className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs active:scale-90 transition-all ${
                    isSaved ? 'text-[#B82E5F]' : 'text-[#181416] hover:text-[#B82E5F]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {isSaved ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleShareClick}
                  aria-label="Compartir look"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#181416] hover:text-[#B82E5F] active:scale-90 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">ios_share</span>
                </button>
              </div>
            </section>

            {/* Key Specs Bento Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl flex flex-col justify-between border border-[#EAD8DE] shadow-xs">
                <div className="flex items-center gap-1 text-[#B82E5F] mb-1">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Estimado</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#181416]">
                    {look.specs.estimatedPrice}
                  </span>
                  <span className="block text-[11px] text-[#6C5961]">según volumen</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl flex flex-col justify-between border border-[#EAD8DE] shadow-xs">
                <div className="flex items-center gap-1 text-[#7A384D] mb-1">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Sesión</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#181416]">
                    {look.specs.sessionDuration}
                  </span>
                  <span className="block text-[11px] text-[#6C5961]">Paso a paso</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl flex flex-col justify-between border border-[#EAD8DE] shadow-xs">
                <div className="flex items-center gap-1 text-[#571C31] mb-1">
                  <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Mantenimiento
                  </span>
                </div>
                <div>
                  <span className="text-base font-bold text-[#181416]">
                    {look.specs.products || 'Productos de salón'}
                  </span>
                  <span className="block text-[11px] text-[#6C5961]">Calidad profesional</span>
                </div>
              </div>
            </section>

            {/* Service Description & Steps */}
            <section className="bg-white p-5 rounded-3xl border border-[#EAD8DE] shadow-xs flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#571C31]">
                Detalles del Tratamiento
              </h3>
              <p className="text-xs sm:text-sm text-[#574145] leading-relaxed">
                {look.description}
              </p>
              <div className="mt-2 pt-3 border-t border-[#F5EBEE] flex flex-col gap-2">
                <span className="text-xs font-bold text-[#181416]">Garantía del servicio:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBF1F4] text-xs text-[#574145]">
                    <span className="material-symbols-outlined text-[#B82E5F] text-[16px]">verified</span>
                    <span>Técnicas 100% verificadas</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBF1F4] text-xs text-[#574145]">
                    <span className="material-symbols-outlined text-[#B82E5F] text-[16px]">auto_awesome</span>
                    <span>{look.specs.products || 'Productos premium'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Client Reviews Section with Large Image Zoom */}
            {look.clientReviews.length > 0 && (
              <section className="bg-white p-5 rounded-3xl border border-[#EAD8DE] shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#181416]">Resultados de clientas</h3>
                    <p className="text-xs text-[#6C5961]">
                      Fotos y opiniones reales (tocá las fotos para verlas en grande)
                    </p>
                  </div>
                  <span className="bg-[#FFD9E0] text-[#3F0019] text-xs font-bold px-3 py-1 rounded-full">
                    ★ 4.9 / 5.0
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {look.clientReviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F5EBEE] flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer"
                          onClick={() => {
                            if (rev.userId) {
                              onNavigate({ name: 'user_profile', userId: rev.userId });
                            }
                          }}
                        >
                          <img
                            src={rev.clientAvatar}
                            alt={rev.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#181416] hover:text-[#B82E5F]">
                              {rev.clientName}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="flex text-amber-500">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <span
                                    key={i}
                                    className="material-symbols-outlined text-[13px]"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                              <span className="text-[10px] text-[#6C5961]">{rev.date}</span>
                            </div>
                          </div>
                        </div>
                        {rev.verified && (
                          <span className="bg-[#F5DCE5] text-[#571C31] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Cliente Verificada
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#574145] leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      {rev.photos && rev.photos.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {rev.photos.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className="w-16 h-16 rounded-xl overflow-hidden border border-[#EAD8DE] cursor-pointer relative group"
                              onClick={() =>
                                onOpenLightbox(p, `Resultado real por ${rev.clientName}`)
                              }
                            >
                              <img
                                src={p}
                                alt="Resultado real"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <span className="material-symbols-outlined text-[16px]">
                                  zoom_in
                                </span>
                              </div>
                            </div>
                          ))}
                          {rev.highlightTag && (
                            <div className="flex flex-col justify-center pl-1 text-xs text-[#574145]">
                              <span className="font-semibold text-[#B82E5F]">
                                {rev.highlightTag}
                              </span>
                              <span className="text-[11px] text-[#6C5961]">Puntualidad 10/10</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Similar Works Section */}
            {look.similarLooks.length > 0 && (
              <section className="bg-white p-5 rounded-3xl border border-[#EAD8DE] shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#181416]">Trabajos similares</h3>
                    <p className="text-xs text-[#6C5961]">
                      Tocá una tarjeta para ver su detalle completo
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ name: 'explore' })}
                    className="text-xs font-semibold text-[#B82E5F] hover:underline"
                  >
                    Explorar mapa →
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {look.similarLooks.map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => onNavigate({ name: 'look_detail', lookId: sim.id })}
                      className="min-w-[190px] w-[190px] shrink-0 bg-[#FFF8F9] rounded-2xl overflow-hidden border border-[#EAD8DE] flex flex-col cursor-pointer hover:shadow-md transition-all group"
                    >
                      <div className="relative h-36 w-full overflow-hidden">
                        <img
                          src={sim.image}
                          alt={sim.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {sim.tag}
                        </div>
                      </div>
                      <div className="p-3 flex flex-col justify-between flex-1">
                        <div>
                          <p className="text-xs font-bold text-[#181416] line-clamp-1 group-hover:text-[#B82E5F]">
                            {sim.title}
                          </p>
                          <p className="text-[11px] text-[#6C5961]">
                            {sim.salon} • {sim.price}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#F5EBEE]">
                          <span className="text-[10px] font-bold text-[#B82E5F]">
                            ★ {sim.rating}
                          </span>
                          <span className="text-xs font-semibold text-[#B82E5F] flex items-center gap-0.5">
                            Ver detalle
                            <span className="material-symbols-outlined text-[13px]">
                              arrow_forward
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Sticky Booking & Salon Card (Desktop & Mobile) */}
          {/* ======================================================== */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="md:sticky md:top-24 flex flex-col gap-4">
              {/* Header card with Title and Price */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAD8DE] shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F5DCE5] text-[#571C31] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {look.categoryLabel}
                  </span>
                  {look.highDemand && (
                    <span className="bg-[#EFE6E8] text-[#574145] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B82E5F] animate-pulse" />
                      Alta Demanda
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#181416] tracking-tight leading-snug">
                  {look.title}
                </h2>

                <div className="flex items-baseline justify-between pt-1 border-t border-[#F5EBEE]">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#B82E5F]">
                      {look.price}
                    </span>
                    <span className="text-xs text-[#6C5961] ml-2">precio estimado</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <span>★ {look.rating}</span>
                    <span className="text-[#6C5961] font-normal">({look.reviewsCount})</span>
                  </div>
                </div>

                {/* Slot Selector */}
                <div className="mt-2 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-[#181416]">Elegí fecha y horario:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['Mañana 15:30 hs', 'Jueves 11:00 hs', 'Viernes 17:00 hs', 'Sábado 10:30 hs'].map(
                      (slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-left ${
                              isSelected
                                ? 'bg-[#B82E5F] text-white border-[#B82E5F] shadow-xs'
                                : 'bg-[#FBF1F4] text-[#181416] border-[#EAD8DE] hover:border-[#DEBFC4]'
                            }`}
                          >
                            <span className="block text-[10px] opacity-80 uppercase">Turno</span>
                            <span className="block font-bold">{slot}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Primary Booking Button */}
                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="w-full py-3.5 px-4 mt-2 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[19px]">calendar_month</span>
                  <span>Reservar con Glow Buzz</span>
                </button>

                <p className="text-[11px] text-[#6C5961] text-center">
                  Reserva con derivación oficial a la agenda de {salon.name}
                </p>
              </div>

              {/* Salon Profile Card */}
              <div className="bg-white p-5 rounded-3xl border border-[#EAD8DE] shadow-xs flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onNavigate({ name: 'salon_profile', salonId: salon.id })}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={salon.logo}
                        alt={salon.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#F5DCE5]"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#B82E5F] rounded-full flex items-center justify-center text-white text-[9px]">
                        <span className="material-symbols-outlined text-[10px]">check</span>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#181416] hover:text-[#B82E5F] transition-colors">
                        {salon.name}
                      </h3>
                      {look.stylistName && (
                        <p className="text-xs text-[#574145]">
                          Especialista: <strong>{look.stylistName}</strong>
                        </p>
                      )}
                      <div
                        className="flex items-center gap-1 mt-0.5 cursor-pointer hover:underline text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate({
                            name: 'salon_profile',
                            salonId: salon.id,
                            initialTab: 'resenas',
                          });
                        }}
                      >
                        <span className="font-bold text-amber-600">★ {salon.rating.toFixed(1)}</span>
                        <span className="text-[#6C5961]">· {salon.reviewsCount} reseñas</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    className={`px-3 py-1 rounded-full text-xs font-semibold active:scale-95 transition-all shrink-0 ${
                      isFollowing
                        ? 'bg-[#B82E5F] text-white shadow-xs'
                        : 'bg-[#F5DCE5] text-[#571C31] hover:bg-[#F5DCE5]/80'
                    }`}
                  >
                    {isFollowing ? 'Siguiendo' : '+ Seguir'}
                  </button>
                </div>

                {/* Location with map shortcut */}
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'explore', initialSalonId: salon.id })}
                  className="w-full bg-[#FBF1F4] hover:bg-[#F5DCE5]/60 p-2.5 rounded-xl flex items-center gap-2 text-[#574145] text-left transition-colors"
                >
                  <span className="material-symbols-outlined text-[#B82E5F] text-[18px] shrink-0">
                    location_on
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#181416] truncate">
                      {salon.address}, {salon.neighborhood}
                    </p>
                    <p className="text-[11px] text-[#B82E5F] font-medium">
                      {salon.distance} · Ver en mapa de Buenos Aires
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-[#6C5961]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Booking Bar (Hidden on desktop) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#FFF8F9]/95 backdrop-blur-md border-t border-[#F5DCE5] px-4 py-2.5 shadow-[0_-4px_12px_rgba(87,28,49,0.06)] md:hidden">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#6C5961]">Turno elegido</span>
            <span className="text-xs font-bold text-[#181416] truncate max-w-[130px]">
              {selectedSlot}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBookingClick}
            className="flex-1 py-3 px-4 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-transform flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">calendar_month</span>
            <span>Reservar con Glow Buzz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
