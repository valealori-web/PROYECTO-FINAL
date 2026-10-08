import React, { useState } from 'react';
import { Look, ActiveScreen, LookCategory } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR } from '../data/mockData';

interface FeedViewProps {
  looks: Look[];
  savedLookIds: string[];
  onToggleSave: (lookId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenFilters: () => void;
  currentFilters?: {
    category: string;
    maxDistance: string;
    availability: string;
    minRating: number;
    maxPrice: number;
  };
  unreadCount: number;
}

export const FeedView: React.FC<FeedViewProps> = ({
  looks,
  savedLookIds,
  onToggleSave,
  onNavigate,
  onOpenFilters,
  currentFilters,
  unreadCount,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Estética Facial', value: 'Estética Facial' },
    { label: 'Botox & Armonización', value: 'Botox & Armonización' },
    { label: 'Uñas', value: 'Uñas' },
    { label: 'Pelo & Color', value: 'Pelo & Color' },
    { label: 'Cejas & Pestañas', value: 'Cejas & Pestañas' },
    { label: 'Maquillaje', value: 'Maquillaje' },
    { label: 'Cerca de mí', value: 'nearby', isIcon: true },
  ];

  const filteredLooks = looks.filter((look) => {
    // Category match from chips
    if (activeCategory !== 'Todos' && activeCategory !== 'nearby') {
      if (look.category !== activeCategory) return false;
    }
    // Advanced category filter
    if (currentFilters?.category && currentFilters.category !== 'Todas') {
      if (look.category !== currentFilters.category) return false;
    }
    // Rating filter
    if (currentFilters?.minRating && look.rating < currentFilters.minRating) {
      return false;
    }
    // Price filter
    if (currentFilters?.maxPrice && look.priceNumeric > currentFilters.maxPrice) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = look.title.toLowerCase().includes(q);
      const matchSalon = look.salonName.toLowerCase().includes(q);
      const matchLoc = look.location.toLowerCase().includes(q);
      const matchCat = look.category.toLowerCase().includes(q);
      if (!matchTitle && !matchSalon && !matchLoc && !matchCat) return false;
    }
    return true;
  });

