import React, { useState } from 'react';
import { Look, ActiveScreen, SavedCollection } from '../types';
import { GlowBuzzLogo } from '../components/GlowBuzzLogo';
import { USER_AVATAR, INITIAL_SAVED_COLLECTIONS } from '../data/mockData';
import { AccountSettingsModal } from '../components/AccountSettingsModal';
import { FollowersListModal } from '../components/FollowersListModal';
import { UploadLookModal } from '../components/UploadLookModal';

interface ProfileViewProps {
  looks: Look[];
  savedLookIds: string[];
  initialTab?: string;
  onToggleSave: (lookId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenBooking: (bookingDetails: {
    salonName: string;
    serviceName: string;
    price?: string;
    slot: string;
    provider?: 'Fresha' | 'Timely' | 'Calendly' | 'WhatsApp';
  }) => void;
  onOpenLightbox?: (imageUrl: string, caption?: string) => void;
  onOpenOnboarding?: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  unreadCount: number;
}

interface UserPhoto {
  id: string;
  url: string;
  caption: string;
  rating: number;
  treatment?: string;
  salonName?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  looks,
  savedLookIds,
  initialTab = 'guardados',
  onToggleSave,
  onNavigate,
  onOpenBooking,
  onOpenLightbox,
  onOpenOnboarding,
  onShowToast,
  unreadCount,
}) => {
  const [activeTab, setActiveTab] = useState<'guardados' | 'reservas' | 'fotos' | 'resenas'>(
    (initialTab as any) || 'guardados'
  );
  const [collections, setCollections] = useState<SavedCollection[]>(INITIAL_SAVED_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [bioText, setBioText] = useState(
    'Amante del skincare, el balayage cálido y nail art minimalista ✨ Buenos Aires'
  );
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Beauty Lover Badge state
  const [showBeautyLoverBadge, setShowBeautyLoverBadge] = useState(true);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [followersTab, setFollowersTab] = useState<'following' | 'followers'>('following');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderFilterKey, setNewFolderFilterKey] = useState('Uñas');

  // User Photos State
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([
    {
      id: 'photo-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbFoPwl81jH6W6dGMcHUrAoO1WUn1NLXWyt4aaOgmhBsWgMQIY208lTFNp9N9rKHr_2CP4QeLcnbjj3qs23RYjd-oqCm9Eaaygv6p_oL1iP5AdMon4d7ozFikEY82AO0LT3-g3G2XF9Y1srmFQrnyzS1kS0ZnG6uArkwccJhGLjanOU5RxWmL8L4RN4DTC6mMJUjtfBGlPgEuVxN3d8GMBYPC6ygMFRlRvzkP75R0P5mP9vf_SPWq6',
      caption: 'Lifting y nutrición de pestañas en Brow Bar Atelier',
      rating: 4.9,
      treatment: 'Lifting de pestañas',
      salonName: 'Brow Bar Atelier',
    },
    {
      id: 'photo-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUt3w00qyFtaq6pOYb3UL0IyR6GwmD2ZPkMXIPPWoy4I86PwVQCC4yijceqtT-sqcdNLzDWI3yLg7ZrLTxeHAcYd6lQrwvSLClugVSD5jeAeodtIogyeA4TntY4b86MZroau8pnWrRYd1ZNc3xSMM0NUodBfT1BM9Tc-wfbX8UNudLHiayON_uEdN1eTXw3Uolb-jjug3_8n7wOWKoatT_Ne3WwVvWQmO2Ok8mGAKEJvccZD1-nu9F',
      caption: 'Kapping Gel Cherry wine en Studio Velvet Nails',
      rating: 5.0,
      treatment: 'Kapping Gel Cherry',
      salonName: 'Studio Velvet Nails',
    },
    {
      id: 'photo-3',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Szs81jT8OI-J0Yqb8XzPUyjoHHIDDs3oQaSx3qfo8jNtDadbwkzAeWC2ysWv5aCyBI0VW0ydhvRyL3uS3BbMz7Aoy-fGRfOiRkn_LyDqFoSA6JDrkVEmGFi35A6eGIOb_tURkfw-XqaNOZzXPB5n3nXAnxr3AwehRV4XA9KxVqMex5D8mZqVe_bVmPoSTCM2uFIu-gklqP0S0lAo9_qF7Jb_aH3wre2DmDEmePMw9UyH1tP52YSq',
      caption: 'Ondas con movimiento post-baño de brillo en Maison Hair Co.',
      rating: 5.0,
      treatment: 'Balayage & Styling',
      salonName: 'Maison Hair Co. Studio',
    },
  ]);

  // Handle uploaded look
  const handleAddLook = (newLook: {
    imageUrl: string;
    caption: string;
    salonName: string;
    salonId: string;
    treatment: string;
    rating: number;
  }) => {
    const item: UserPhoto = {
      id: `photo-${Date.now()}`,
      url: newLook.imageUrl,
      caption: newLook.caption,
      rating: newLook.rating,
      treatment: newLook.treatment,
      salonName: newLook.salonName,
    };
    setUserPhotos((prev) => [item, ...prev]);
  };

  // Handle create new private collection folder
  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: SavedCollection = {
      id: `col-${Date.now()}`,
      name: newFolderName.trim(),
      count: 0,
      icon: 'folder_special',
      filterKey: newFolderFilterKey,
    };
    setCollections((prev) => [...prev, newFolder]);
    setSelectedCollection(newFolder.id);
    onShowToast(`Carpeta "${newFolderName}" creada con éxito`, 'create_new_folder');
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
  };

  // Filtered saved looks based on user selections
  const savedLooks = looks
    .filter((l) => savedLookIds.includes(l.id))
    .filter((l) => {
      if (!selectedCollection) return true;
      const col = collections.find((c) => c.id === selectedCollection);
      if (!col) return true;
      if (col.filterKey) {
        return l.category.toLowerCase().includes(col.filterKey.toLowerCase());
      }
      return l.title.toLowerCase().includes(col.name.toLowerCase());
    });

  return (
    <div className="flex flex-col w-full pb-24 bg-[#FFF8F9] min-h-screen">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#FFF8F9]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(87,28,49,0.04)]">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-6xl mx-auto">
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
            <div className="rounded-full ring-2 ring-[#B82E5F] overflow-hidden">
              <img
                alt="Valentina Rossi"
                className="w-8 h-8 rounded-full object-cover"
                src={USER_AVATAR}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full pt-16 max-w-6xl mx-auto sm:px-6 lg:px-8">
        {/* Profile Header Banner & Avatar */}
        <div className="relative w-full px-5 pt-4 pb-4">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#F5DCE5]/50 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex items-start justify-between gap-4">
            {/* Avatar Container */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-white bg-[#EFE6E8]">
                <img
                  alt="Valentina Rossi"
                  className="w-full h-full object-cover"
                  src={USER_AVATAR}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#B82E5F] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>

            {/* Edit Profile, Interests & Account Settings */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="px-3 h-9 rounded-full bg-[#F5DCE5] text-[#25181E] text-xs font-semibold hover:bg-[#F5DCE5]/80 transition-all flex items-center gap-1 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>Editar bio</span>
              </button>
              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={onOpenOnboarding}
                  className="px-3 h-9 rounded-full bg-[#EFE6E8] text-[#574145] hover:bg-[#F5DCE5] hover:text-[#B82E5F] text-xs font-semibold transition-all flex items-center gap-1 shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[15px]">checklist</span>
                  <span>Intereses</span>
                </button>
              )}
              {/* Account Settings Trigger */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Configuración de la cuenta"
                className="w-9 h-9 rounded-full bg-[#EFE6E8] text-[#574145] flex items-center justify-center hover:text-[#B82E5F] transition-colors active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[19px]">settings</span>
              </button>
            </div>
          </div>

          {/* Name & Handle & Optional Beauty Lover Badge */}
          <div className="mt-3">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <h1 className="text-xl font-bold text-[#181416]">Valentina Rossi</h1>
              {showBeautyLoverBadge && (
                <div className="inline-flex items-center gap-1 bg-[#F5DCE5] text-[#B82E5F] pl-2.5 pr-1.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                  <span>Beauty Lover</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBeautyLoverBadge(false);
                      onShowToast('Insignia Beauty Lover ocultada de tu perfil', 'close');
                    }}
                    title="Quitar insignia del perfil"
                    className="w-4 h-4 ml-0.5 rounded-full hover:bg-[#B82E5F]/20 flex items-center justify-center text-[#571C31]"
                  >
                    <span className="material-symbols-outlined text-[11px]">close</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-[#6C5961] mt-0.5">@valen.glow</p>
          </div>

          {/* Bio Description */}
          {isEditingBio ? (
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#B82E5F] bg-white text-[#181416] focus:outline-none"
                rows={2}
              />
              <button
                type="button"
                onClick={() => {
                  setIsEditingBio(false);
                  onShowToast('Biografía actualizada', 'check');
                }}
                className="self-end px-3 py-1 rounded-full bg-[#B82E5F] text-white text-xs font-semibold"
              >
                Guardar
              </button>
            </div>
          ) : (
            <p className="text-xs text-[#574145] mt-2 leading-relaxed max-w-md">
              {bioText}
            </p>
          )}

          {/* Interactive Stats Strip (Functional Following / Followers) */}
          <div className="mt-4 bg-[#FBF1F4] p-2.5 rounded-2xl shadow-xs border border-[#F5EBEE] flex justify-between">
            <button
              type="button"
              onClick={() => onShowToast('¡Tenés 1.240 Puntos Glow Rose Gold!', 'stars')}
              className="flex flex-col items-center justify-center p-1 rounded-xl text-center hover:bg-[#F5EBEE] transition-colors flex-1"
            >
              <div className="flex items-center gap-1 text-[#B82E5F]">
                <span className="text-base font-bold">1.240</span>
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
              </div>
              <span className="text-[10px] text-[#574145]">Puntos</span>
              <span className="text-[9px] text-[#B82E5F] font-bold">Rose Gold</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fotos')}
              className="flex flex-col items-center justify-center p-1 rounded-xl text-center hover:bg-[#F5EBEE] transition-colors flex-1"
            >
              <span className="text-base font-bold text-[#181416]">{userPhotos.length}</span>
              <span className="text-[10px] text-[#574145]">Looks</span>
              <span className="text-[9px] text-[#6C5961]">Reales</span>
            </button>

            {/* Siguiendo */}
            <button
              type="button"
              onClick={() => {
                setFollowersTab('following');
                setIsFollowersOpen(true);
              }}
              className="flex flex-col items-center justify-center p-1 rounded-xl text-center hover:bg-[#F5EBEE] transition-colors flex-1 cursor-pointer"
            >
              <span className="text-base font-bold text-[#181416]">142</span>
              <span className="text-[10px] text-[#B82E5F] font-semibold underline">Siguiendo</span>
              <span className="text-[9px] text-[#6C5961]">Cuentas</span>
            </button>

            {/* Seguidores */}
            <button
              type="button"
              onClick={() => {
                setFollowersTab('followers');
                setIsFollowersOpen(true);
              }}
              className="flex flex-col items-center justify-center p-1 rounded-xl text-center hover:bg-[#F5EBEE] transition-colors flex-1 cursor-pointer"
            >
              <span className="text-base font-bold text-[#181416]">380</span>
              <span className="text-[10px] text-[#B82E5F] font-semibold underline">Seguidores</span>
              <span className="text-[9px] text-[#6C5961]">Comunidad</span>
            </button>
          </div>
        </div>

        {/* Upcoming Appointment Highlight Tile */}
        <div className="px-5 mb-4">
          <div className="relative overflow-hidden bg-[#B82E5F] text-white p-4 rounded-3xl shadow-md">
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                  <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#FFDAE0]">
                    Próxima cita agendada
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Maison Hair Co. Studio
                  </h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                En 3 días
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs text-[#FFDAE0]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Martes 24 Octubre · 15:30 hs</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onNavigate({ name: 'look_detail', lookId: 'look-balayage-vainilla' })
                }
                className="text-white font-bold underline decoration-white/50 underline-offset-4 hover:opacity-85 text-xs"
              >
                Ver detalle
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full px-5 sticky top-16 z-30 bg-[#FFF8F9]/95 backdrop-blur-md pt-1 pb-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('guardados')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'guardados'
                  ? 'bg-[#B82E5F] text-white shadow-xs'
                  : 'bg-[#EFE6E8] text-[#574145] hover:text-[#181416]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bookmark
              </span>
              <span>Guardados ({savedLooks.length})</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5DCE5]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reservas')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'reservas'
                  ? 'bg-[#B82E5F] text-white shadow-xs'
                  : 'bg-[#EFE6E8] text-[#574145] hover:text-[#181416]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">event_available</span>
              <span>Mis Reservas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fotos')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'fotos'
                  ? 'bg-[#B82E5F] text-white shadow-xs'
                  : 'bg-[#EFE6E8] text-[#574145] hover:text-[#181416]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Mis Fotos ({userPhotos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resenas')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'resenas'
                  ? 'bg-[#B82E5F] text-white shadow-xs'
                  : 'bg-[#EFE6E8] text-[#574145] hover:text-[#181416]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">rate_review</span>
              <span>Mis Reseñas</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Guardados (Functional Collections Filtering) */}
        {activeTab === 'guardados' && (
          <div className="px-5 pt-3 pb-8 flex flex-col gap-4">
            {/* Privacy Context Pill */}
            <div className="flex items-center justify-between bg-[#FBF1F4] px-4 py-2 rounded-full border border-[#F5EBEE]">
              <div className="flex items-center gap-1.5 text-[#6C5961]">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span className="text-[11px] font-medium">
                  Colecciones privadas · Solo visible para vos
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(true)}
                className="text-[#B82E5F] text-[11px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Nueva carpeta</span>
              </button>
            </div>

            {/* Collections Quick Tray with Working Filtering */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedCollection(null)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCollection === null
                    ? 'bg-[#B82E5F] text-white'
                    : 'bg-[#EFE6E8] text-[#574145]'
                }`}
              >
                <span>Todos los guardados ({looks.filter((l) => savedLookIds.includes(l.id)).length})</span>
              </button>
              {collections.map((col) => {
                const isSelected = selectedCollection === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() =>
                      setSelectedCollection(isSelected ? null : col.id)
                    }
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#B82E5F] text-white font-semibold'
                        : 'bg-[#F5DCE5] text-[#571C31] hover:bg-[#F5DCE5]/80'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {col.icon}
                    </span>
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Editorial Multi-column Beauty Inspiration Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {savedLooks.map((look) => {
                const img = look.images[0];
                return (
                  <div
                    key={look.id}
                    className="flex flex-col group cursor-pointer"
                    onClick={() => onNavigate({ name: 'look_detail', lookId: look.id })}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#EFE6E8] shadow-xs border border-[#EAD8DE]/50">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full text-white flex items-center gap-1 text-[9px] font-bold uppercase">
                        <span className="material-symbols-outlined text-[11px]">
                          photo_camera
                        </span>
                        <span>TRABAJO REAL</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(look.id);
                        }}
                        aria-label="Favorito guardado"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md text-[#B82E5F] flex items-center justify-center shadow-xs"
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>

                    <div className="mt-1.5 px-0.5">
                      <h4 className="text-xs font-bold text-[#181416] line-clamp-1">
                        {look.title}
                      </h4>
                      <p className="text-[11px] text-[#6C5961] truncate">
                        {look.salonName} · {look.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {savedLooks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="material-symbols-outlined text-[36px] text-[#DEBFC4] mb-2">
                  bookmark_border
                </span>
                <p className="text-sm font-bold text-[#181416]">No hay looks en esta colección</p>
                <p className="text-xs text-[#6C5961] mt-1 max-w-xs">
                  {selectedCollection
                    ? 'Probá seleccionando "Todos los guardados" o guardá más trabajos reales desde el Inicio.'
                    : 'Guardá los trabajos reales que te gusten desde el Inicio tocando el ícono de bookmark.'}
                </p>
                {selectedCollection && (
                  <button
                    type="button"
                    onClick={() => setSelectedCollection(null)}
                    className="mt-3 px-4 py-2 rounded-full bg-[#B82E5F] text-white text-xs font-bold"
                  >
                    Ver todos los guardados
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Mis Reservas */}
        {activeTab === 'reservas' && (
          <div className="px-5 pt-3 pb-8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#181416]">Historial de Visitas</h3>
              <span className="text-[11px] text-[#6C5961]">3 completadas en 2024</span>
            </div>

            {/* Past Booking 1 */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAD8DE] flex flex-col gap-2 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5DCE5] flex items-center justify-center text-[#B82E5F] font-bold">
                    <span className="material-symbols-outlined text-[20px]">content_cut</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#181416]">
                      Corte Bob Texturado &amp; Baño de Brillo
                    </h4>
                    <p className="text-[11px] text-[#6C5961]">
                      Maison Hair Co. · Atendido por Lucas
                    </p>
                  </div>
                </div>
                <span className="bg-[#EFE6E8] text-[#574145] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Completado
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#F5EBEE] text-xs text-[#574145]">
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
                  className="text-[#B82E5F] font-semibold hover:underline"
                >
                  Volver a reservar
                </button>
              </div>
            </div>

            {/* Past Booking 2 */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAD8DE] flex flex-col gap-2 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5DCE5] flex items-center justify-center text-[#B82E5F] font-bold">
                    <span className="material-symbols-outlined text-[20px]">brush</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#181416]">
                      Kapping Gel + Esmaltado Semipermanente
                    </h4>
                    <p className="text-[11px] text-[#6C5961]">
                      Studio Velvet Nails · Atendido por Camila
                    </p>
                  </div>
                </div>
                <span className="bg-[#EFE6E8] text-[#574145] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Completado
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#F5EBEE] text-xs text-[#574145]">
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
                  className="text-[#B82E5F] font-semibold hover:underline"
                >
                  Volver a reservar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Mis Fotos Subidas (Functional Subir look + Lightbox Zoom) */}
        {activeTab === 'fotos' && (
          <div className="px-5 pt-3 pb-8 flex flex-col gap-4">
            <div className="bg-[#F5DCE5] text-[#25181E] p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B82E5F] text-[24px]">
                  verified_user
                </span>
                <div>
                  <h4 className="text-xs font-bold">Comunidad Verificada</h4>
                  <p className="text-[11px] text-[#534249]">
                    Tus fotos ayudan a otras a elegir su estilista ideal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#B82E5F] text-white rounded-full text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-transform shrink-0"
              >
                Subir look
              </button>
            </div>

            {/* Photo Grid with Zoom Lightbox Click */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 md:gap-3">
              {userPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onOpenLightbox?.(photo.url, photo.caption)}
                  className="aspect-square rounded-2xl overflow-hidden bg-[#EFE6E8] relative shadow-xs cursor-pointer group hover:scale-102 transition-transform"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                  </div>
                  <span className="absolute bottom-1 right-1 text-white text-[9px] bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-full font-bold">
                    {photo.rating.toFixed(1)} ★
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Mis Reseñas */}
        {activeTab === 'resenas' && (
          <div className="px-5 pt-3 pb-8 flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#EAD8DE] flex flex-col gap-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#181416]">Maison Hair Co. Studio</h4>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#574145] leading-relaxed">
                &ldquo;Lucas entendió exactamente el tono de balayage cálido que quería sin maltratar mi pelo. El servicio de café y el masaje capilar fueron un 10. ¡Vuelvo siempre!&rdquo;
              </p>
              <span className="text-[10px] text-[#6C5961] mt-1">
                Septiembre 2024 · Servicio Verificado
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAD8DE] flex flex-col gap-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#181416]">Studio Velvet Nails</h4>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#574145] leading-relaxed">
                &ldquo;El kapping quedó impecable y duró más de 3 semanas sin saltarse. Muy detallistas con la cutícula rusa.&rdquo;
              </p>
              <span className="text-[10px] text-[#6C5961] mt-1">
                Agosto 2024 · Servicio Verificado
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        showBeautyLoverBadge={showBeautyLoverBadge}
        onToggleBeautyLoverBadge={(val) => setShowBeautyLoverBadge(val)}
        onClose={() => setIsSettingsOpen(false)}
        onShowToast={onShowToast}
      />

      {/* Followers & Following Modal */}
      <FollowersListModal
        isOpen={isFollowersOpen}
        initialTab={followersTab}
        onClose={() => setIsFollowersOpen(false)}
        onNavigate={onNavigate}
        onShowToast={onShowToast}
      />

      {/* Upload Look Modal */}
      <UploadLookModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadLook={handleAddLook}
        onShowToast={onShowToast}
      />

      {/* Create New Folder Modal */}
      {isNewFolderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setIsNewFolderModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-3 border border-[#F5DCE5]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#F5EBEE]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#B82E5F] text-[20px]">
                  create_new_folder
                </span>
                <h3 className="text-sm font-bold text-[#181416]">Nueva Carpeta Privada</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#EFE6E8] flex items-center justify-center text-[#574145]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewFolder} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#181416]">Nombre de la carpeta</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ej: Inspo Balayage Rubio, Uñas Fiesta..."
                  className="w-full p-2.5 rounded-xl border border-[#DEBFC4] text-xs text-[#181416] outline-none focus:border-[#B82E5F]"
                  autoFocus
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#181416]">Categoría asociada</label>
                <select
                  value={newFolderFilterKey}
                  onChange={(e) => setNewFolderFilterKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DEBFC4] text-xs text-[#181416] outline-none"
                >
                  <option value="Uñas">Uñas &amp; Manicuría</option>
                  <option value="Pelo & Color">Pelo &amp; Color</option>
                  <option value="Cejas & Pestañas">Cejas &amp; Pestañas</option>
                  <option value="Maquillaje">Maquillaje</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#B82E5F] text-white font-bold text-xs shadow-md mt-1 active:scale-98 transition-transform"
              >
                Crear Colección
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
