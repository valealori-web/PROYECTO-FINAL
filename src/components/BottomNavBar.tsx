import React from 'react';
import { ActiveScreen } from '../types';

interface BottomNavBarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  unreadCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Determine active tab
  let activeTab: 'inicio' | 'explorar' | 'reservas' | 'perfil' = 'inicio';
  if (currentScreen.name === 'explore') activeTab = 'explorar';
  else if (currentScreen.name === 'reservations') activeTab = 'reservas';
  else if (currentScreen.name === 'profile') activeTab = 'perfil';
  else if (currentScreen.name === 'feed') activeTab = 'inicio';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-[#FFFFFF]/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(17,17,17,0.06)] border-t border-[#F1F1F1]/60 md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[440px] md:max-w-md md:rounded-full md:border md:border-[#F1F1F1] md:shadow-[0_12px_36px_rgba(17,17,17,0.14)] md:bg-[#FFFFFF]/95 md:px-4"
      aria-label="Navegación principal"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {/* Inicio */}
        <button
          type="button"
          onClick={() => onNavigate({ name: 'feed' })}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
            activeTab === 'inicio' ? 'text-[#111111] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={activeTab === 'inicio' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            home
          </span>
          <span className="text-[11px] tracking-tight">Inicio</span>
        </button>

        {/* Explorar */}
        <button
          type="button"
          onClick={() => onNavigate({ name: 'explore' })}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
            activeTab === 'explorar' ? 'text-[#111111] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={activeTab === 'explorar' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            explore
          </span>
          <span className="text-[11px] tracking-tight">Explorar</span>
        </button>

        {/* Reservas */}
        <button
          type="button"
          onClick={() => onNavigate({ name: 'reservations' })}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors relative ${
            activeTab === 'reservas' ? 'text-[#111111] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={activeTab === 'reservas' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            calendar_month
          </span>
          <span className="text-[11px] tracking-tight">Reservas</span>
        </button>

        {/* Perfil */}
        <button
          type="button"
          onClick={() => onNavigate({ name: 'profile' })}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
            activeTab === 'perfil' ? 'text-[#111111] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={activeTab === 'perfil' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            person
          </span>
          <span className="text-[11px] tracking-tight">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
