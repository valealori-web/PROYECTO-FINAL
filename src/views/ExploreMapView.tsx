import React, { useState, useRef, useEffect } from 'react';
import { Salon, Look, ActiveScreen, FilterOptions } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR } from '../data/mockData';

interface ExploreMapViewProps {
  salons: Salon[];
  looks?: Look[];
  onNavigate: (screen: ActiveScreen) => void;
  onBack?: () => void;
  canGoBack?: boolean;
  onOpenBooking: (bookingDetails: {
    salonName: string;
    serviceName: string;
    price?: string;
    slot: string;
    provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  }) => void;
  onOpenFilters: () => void;
  currentFilters?: FilterOptions;
  onShowToast: (msg: string, icon?: string) => void;
  unreadCount: number;
  initialSalonId?: string;
}

export const ExploreMapView: React.FC<ExploreMapViewProps> = ({
  salons,
  looks = [],
  onNavigate,
  onBack,
  canGoBack = false,
  onOpenBooking,
  onOpenFilters,
  currentFilters,
  onShowToast,
  unreadCount,
  initialSalonId,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>(
    initialSalonId || (salons.length > 0 ? salons[0].id : 'studio-velvet-nails')
  );
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'tomorrow' | 'high_rating'>('all');
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>('Todos');
  const carouselRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSalonId) {
      setSelectedPinId(initialSalonId);
      scrollToSalon(initialSalonId);
    }
  }, [initialSalonId]);

  const scrollToSalon = (salonId: string) => {
    setSelectedPinId(salonId);
    // Mobile carousel scroll
    const mobileCard = document.getElementById(`salon-card-mobile-${salonId}`);
    if (mobileCard) {
      mobileCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    // Desktop list scroll
    const desktopCard = document.getElementById(`salon-card-desktop-${salonId}`);
    if (desktopCard) {
      desktopCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleRecenter = () => {
    onShowToast('Ubicación centrada en Palermo Soho, Buenos Aires', 'my_location');
  };

  // Filter salons dynamically
  const filteredSalons = salons.filter((s) => {
    // Neighborhood filter
    if (activeNeighborhood !== 'Todos') {
      if (!s.neighborhood.toLowerCase().includes(activeNeighborhood.toLowerCase())) {
        return false;
      }
    }

    // Search query matching name, neighborhood, address, services, stylists
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchNeigh = s.neighborhood.toLowerCase().includes(q);
      const matchBio = s.bio.toLowerCase().includes(q);
      const matchServices = s.services.some(
        (srv) => srv.name.toLowerCase().includes(q) || srv.category.toLowerCase().includes(q)
      );
      const matchStylists = s.portfolio.some((p) => p.stylist.toLowerCase().includes(q));
      if (!matchName && !matchNeigh && !matchBio && !matchServices && !matchStylists) {
        return false;
      }
    }

    // Quick filter: Turnos mañana / hoy
    if (activeQuickFilter === 'tomorrow') {
      const hasTomorrow =
        s.nextSlot.toLowerCase().includes('mañana') || s.nextSlot.toLowerCase().includes('hoy');
      if (!hasTomorrow) return false;
    }

    // Quick filter: 4.8+ rating
    if (activeQuickFilter === 'high_rating') {
      if (s.rating < 4.8) return false;
    }

    // Advanced filters
    if (currentFilters) {
      if (currentFilters.category && currentFilters.category !== 'Todas') {
        const hasCategory = s.services.some((srv) =>
          srv.category.toLowerCase().includes(currentFilters.category.toLowerCase())
        );
        if (!hasCategory) return false;
      }
      if (currentFilters.minRating && s.rating < currentFilters.minRating) {
        return false;
      }
    }

    return true;
  });

  const selectedSalon =
    filteredSalons.find((s) => s.id === selectedPinId) ||
    filteredSalons[0] ||
    salons[0];

  const getMatchingLook = (salonId: string) => {
    return looks.find((l) => l.salonId === salonId);
  };

  const selectedLook = selectedSalon ? getMatchingLook(selectedSalon.id) : undefined;

  return (
    <div className="flex flex-col w-full pb-24 md:pb-24 bg-[#FFF8F3] min-h-screen">
      {/* Sticky Top Header - Responsive across Mobile and Desktop */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-[#FFF8F3]/90 backdrop-blur-xl border-b border-[#F5DCE5]/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Back button + Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {canGoBack && onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Volver atrás"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-[#181416] hover:text-[#B82E5F] hover:bg-[#F5DCE5]/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                </button>
              ) : null}
              <GlowBuzzLogo variant="header" size={30} />
              <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-[#F5DCE5]">
                <span className="material-symbols-outlined text-[17px] text-[#B82E5F]">map</span>
                <span className="text-xs font-bold text-[#571C31] tracking-wide uppercase">
                  Explorar Buenos Aires
                </span>
              </div>
            </div>

            {/* Desktop Center Quick Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-2">
              <div className="relative flex items-center w-full bg-[#FBF1F4] hover:bg-[#F5EBEE] focus-within:bg-white rounded-full px-4 py-2 border border-[#EAD8DE] focus-within:border-[#B82E5F] transition-all shadow-xs">
                <span className="material-symbols-outlined text-[#6C5961] text-[19px] mr-2">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar salones, Palermo, Recoleta, uñas, balayage..."
                  className="w-full bg-transparent text-[#181416] placeholder:text-[#6C5961] text-xs focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="text-[#6C5961] mr-1.5 hover:text-[#181416]"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenFilters}
                  aria-label="Filtros avanzados"
                  className="w-7 h-7 rounded-full bg-[#F5DCE5] hover:bg-[#B82E5F] text-[#571C31] hover:text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                </button>
              </div>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate({ name: 'notifications' })}
                aria-label="Notificaciones"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#181416] hover:text-[#B82E5F] hover:bg-[#F5DCE5]/40 transition-colors"
              >
                <span className="material-symbols-outlined text-[23px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B82E5F] ring-2 ring-[#FFF8F3]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'profile' })}
                className="rounded-full ring-2 ring-[#F5DCE5] hover:ring-[#B82E5F] overflow-hidden transition-all ml-0.5"
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
        </div>

        {/* Mobile Search input bar */}
        <div className="md:hidden px-4 pb-2 pt-0.5">
          <div className="relative flex items-center w-full bg-[#FBF1F4] rounded-full px-3.5 py-2 shadow-xs border border-[#EAD8DE] focus-within:border-[#B82E5F] focus-within:bg-white transition-all">
            <span className="material-symbols-outlined text-[#6C5961] text-[18px] mr-2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar salones, Palermo Soho, uñas..."
              className="w-full bg-transparent text-[#181416] placeholder:text-[#6C5961] text-xs focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#6C5961] mr-1.5 hover:text-[#181416]"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenFilters}
              aria-label="Filtrar salones"
              className="w-7 h-7 rounded-full bg-[#F5DCE5] flex items-center justify-center text-[#571C31] active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Ribbon (Mobile & Desktop) */}
        <div className="w-full border-t border-[#F5DCE5]/40 bg-[#FFF8F3]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuickFilter('all');
                    setActiveNeighborhood('Todos');
                    setSearchQuery('');
                    onShowToast('Mostrando todos los salones de Buenos Aires');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    activeQuickFilter === 'all' && activeNeighborhood === 'Todos' && !searchQuery
                      ? 'bg-[#B82E5F] text-white shadow-xs'
                      : 'bg-white text-[#574145] border border-[#DEBFC4]'
                  }`}
                >
                  Todos ({salons.length})
                </button>

                {/* Neighborhood chips */}
                {['Palermo Soho', 'Recoleta'].map((neigh) => {
                  const isActive = activeNeighborhood === neigh;
                  return (
                    <button
                      key={neigh}
                      type="button"
                      onClick={() => {
                        const next = isActive ? 'Todos' : neigh;
                        setActiveNeighborhood(next);
                        onShowToast(
                          next === 'Todos'
                            ? 'Mostrando todas las zonas'
                            : `Filtrando por ${neigh}`
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#B82E5F] text-white shadow-xs'
                          : 'bg-white text-[#574145] hover:bg-[#FBF1F4] border border-[#DEBFC4]'
                      }`}
                    >
                      {neigh}
                    </button>
                  );
                })}

                {/* Turnos Mañana / Inmediatos */}
                <button
                  type="button"
                  onClick={() => {
                    const next = activeQuickFilter === 'tomorrow' ? 'all' : 'tomorrow';
                    setActiveQuickFilter(next);
                    onShowToast(
                      next === 'tomorrow'
                        ? 'Salones con turnos inmediatos o mañana'
                        : 'Filtro de disponibilidad quitado'
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap shrink-0 text-xs font-semibold transition-all shadow-xs ${
                    activeQuickFilter === 'tomorrow'
                      ? 'bg-[#B82E5F] text-white'
                      : 'bg-[#F5DCE5] text-[#571C31] hover:bg-[#F5DCE5]/80'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeQuickFilter === 'tomorrow' ? 'bg-white' : 'bg-[#B82E5F] animate-pulse'
                    }`}
                  />
                  <span>Turnos mañana</span>
                </button>

                {/* Rating 4.8+ */}
                <button
                  type="button"
                  onClick={() => {
                    const next = activeQuickFilter === 'high_rating' ? 'all' : 'high_rating';
                    setActiveQuickFilter(next);
                    onShowToast(next === 'high_rating' ? 'Filtrando calificación 4.8+' : 'Filtro quitado');
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border whitespace-nowrap shrink-0 text-xs font-semibold transition-all shadow-xs ${
                    activeQuickFilter === 'high_rating'
                      ? 'bg-[#B82E5F] text-white border-[#B82E5F]'
                      : 'bg-white text-[#181416] border-[#DEBFC4]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[13px] text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>4.8+</span>
                </button>
              </div>

              {/* Mobile View Toggle Button (Map / List) */}
              <div className="md:hidden flex items-center shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() =>
                    setMobileViewMode((prev) => (prev === 'map' ? 'list' : 'map'))
                  }
                  className="px-2.5 py-1 rounded-full bg-white text-[#571C31] border border-[#DEBFC4] text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {mobileViewMode === 'map' ? 'format_list_bulleted' : 'map'}
                  </span>
                  <span>{mobileViewMode === 'map' ? 'Lista' : 'Mapa'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace: True Responsive Desktop (Split Layout) & Mobile View */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Results List & Cards (Desktop & Mobile List) */}
          {/* ======================================================== */}
          <div
            ref={listRef}
            className={`md:col-span-5 lg:col-span-5 flex flex-col gap-4 ${
              mobileViewMode === 'map' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B82E5F] animate-pulse" />
                <h2 className="text-sm font-bold text-[#181416] tracking-tight">
                  {filteredSalons.length} salones encontrados
                </h2>
              </div>
              <span className="text-xs text-[#6C5961]">Palermo &amp; Recoleta</span>
            </div>

            {/* List of Salon Cards */}
            <div className="flex flex-col gap-3.5">
              {filteredSalons.map((salon) => {
                const isSelected = selectedPinId === salon.id;
                const matchLook = getMatchingLook(salon.id);
                const leadService = salon.services[0] || {
                  name: 'Consulta & Asesoría',
                  price: '$ 1.500',
                  duration: '45 min',
                };

                return (
                  <article
                    key={salon.id}
                    id={`salon-card-desktop-${salon.id}`}
                    onMouseEnter={() => setSelectedPinId(salon.id)}
                    className={`bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border transition-all duration-300 shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-[#B82E5F] ring-2 ring-[#B82E5F]/30 bg-[#FFF8F9]'
                        : 'border-[#EAD8DE] hover:border-[#DEBFC4]'
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Image Thumbnail */}
                      <div
                        className="relative w-28 sm:w-32 h-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 cursor-pointer bg-[#F5EBEE]"
                        onClick={() =>
                          onNavigate({ name: 'salon_profile', salonId: salon.id })
                        }
                      >
                        <img
                          src={salon.coverImage}
                          alt={salon.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Verificado
                        </div>
                        {matchLook && (
                          <div className="absolute bottom-1.5 right-1.5 bg-[#B82E5F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            Inspo
                          </div>
                        )}
                      </div>

                      {/* Info & Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3
                              onClick={() =>
                                onNavigate({ name: 'salon_profile', salonId: salon.id })
                              }
                              className="text-sm font-bold text-[#181416] hover:text-[#B82E5F] cursor-pointer truncate transition-colors"
                            >
                              {salon.name}
                            </h3>
                          </div>

                          <p className="text-[11px] text-[#6C5961] flex items-center gap-1 mt-0.5 truncate">
                            <span className="material-symbols-outlined text-[13px] text-[#B82E5F]">
                              location_on
                            </span>
                            <span>{salon.neighborhood} · {salon.distance}</span>
                          </p>

                          {/* Highlighted Lead Service & Price */}
                          <div className="mt-2 p-1.5 rounded-xl bg-[#FBF1F4] flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#181416] truncate max-w-[150px]">
                              {leadService.name}
                            </span>
                            <span className="font-bold text-[#B82E5F] shrink-0">
                              {leadService.price}
                            </span>
                          </div>
                        </div>

                        {/* Ratings & Next slot */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F5EBEE] mt-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate({
                                name: 'salon_profile',
                                salonId: salon.id,
                                initialTab: 'resenas',
                              })
                            }
                            className="flex items-center gap-1 text-xs font-bold text-[#181416] hover:text-[#B82E5F] transition-colors"
                          >
                            <span
                              className="material-symbols-outlined text-[13px] text-amber-500"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>{salon.rating.toFixed(1)}</span>
                            <span className="text-[10px] text-[#6C5961] font-normal underline">
                              ({salon.reviewsCount})
                            </span>
                          </button>

                          <span className="text-[11px] font-semibold text-[#B82E5F] bg-[#F5DCE5] px-2 py-0.5 rounded-full truncate max-w-[120px]">
                            {salon.nextSlot}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons footer */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#F5EBEE]">
                      {matchLook ? (
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate({ name: 'look_detail', lookId: matchLook.id })
                          }
                          className="flex-1 py-1.5 px-3 rounded-full bg-[#F5DCE5] hover:bg-[#FFD9E0] text-[#571C31] text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>Ver look &amp; detalle</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate({ name: 'salon_profile', salonId: salon.id })
                          }
                          className="flex-1 py-1.5 px-3 rounded-full bg-[#F5DCE5] hover:bg-[#FFD9E0] text-[#571C31] text-xs font-bold transition-colors"
                        >
                          Ver perfil del salón
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onOpenBooking({
                            salonName: salon.name,
                            serviceName: leadService.name,
                            price: leadService.price,
                            slot: salon.nextSlot,
                            provider: salon.externalBookingProvider,
                          })
                        }
                        className="py-1.5 px-4 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        Reservar
                      </button>
                    </div>
                  </article>
                );
              })}

              {filteredSalons.length === 0 && (
                <div className="p-8 text-center bg-white rounded-3xl border border-[#EAD8DE]">
                  <span className="material-symbols-outlined text-4xl text-[#DEBFC4] mb-2">
                    explore_off
                  </span>
                  <p className="text-sm font-bold text-[#181416]">No hay salones con estos filtros</p>
                  <p className="text-xs text-[#6C5961] mt-1">
                    Probá cambiando el barrio o quitando el filtro de turnos.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuickFilter('all');
                      setActiveNeighborhood('Todos');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-4 py-1.5 rounded-full bg-[#B82E5F] text-white text-xs font-bold"
                  >
                    Restablecer búsqueda
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Interactive Buenos Aires Map (Desktop & Mobile) */}
          {/* ======================================================== */}
          <div
            className={`md:col-span-7 lg:col-span-7 flex flex-col ${
              mobileViewMode === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="sticky top-32 w-full h-[62vh] md:h-[calc(100vh-180px)] rounded-3xl overflow-hidden border border-[#DEBFC4] shadow-md relative bg-[#F5EFE6] select-none">
              {/* Buenos Aires Stylized Vector Map Canvas */}
              <div className="absolute inset-0 bg-[#F6F1EA]">
                {/* Detailed Street Grid Pattern */}
                <svg className="w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="street-grid-desktop" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D3C3BA" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#street-grid-desktop)" />
                  {/* Major Buenos Aires Thoroughfares */}
                  {/* Av. Santa Fe */}
                  <path d="M -50 140 Q 300 240 900 320" stroke="#DEBFC4" strokeWidth="5" fill="none" opacity="0.65" />
                  {/* Av. Corrientes */}
                  <path d="M 120 -50 L 520 850" stroke="#D3C3BA" strokeWidth="4" fill="none" opacity="0.6" />
                  {/* Av. Juan B Justo */}
                  <path d="M -50 420 L 900 360" stroke="#E292A9" strokeWidth="4" fill="none" opacity="0.65" />
                  {/* Av. del Libertador & Rio de la Plata shoreline curve */}
                  <path d="M 350 -50 Q 650 300 800 800" stroke="#C4B5A5" strokeWidth="6" fill="none" opacity="0.5" />
                  <path d="M 500 -50 Q 850 250 950 700" stroke="#87CEEB" strokeWidth="18" fill="none" opacity="0.25" />
                </svg>

                {/* Neighborhood Watermarks */}
                <div className="absolute top-[18%] left-[12%] text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#B82E5F]/20 pointer-events-none">
                  Colegiales
                </div>
                <div className="absolute top-[38%] left-[32%] text-sm md:text-base font-black uppercase tracking-widest text-[#B82E5F]/30 pointer-events-none">
                  Palermo Soho
                </div>
                <div className="absolute top-[48%] left-[15%] text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#B82E5F]/20 pointer-events-none">
                  Palermo Hollywood
                </div>
                <div className="absolute top-[32%] right-[16%] text-sm md:text-base font-black uppercase tracking-widest text-[#B82E5F]/30 pointer-events-none">
                  Recoleta
                </div>
                <div className="absolute bottom-[16%] right-[12%] text-xs md:text-sm font-bold uppercase tracking-widest text-[#B82E5F]/20 pointer-events-none">
                  Puerto Madero
                </div>
              </div>

              {/* Map Floating Controls Top */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-[#F5EBEE]">
                  <span className="w-2 h-2 rounded-full bg-[#B82E5F] animate-ping" />
                  <span className="text-xs font-bold text-[#181416]">
                    {filteredSalons.length} salones en mapa
                  </span>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleRecenter}
                  aria-label="Re-centrar en Buenos Aires"
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-[#181416] shadow-md flex items-center justify-center hover:bg-[#F5DCE5] active:scale-90 transition-all"
                  title="Centrar mapa en Palermo Soho"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#B82E5F]">
                    my_location
                  </span>
                </button>
              </div>

              {/* Interactive Map Pins (Responsive positions synced to filteredSalons) */}
              {filteredSalons.map((salon, idx) => {
                const isSelected = selectedPinId === salon.id;
                const leadService = salon.services[0] || {
                  name: 'Signature Care',
                  price: '$ 1.800',
                };

                const pinCoords =
                  salon.id === 'maison-hair-co'
                    ? { top: '38%', left: '42%' }
                    : salon.id === 'studio-velvet-nails'
                    ? { top: '48%', left: '50%' }
                    : salon.id === 'brow-bar-atelier'
                    ? { top: '30%', left: '34%' }
                    : salon.id === 'camila-v-makeup'
                    ? { top: '56%', left: '38%' }
                    : salon.id === 'lumiere-skin-spa'
                    ? { top: '30%', left: '74%' }
                    : {
                        top: `${28 + (idx * 15) % 50}%`,
                        left: `${25 + (idx * 20) % 60}%`,
                      };

                return (
                  <div
                    key={salon.id}
                    style={{ top: pinCoords.top, left: pinCoords.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-110 z-30' : 'opacity-90 hover:scale-105'
                    }`}
                    onClick={() => scrollToSalon(salon.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-white text-[#181416] shadow-xl border transition-all ${
                          isSelected
                            ? 'border-[#B82E5F] ring-4 ring-[#B82E5F]/30 bg-[#FFF8F9]'
                            : 'border-[#DEBFC4] hover:border-[#B82E5F]'
                        }`}
                      >
                        <img
                          src={salon.logo}
                          alt={salon.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#181416] leading-tight truncate max-w-[130px]">
                            {salon.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] text-[#B82E5F] font-bold leading-none">
                            {leadService.price}
                          </span>
                        </div>
                      </div>
                      <div className="w-0.5 h-2 bg-[#B82E5F]" />
                      <div className="w-3 h-3 rounded-full bg-[#B82E5F] flex items-center justify-center shadow-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pulsing User Current Location Marker (Palermo Soho) */}
              <div className="absolute top-[44%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-[#B82E5F]/20 animate-ping" />
                  <div className="w-4 h-4 rounded-full bg-[#B82E5F] shadow-md flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              {/* Selected Salon Preview Card Floating at Bottom of Map (Desktop & Mobile) */}
              {selectedSalon && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl border border-[#F5DCE5] flex items-center gap-3 sm:gap-4 max-w-xl mx-auto">
                    <img
                      src={selectedSalon.coverImage}
                      alt={selectedSalon.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover shrink-0 cursor-pointer shadow-xs"
                      onClick={() =>
                        onNavigate({ name: 'salon_profile', salonId: selectedSalon.id })
                      }
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4
                            onClick={() =>
                              onNavigate({ name: 'salon_profile', salonId: selectedSalon.id })
                            }
                            className="text-xs sm:text-sm font-bold text-[#181416] hover:text-[#B82E5F] cursor-pointer truncate"
                          >
                            {selectedSalon.name}
                          </h4>
                          <p className="text-[11px] text-[#6C5961] truncate">
                            {selectedSalon.neighborhood} · {selectedSalon.distance}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-[#B82E5F] shrink-0">
                          {selectedSalon.services[0]?.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {selectedLook ? (
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate({ name: 'look_detail', lookId: selectedLook.id })
                            }
                            className="px-3 py-1 rounded-full bg-[#F5DCE5] hover:bg-[#FFD9E0] text-[#571C31] text-[11px] font-bold transition-colors flex items-center gap-1"
                          >
                            <span>Ver trabajo real</span>
                            <span className="material-symbols-outlined text-[13px]">
                              arrow_forward
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate({
                                name: 'salon_profile',
                                salonId: selectedSalon.id,
                              })
                            }
                            className="px-3 py-1 rounded-full bg-[#F5DCE5] hover:bg-[#FFD9E0] text-[#571C31] text-[11px] font-bold transition-colors"
                          >
                            Ver comercio
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            onOpenBooking({
                              salonName: selectedSalon.name,
                              serviceName:
                                selectedSalon.services[0]?.name || 'Turno de consulta',
                              price: selectedSalon.services[0]?.price,
                              slot: selectedSalon.nextSlot,
                              provider: selectedSalon.externalBookingProvider,
                            })
                          }
                          className="px-3.5 py-1 rounded-full bg-[#B82E5F] hover:bg-[#971047] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0"
                        >
                          Reservar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Carousel of Cards when Map View is active */}
            <div className="md:hidden mt-3">
              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto no-scrollbar px-1 snap-x snap-mandatory pb-2"
              >
                {filteredSalons.map((salon) => {
                  const isSelected = selectedPinId === salon.id;
                  const matchLook = getMatchingLook(salon.id);
                  const leadService = salon.services[0] || {
                    name: 'Tratamiento Signature',
                    price: '$ 1.450',
                  };

                  return (
                    <div
                      key={salon.id}
                      id={`salon-card-mobile-${salon.id}`}
                      className={`snap-start shrink-0 w-[82vw] max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${
                        isSelected
                          ? 'border-[#B82E5F] ring-2 ring-[#B82E5F]/30'
                          : 'border-[#EAD8DE]'
                      }`}
                    >
                      <div
                        className="relative h-36 w-full overflow-hidden cursor-pointer"
                        onClick={() =>
                          onNavigate({ name: 'salon_profile', salonId: salon.id })
                        }
                      >
                        <img
                          src={salon.coverImage}
                          alt={salon.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          <span>Trabajo Real</span>
                        </div>
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-xs font-semibold truncate max-w-[180px]">
                            {leadService.name}
                          </span>
                          <span className="text-xs font-bold">{leadService.price}</span>
                        </div>
                      </div>

                      <div className="p-3 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4
                              onClick={() =>
                                onNavigate({ name: 'salon_profile', salonId: salon.id })
                              }
                              className="text-xs font-bold text-[#181416] truncate"
                            >
                              {salon.name}
                            </h4>
                            <p className="text-[10px] text-[#6C5961] truncate">
                              {salon.neighborhood} · {salon.distance}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                            ★ {salon.rating.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F5EBEE]">
                          {matchLook ? (
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate({ name: 'look_detail', lookId: matchLook.id })
                              }
                              className="text-xs font-semibold text-[#B82E5F] flex items-center gap-0.5 hover:underline"
                            >
                              <span>Ver look</span>
                              <span className="material-symbols-outlined text-[13px]">
                                arrow_forward
                              </span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#571C31] font-semibold">
                              {salon.nextSlot}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              onOpenBooking({
                                salonName: salon.name,
                                serviceName: leadService.name,
                                price: leadService.price,
                                slot: salon.nextSlot,
                                provider: salon.externalBookingProvider,
                              })
                            }
                            className="px-3 py-1 rounded-full bg-[#B82E5F] text-white text-xs font-bold shadow-xs active:scale-95"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