  // Calculate dynamic aspect ratio classes for the Pinterest masonry look
  const getAspectRatioClass = (look: Look, index: number) => {
    if (look.aspectRatio === 'tall') return 'aspect-[9/14] sm:aspect-[2/3]';
    if (look.aspectRatio === 'portrait') return 'aspect-[3/4]';
    if (look.aspectRatio === 'square') return 'aspect-[1/1]';
    // Fallback staggered alternation based on index for true Pinterest rhythm
    const patterns = [
      'aspect-[3/4]',
      'aspect-[2/3]',
      'aspect-[4/5]',
      'aspect-[1/1]',
      'aspect-[9/13]',
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="flex flex-col w-full pb-28 md:pb-24 bg-[#FFF8F3] min-h-screen">
      {/* Sticky Top Header - Responsive desktop & mobile */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-[#FFF8F3]/90 backdrop-blur-xl border-b border-[#F5DCE5]/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <GlowBuzzLogo variant="header" size={32} />
            </div>

            {/* Desktop Center Search Bar (Expanded on medium & large screens) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative flex items-center w-full bg-[#FBF1F4] hover:bg-[#F5EBEE] focus-within:bg-white rounded-full px-4 py-2 border border-[#EAD8DE] focus-within:border-[#B82E5F] transition-all shadow-xs">
                <span className="material-symbols-outlined text-[#6C5961] text-[20px] mr-2.5">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar inspiración, Botox, Balayage, Uñas, Estética..."
                  className="w-full bg-transparent text-[#181416] placeholder:text-[#6C5961] text-xs focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#6C5961] mr-1 hover:text-[#181416]"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenFilters}
                  aria-label="Filtrar búsqueda"
                  className="w-7 h-7 rounded-full bg-[#F5DCE5] hover:bg-[#B82E5F] text-[#571C31] hover:text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </button>
              </div>
            </div>

            {/* Header Right Actions */}
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

        {/* Mobile Search Bar (Only shown below md) */}
        <div className="md:hidden px-4 pb-2.5 pt-0.5">
          <div className="relative flex items-center w-full bg-[#FBF1F4] rounded-full px-3.5 py-2 shadow-xs border border-[#EAD8DE] focus-within:border-[#B82E5F] focus-within:bg-white transition-all">
            <span className="material-symbols-outlined text-[#6C5961] text-[18px] mr-2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estilos, Botox, faciales, uñas..."
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
              aria-label="Filtrar búsqueda"
              className="w-7 h-7 rounded-full bg-[#F5DCE5] flex items-center justify-center text-[#571C31] active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          </div>
        </div>

        {/* Horizontal Category Navigation Chips */}
        <div className="w-full border-t border-[#F5DCE5]/40 bg-[#FFF8F3]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section
              aria-label="Filtros de categorías"
              className="flex overflow-x-auto no-scrollbar gap-2 py-2"
            >
              {filterCategories.map((item) => {
                const isActive = activeCategory === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      if (item.value === 'nearby') {
                        onNavigate({ name: 'explore' });
                      } else {
                        setActiveCategory(item.value);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#B82E5F] text-white shadow-xs'
                        : item.isIcon
                        ? 'bg-[#F5DCE5] text-[#571C31] hover:bg-[#F5DCE5]/80 flex items-center gap-1'
                        : 'bg-white text-[#574145] hover:text-[#181416] hover:bg-[#FBF1F4] border border-[#EAD8DE]/80'
                    }`}
                  >
                    {item.isIcon && (
                      <span className="material-symbols-outlined text-[14px]">near_me</span>
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      </header>

      {/* Main Content: True Pinterest-Style Masonry Stream */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5">
        {/* Subtle Inspiration Header */}
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B82E5F] animate-pulse" />
            <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#571C31]">
              Inspiración &amp; Trabajos Reales
            </h1>
          </div>
          <span className="text-[11px] text-[#6C5961] font-medium">
            {filteredLooks.length} resultados
          </span>
        </div>

        {/* Pinterest-like Multi-column Masonry Grid */}
        <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 [column-fill:_balance]">
          {filteredLooks.map((look, idx) => {
            const isSaved = savedLookIds.includes(look.id);
            const mainImage = look.images[0];
            const aspectClass = getAspectRatioClass(look, idx);

            return (
              <article
                key={look.id}
                onClick={() => onNavigate({ name: 'look_detail', lookId: look.id })}
                className="break-inside-avoid mb-3 md:mb-4 group cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F5DCE5]/30 shadow-[0_4px_16px_rgba(87,28,49,0.04)] hover:shadow-xl transition-all duration-300"
              >
                {/* Visual Image Slot */}
                <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#EFE6E8]`}>
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt || look.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Scrim on hover/touch */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-75 transition-opacity duration-300" />

                  {/* Minimal Floating Bookmark Button (Discreet in corner) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(look.id);
                    }}
                    aria-label={isSaved ? 'Quitar de guardados' : 'Guardar en inspiración'}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs active:scale-75 ${
                      isSaved
                        ? 'bg-[#B82E5F] text-white opacity-100'
                        : 'bg-black/35 hover:bg-white text-white hover:text-[#B82E5F] backdrop-blur-md opacity-85 group-hover:opacity-100'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[17px]"
                      style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>

                  {/* Category Pill Tag (Subtle) */}
                  {look.category && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white/95 text-[9px] font-bold uppercase tracking-wider opacity-90">
                      {look.category}
                    </div>
                  )}

                  {/* Minimal Subtle Information: ONLY Image + Elegant Subtle Price */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-xs font-bold tracking-tight shadow-xs border border-white/10">
                      {look.price}
                    </span>

                    {/* Subtle verified eye indicator */}
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state if search/filter yield no results */}
        {filteredLooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#F5DCE5] text-[#B82E5F] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="text-base font-bold text-[#181416]">No se encontraron looks</h3>
            <p className="text-xs text-[#6C5961] mt-1.5 leading-relaxed">
              No hay publicaciones que coincidan con &ldquo;{searchQuery || activeCategory}&rdquo;. Probá buscando &quot;Botox&quot;, &quot;Facial&quot; o &quot;Uñas&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#B82E5F] text-white text-xs font-bold shadow-xs hover:bg-[#971047] transition-all"
            >
              Ver todas las publicaciones
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
