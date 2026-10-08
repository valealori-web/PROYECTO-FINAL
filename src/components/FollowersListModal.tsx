import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { OTHER_USERS_DATA, SALONS_DATA } from '../data/mockData';

interface FollowersListModalProps {
  isOpen: boolean;
  initialTab?: 'following' | 'followers';
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const FollowersListModal: React.FC<FollowersListModalProps> = ({
  isOpen,
  initialTab = 'following',
  onClose,
  onNavigate,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'following' | 'followers'>(initialTab);
  const [followingIds, setFollowingIds] = useState<string[]>([
    'maison-hair-co',
    'studio-velvet-nails',
    'brow-bar-atelier',
    'sofia-val',
    'camila-rossi',
  ]);

  if (!isOpen) return null;

  const toggleFollow = (id: string, name: string) => {
    setFollowingIds((prev) => {
      const isF = prev.includes(id);
      if (isF) {
        onShowToast(`Dejaste de seguir a ${name}`);
        return prev.filter((item) => item !== id);
      } else {
        onShowToast(`Ahora sigues a ${name}`, 'person_add');
        return [...prev, id];
      }
    });
  };

  const followingList = [
    {
      id: 'maison-hair-co',
      type: 'salon',
      name: 'Maison Hair Co. Studio',
      handle: '@maisonhairco',
      avatar: SALONS_DATA['maison-hair-co'].logo,
      subtitle: 'Salón Verificado · Pocitos',
    },
    {
      id: 'studio-velvet-nails',
      type: 'salon',
      name: 'Studio Velvet Nails',
      handle: '@velvetnails',
      avatar: SALONS_DATA['studio-velvet-nails'].logo,
      subtitle: 'Salón Verificado · Punta Carretas',
    },
    {
      id: 'brow-bar-atelier',
      type: 'salon',
      name: 'Brow Bar Atelier',
      handle: '@browbaratelier',
      avatar: SALONS_DATA['brow-bar-atelier'].logo,
      subtitle: 'Salón Verificado · Cordón',
    },
    {
      id: 'sofia-val',
      type: 'user',
      name: OTHER_USERS_DATA['sofia-val'].name,
      handle: OTHER_USERS_DATA['sofia-val'].handle,
      avatar: OTHER_USERS_DATA['sofia-val'].avatar,
      subtitle: 'Beauty Curator · 420 seguidores',
    },
    {
      id: 'camila-rossi',
      type: 'user',
      name: OTHER_USERS_DATA['camila-rossi'].name,
      handle: OTHER_USERS_DATA['camila-rossi'].handle,
      avatar: OTHER_USERS_DATA['camila-rossi'].avatar,
      subtitle: 'Clienta Verificada · 310 seguidores',
    },
  ];

  const followersList = [
    {
      id: 'sofia-val',
      type: 'user',
      name: OTHER_USERS_DATA['sofia-val'].name,
      handle: OTHER_USERS_DATA['sofia-val'].handle,
      avatar: OTHER_USERS_DATA['sofia-val'].avatar,
      subtitle: 'Te sigue desde hace 3 meses',
    },
    {
      id: 'lucia-morales',
      type: 'user',
      name: OTHER_USERS_DATA['lucia-morales'].name,
      handle: OTHER_USERS_DATA['lucia-morales'].handle,
      avatar: OTHER_USERS_DATA['lucia-morales'].avatar,
      subtitle: 'Te sigue desde hace 1 mes',
    },
    {
      id: 'camila-rossi',
      type: 'user',
      name: OTHER_USERS_DATA['camila-rossi'].name,
      handle: OTHER_USERS_DATA['camila-rossi'].handle,
      avatar: OTHER_USERS_DATA['camila-rossi'].avatar,
      subtitle: 'Te sigue desde hace 2 semanas',
    },
  ];

  const activeList = tab === 'following' ? followingList : followersList;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Seguidores y cuentas que sigues"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFF8F3] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-3.5 border-t border-[#F5DCE5] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[#8B7075]/30 mx-auto" />

        <div className="flex items-center justify-between">
          <div className="flex rounded-full bg-[#EFE6E8] p-1 gap-1">
            <button
              onClick={() => setTab('following')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === 'following' ? 'bg-[#B82E5F] text-white shadow-xs' : 'text-[#574145]'
              }`}
            >
              Siguiendo (142)
            </button>
            <button
              onClick={() => setTab('followers')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === 'followers' ? 'bg-[#B82E5F] text-white shadow-xs' : 'text-[#574145]'
              }`}
            >
              Seguidores (380)
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE6E8] flex items-center justify-center text-[#574145] hover:text-[#181416]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* List of accounts */}
        <div className="flex flex-col gap-2 mt-1">
          {activeList.map((item) => {
            const isF = followingIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-[#EAD8DE] flex items-center justify-between gap-3 shadow-xs hover:border-[#B82E5F]/50 transition-all"
              >
                <div
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    if (item.type === 'salon') {
                      onNavigate({ name: 'salon_profile', salonId: item.id });
                    } else {
                      onNavigate({ name: 'user_profile', userId: item.id });
                    }
                  }}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#F5DCE5] shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#181416] truncate hover:text-[#B82E5F]">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#6C5961] truncate">{item.handle}</span>
                    <span className="text-[10px] text-[#574145] truncate opacity-85">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(item.id, item.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    isF
                      ? 'bg-[#EFE6E8] text-[#574145] hover:bg-[#FFDAD6] hover:text-[#BA1A1A]'
                      : 'bg-[#B82E5F] text-white hover:bg-[#971047]'
                  }`}
                >
                  {isF ? 'Siguiendo' : '+ Seguir'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
