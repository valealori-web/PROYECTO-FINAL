import React, { useState, useRef, useEffect } from 'react';
import { Salon, Look, ActiveScreen, FilterOptions } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR } from '../data/mockData';
import { CityMap } from '../components/CityMap';
import { parseMaxDistance } from '../lib/geo';
import type { useUserLocation } from '../lib/useUserLocation';

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
  userLocation?: ReturnType<typeof useUserLocation>;
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
  userLocation,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>(
    initialSalonId || (salons.length > 0 ? salons[0].id : 'studio-velvet-nails')
  );
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'tomorrow' | 'high_rating'>('all');
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>('Todos');
  const [recenterToken, setRecenterToken] = useState(0);
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
    setRecenterToken((n) => n + 1);
    if (userLocation && userLocation.isFallback) userLocation.locate();
    onShowToast(
      userLocation && !userLocation.isFallback
        ? 'Mostrando los salones cerca tuyo'
        : 'Mostrando todos los salones en el mapa',
      'my_location'
    );
  };

  // Barrios/ciudades reales, derivados de los salones (ordenados por cantidad)
  const neighborhoods = Object.entries(
    salons.reduce<Record<string, number>>((acc, s) => {
      acc[s.neighborhood] = (acc[s.neighborhood] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);

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
      const maxKm = parseMaxDistance(currentFilters.maxDistance);
      if (maxKm !== null && s.distanceKm !== null && s.distanceKm > maxKm) return false;
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
    <div className="flex flex-col w-full pb-24 md:pb-24 bg-[#FFFFFF] min-h-screen">
      {/* Sticky Top Header - Responsive across Mobile and Desktop */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#F1F1F1]/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Back button + Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {canGoBack && onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Volver atrás"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-[#111111] hover:text-[#111111] hover:bg-[#F1F1F1]/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                </button>
              ) : null}
              <GlowBuzzLogo variant="header" size={30} />
            </div>

            {/* Desktop Center Quick Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-2">
              <div className="relative flex items-center w-full bg-[#F7F7F7] hover:bg-[#F4F4F4] focus-within:bg-white rounded-full px-4 py-2 border border-[#E5E5E5] focus-within:border-[#111111] transition-all shadow-xs">
                <span className="material-symbols-outlined text-[#6B6B6B] text-[19px] mr-2">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar salones, Pocitos, Carrasco, uñas, balayage..."
                  className="w-full bg-transparent text-[#111111] placeholder:text-[#6B6B6B] text-xs focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="text-[#6B6B6B] mr-1.5 hover:text-[#111111]"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenFilters}
                  aria-label="Filtros avanzados"
                  className="w-7 h-7 rounded-full bg-[#F1F1F1] hover:bg-[#111111] text-[#111111] hover:text-white flex items-center justify-center transition-colors shrink-0"
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
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#111111] hover:text-[#111111] hover:bg-[#F1F1F1]/40 transition-colors"
              >
                <span className="material-symbols-outlined text-[23px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#111111] ring-2 ring-[#FFFFFF]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'profile' })}
                className="rounded-full ring-2 ring-[#F1F1F1] hover:ring-[#111111] overflow-hidden transition-all ml-0.5"
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
          <div className="relative flex items-center w-full bg-[#F7F7F7] rounded-full px-3.5 py-2 shadow-xs border border-[#E5E5E5] focus-within:border-[#111111] focus-within:bg-white transition-all">
            <span className="material-symbols-outlined text-[#6B6B6B] text-[18px] mr-2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar salones, Pocitos, uñas..."
              className="w-full bg-transparent text-[#111111] placeholder:text-[#6B6B6B] text-xs focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#6B6B6B] mr-1.5 hover:text-[#111111]"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenFilters}
              aria-label="Filtrar salones"
              className="w-7 h-7 rounded-full bg-[#F1F1F1] flex items-center justify-center text-[#111111] active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Ribbon (Mobile & Desktop) */}
        <div className="w-full border-t border-[#F1F1F1]/40 bg-[#FFFFFF]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuickFilter('all');
                    setActiveNeighborhood('Todos');
                    setSearchQuery('');
                    onShowToast('Mostrando todos los salones de Montevideo');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    activeQuickFilter === 'all' && activeNeighborhood === 'Todos' && !searchQuery
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-white text-[#444444] border border-[#D9D9D9]'
                  }`}
                >
                  Todos ({salons.length})
                </button>

                {/* Neighborhood chips */}
                {neighborhoods.map((neigh) => {
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
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'bg-white text-[#444444] hover:bg-[#F7F7F7] border border-[#D9D9D9]'
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
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F1F1F1] text-[#111111] hover:bg-[#F1F1F1]/80'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeQuickFilter === 'tomorrow' ? 'bg-white' : 'bg-[#111111] animate-pulse'
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
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#111111] border-[#D9D9D9]'
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
                  className="px-2.5 py-1 rounded-full bg-white text-[#111111] border border-[#D9D9D9] text-xs font-bold flex items-center gap-1 shadow-xs"
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
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111] animate-pulse" />
                <h2 className="text-sm font-bold text-[#111111] tracking-tight">
                  {filteredSalons.length} salones encontrados
                </h2>
              </div>
              <span className="text-xs text-[#6B6B6B]">Montevideo</span>
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
                        ? 'border-[#111111] ring-2 ring-[#111111]/30 bg-[#FFFFFF]'
                        : 'border-[#E5E5E5] hover:border-[#D9D9D9]'
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Image Thumbnail */}
                      <div
                        className="relative w-28 sm:w-32 h-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 cursor-pointer bg-[#F4F4F4]"
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
                          <div className="absolute bottom-1.5 right-1.5 bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
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
                              className="text-sm font-bold text-[#111111] hover:text-[#111111] cursor-pointer truncate transition-colors"
                            >
                              {salon.name}
                            </h3>
                          </div>

                          <p className="text-[11px] text-[#6B6B6B] flex items-center gap-1 mt-0.5 truncate">
                            <span className="material-symbols-outlined text-[13px] text-[#111111]">
                              location_on
                            </span>
                            <span>{salon.neighborhood} · {salon.distance}</span>
                          </p>

                          {/* Highlighted Lead Service & Price */}
                          <div className="mt-2 p-1.5 rounded-xl bg-[#F7F7F7] flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#111111] truncate max-w-[150px]">
                              {leadService.name}
                            </span>
                            <span className="font-bold text-[#111111] shrink-0">
                              {leadService.price}
                            </span>
                          </div>
                        </div>

                        {/* Ratings & Next slot */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F4F4F4] mt-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate({
                                name: 'salon_profile',
                                salonId: salon.id,
                                initialTab: 'resenas',
                              })
                            }
                            className="flex items-center gap-1 text-xs font-bold text-[#111111] hover:text-[#111111] transition-colors"
                          >
                            <span
                              className="material-symbols-outlined text-[13px] text-amber-500"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>{salon.rating.toFixed(1)}</span>
                            <span className="text-[10px] text-[#6B6B6B] font-normal underline">
                              ({salon.reviewsCount})
                            </span>
                          </button>

                          <span className="text-[11px] font-semibold text-[#111111] bg-[#F1F1F1] px-2 py-0.5 rounded-full truncate max-w-[120px]">
                            {salon.nextSlot}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons footer */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#F4F4F4]">
                      {matchLook ? (
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate({ name: 'look_detail', lookId: matchLook.id })
                          }
                          className="flex-1 py-1.5 px-3 rounded-full bg-[#F1F1F1] hover:bg-[#E5E5E5] text-[#111111] text-xs font-bold transition-colors flex items-center justify-center gap-1"
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
                          className="flex-1 py-1.5 px-3 rounded-full bg-[#F1F1F1] hover:bg-[#E5E5E5] text-[#111111] text-xs font-bold transition-colors"
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
                        className="py-1.5 px-4 rounded-full bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        Reservar
                      </button>
                    </div>
                  </article>
                );
              })}

              {filteredSalons.length === 0 && (
                <div className="p-8 text-center bg-white rounded-3xl border border-[#E5E5E5]">
                  <span className="material-symbols-outlined text-4xl text-[#D9D9D9] mb-2">
                    explore_off
                  </span>
                  <p className="text-sm font-bold text-[#111111]">No hay salones con estos filtros</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    Probá cambiando el barrio o quitando el filtro de turnos.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuickFilter('all');
                      setActiveNeighborhood('Todos');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-bold"
                  >
                    Restablecer búsqueda
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Interactive Montevideo Map (Desktop & Mobile) */}
          {/* ======================================================== */}
          <div
            className={`md:col-span-7 lg:col-span-7 flex flex-col ${
              mobileViewMode === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="sticky top-32 w-full h-[62vh] md:h-[calc(100vh-180px)] rounded-3xl overflow-hidden border border-[#D9D9D9] shadow-md relative bg-[#F2F2F2] select-none">
              {/* Mapa real de Montevideo (Leaflet + OpenStreetMap) */}
              <CityMap
                salons={filteredSalons}
                selectedId={selectedSalon?.id}
                onSelect={scrollToSalon}
                userPosition={userLocation && !userLocation.isFallback ? userLocation.position : null}
                recenterToken={recenterToken}
                focusSelectedOnMount={!!initialSalonId}
              />

              {/* Map Floating Controls Top */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-[#F4F4F4]">
                  <span className="w-2 h-2 rounded-full bg-[#111111] animate-ping" />
                  <span className="text-xs font-bold text-[#111111]">
                    {filteredSalons.length} salones en mapa
                  </span>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleRecenter}
                  aria-label="Re-centrar el mapa"
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-[#111111] shadow-md flex items-center justify-center hover:bg-[#F1F1F1] active:scale-90 transition-all"
                  title="Re-centrar el mapa"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#111111]">
                    my_location
                  </span>
                </button>
              </div>

              {/* Selected Salon Preview Card Floating at Bottom of Map (Desktop & Mobile) */}
              {selectedSalon && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl border border-[#F1F1F1] flex items-center gap-3 sm:gap-4 max-w-xl mx-auto">
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
                            className="text-xs sm:text-sm font-bold text-[#111111] hover:text-[#111111] cursor-pointer truncate"
                          >
                            {selectedSalon.name}
                          </h4>
                          <p className="text-[11px] text-[#6B6B6B] truncate">
                            {selectedSalon.neighborhood} · {selectedSalon.distance}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-[#111111] shrink-0">
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
                            className="px-3 py-1 rounded-full bg-[#F1F1F1] hover:bg-[#E5E5E5] text-[#111111] text-[11px] font-bold transition-colors flex items-center gap-1"
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
                            className="px-3 py-1 rounded-full bg-[#F1F1F1] hover:bg-[#E5E5E5] text-[#111111] text-[11px] font-bold transition-colors"
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
                          className="px-3.5 py-1 rounded-full bg-[#111111] hover:bg-[#2A2A2A] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0"
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
                          ? 'border-[#111111] ring-2 ring-[#111111]/30'
                          : 'border-[#E5E5E5]'
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
                              className="text-xs font-bold text-[#111111] truncate"
                            >
                              {salon.name}
                            </h4>
                            <p className="text-[10px] text-[#6B6B6B] truncate">
                              {salon.neighborhood} · {salon.distance}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                            ★ {salon.rating.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F4F4F4]">
                          {matchLook ? (
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate({ name: 'look_detail', lookId: matchLook.id })
                              }
                              className="text-xs font-semibold text-[#111111] flex items-center gap-0.5 hover:underline"
                            >
                              <span>Ver look</span>
                              <span className="material-symbols-outlined text-[13px]">
                                arrow_forward
                              </span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#111111] font-semibold">
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
                            className="px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-bold shadow-xs active:scale-95"
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
