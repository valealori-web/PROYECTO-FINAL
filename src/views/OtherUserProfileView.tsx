import React, { useState } from 'react';
import { OtherUserProfile, ActiveScreen } from '../types';

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
    <div className="flex flex-col w-full pb-24 bg-[#FFFFFF] min-h-screen">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#FFFFFF]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(17,17,17,0.04)]">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center text-[#111111] hover:text-[#111111] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
            <h1 className="text-base font-bold text-[#111111] tracking-tight ml-1 truncate max-w-[200px]">
              {user.handle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenShare(user.name, user.handle)}
              aria-label="Compartir perfil"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#111111] hover:text-[#111111] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col w-full pt-16 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Profile */}
        <section className="pt-5">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-[#F1F1F1] shrink-0"
            />
            <div className="flex-1 grid grid-cols-3 text-center">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-[#111111] leading-tight">
                  {user.sharedPhotos.length}
                </span>
                <span className="text-xs text-[#6B6B6B]">Looks</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-[#111111] leading-tight">
                  {user.favoriteCollections.length}
                </span>
                <span className="text-xs text-[#6B6B6B]">Colecciones</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-[#111111] leading-tight">
                  {followersCount}
                </span>
                <span className="text-xs text-[#6B6B6B]">Seguidores</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-sm font-semibold text-[#111111]">{user.name}</h2>
            <p className="text-xs text-[#6B6B6B]">
              {user.handle} · {user.city}
            </p>
            <p className="text-sm text-[#111111] mt-2 leading-snug max-w-md">{user.bio}</p>
          </div>

          <button
            type="button"
            onClick={handleFollowToggle}
            className={`mt-4 w-full h-9 rounded-lg text-sm font-semibold transition-colors ${
              isFollowing
                ? 'bg-[#F1F1F1] text-[#111111] hover:bg-[#E5E5E5]'
                : 'bg-[#111111] text-white hover:bg-[#2A2A2A]'
            }`}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        </section>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-2 border-b border-[#EFEFEF]" role="tablist">
          {[
            { id: 'looks', icon: 'grid_view', label: 'Looks' },
            { id: 'colecciones', icon: 'bookmark', label: 'Colecciones' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={tab.label}
                onClick={() => setActiveTab(tab.id as any)}
                className={`h-12 flex items-center justify-center border-b-2 transition-colors ${
                  active
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#8A8A8A] hover:text-[#111111]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}
                >
                  {tab.icon}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-3" />

        {/* Tab 1: Looks Reales */}
        {activeTab === 'looks' && (
          <div className="flex flex-col gap-3 pb-8">
            {user.sharedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="p-3.5 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col gap-2.5"
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
                      className="text-xs font-bold text-[#111111] hover:text-[#111111] hover:underline text-left"
                    >
                      {photo.salonName}
                    </button>
                    <span className="text-[11px] text-[#6B6B6B]">{photo.treatment}</span>
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
                  className="relative w-full h-56 rounded-xl overflow-hidden cursor-pointer bg-[#F1F1F1]"
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

                <p className="text-xs text-[#444444] leading-relaxed">
                  &ldquo;{photo.caption}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#F4F4F4] text-xs text-[#6B6B6B]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#111111]">
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
                      className="text-[#111111] font-bold hover:underline"
                    >
                      Ver perfil del salón →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {user.sharedPhotos.length === 0 && (
              <p className="text-center text-xs text-[#6B6B6B] py-8">
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
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-xs flex flex-col group cursor-pointer"
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
                <div className="p-2 text-center text-[10px] text-[#6B6B6B]">
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
