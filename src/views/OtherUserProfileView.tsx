import React, { useState } from 'react';
import { OtherUserProfile, ActiveScreen } from '../types';
import { USER_AVATAR } from '../data/mockData';

interface OtherUserProfileViewProps {
  user: OtherUserProfile;
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
  onOpenLightbox: (imageUrl: string, caption?: string) => void;
  onOpenShare: (title: string, subtitle?: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const OtherUserProfileView: React.FC<OtherUserProfileViewProps> = ({
  user,
  onNavigate,
  onBack,
  onOpenLightbox,
  onOpenShare,
  onShowToast,
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [activeTab, setActiveTab] = useState<'looks' | 'colecciones'>('looks');

  const handleFollowToggle = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    setFollowersCount((prev) => (next ? prev + 1 : prev - 1));
    onShowToast(next ? `Ahora sigues a ${user.name}` : `Dejaste de seguir a ${user.name}`, 'person');
  };

  return (
    <div className="flex flex-col w-full pb-24 bg-[#FFF8F9] min-h-screen">
      {/* Top Header */}
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
            <h1 className="text-base font-bold text-[#181416] tracking-tight ml-1 truncate max-w-[200px]">
              {user.handle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenShare(user.name, user.handle)}
              aria-label="Compartir perfil"
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

      {/* Main Body */}
      <main className="flex-1 flex flex-col w-full pt-16 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="pt-4 pb-3 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#B82E5F] text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px] shadow-xs">
                ✓
              </span>
            </div>

            <button
              type="button"
              onClick={handleFollowToggle}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 ${
                isFollowing
                  ? 'bg-[#EFE6E8] text-[#574145] hover:bg-[#FFDAD6] hover:text-[#BA1A1A]'
                  : 'bg-[#B82E5F] text-white hover:bg-[#971047]'
              }`}
            >
              {isFollowing ? 'Siguiendo' : '+ Seguir'}
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#181416]">{user.name}</h2>
              {user.badge && (
                <span className="px-2 py-0.5 rounded-full bg-[#F5DCE5] text-[#571C31] text-[10px] font-bold">
                  {user.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-[#6C5961]">{user.handle} · {user.city}</span>
          </div>

          <p className="text-xs text-[#574145] leading-relaxed">
            {user.bio}
          </p>

          {/* Social Proof Strip */}
          <div className="p-2.5 rounded-2xl bg-[#FBF1F4] flex items-center gap-2 text-xs text-[#574145] border border-[#F5EBEE]">
            <span className="material-symbols-outlined text-[#B82E5F] text-[18px]">group</span>
            <span>Seguida por @valen.glow y 14 personas de tu comunidad</span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-white rounded-xl border border-[#EAD8DE]">
              <span className="block text-sm font-bold text-[#181416]">
                {user.sharedPhotos.length}
              </span>
              <span className="text-[10px] text-[#6C5961]">Looks Reales</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-[#EAD8DE]">
              <span className="block text-sm font-bold text-[#181416]">
                {user.favoriteCollections.length}
              </span>
              <span className="text-[10px] text-[#6C5961]">Colecciones</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-[#EAD8DE]">
              <span className="block text-sm font-bold text-[#181416]">
                {followersCount}
              </span>
              <span className="text-[10px] text-[#6C5961]">Seguidores</span>
            </div>
          </div>
        </div>

        {/* Tab Picker */}
        <div className="flex rounded-full bg-[#EFE6E8] p-1 gap-1 my-3">
          <button
            type="button"
            onClick={() => setActiveTab('looks')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold text-center transition-all ${
              activeTab === 'looks'
                ? 'bg-[#B82E5F] text-white shadow-xs'
                : 'text-[#574145]'
            }`}
          >
            Looks de {user.name.split(' ')[0]} ({user.sharedPhotos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('colecciones')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold text-center transition-all ${
              activeTab === 'colecciones'
                ? 'bg-[#B82E5F] text-white shadow-xs'
                : 'text-[#574145]'
            }`}
          >
            Tableros de Inspiración
          </button>
        </div>

        {/* Tab 1: Looks Reales */}
        {activeTab === 'looks' && (
          <div className="flex flex-col gap-3 pb-8">
            {user.sharedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="p-3.5 bg-white rounded-2xl border border-[#EAD8DE] shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        if (photo.salonId) {
                          onNavigate({ name: 'salon_profile', salonId: photo.salonId });
                        }
                      }}
                      className="text-xs font-bold text-[#181416] hover:text-[#B82E5F] hover:underline text-left"
                    >
                      {photo.salonName}
                    </button>
                    <span className="text-[11px] text-[#6C5961]">{photo.treatment}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span>{photo.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div
                  className="relative w-full h-56 rounded-xl overflow-hidden cursor-pointer bg-[#EFE6E8]"
                  onClick={() => onOpenLightbox(photo.url, photo.caption)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white">
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  </div>
                </div>

                <p className="text-xs text-[#574145] leading-relaxed">
                  &ldquo;{photo.caption}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#F5EBEE] text-xs text-[#6C5961]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#B82E5F]">
                      favorite
                    </span>
                    <span>{photo.likes} me gusta</span>
                  </span>
                  {photo.salonId && (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate({ name: 'salon_profile', salonId: photo.salonId! })
                      }
                      className="text-[#B82E5F] font-bold hover:underline"
                    >
                      Ver perfil del salón →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {user.sharedPhotos.length === 0 && (
              <p className="text-center text-xs text-[#6C5961] py-8">
                Esta usuaria aún no compartió looks públicos.
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Colecciones */}
        {activeTab === 'colecciones' && (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {user.favoriteCollections.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EAD8DE] shadow-xs flex flex-col group cursor-pointer"
                onClick={() => onShowToast(`Abriendo tablero "${col.name}"`)}
              >
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={col.coverUrl}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-white text-[11px] font-bold">
                    {col.name}
                  </span>
                </div>
                <div className="p-2 text-center text-[10px] text-[#6C5961]">
                  {col.count} looks guardados
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
