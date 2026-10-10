import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { HEADER_CONTAINER, HeaderLogo, BackButton } from '../components/HeaderParts';
import { REWARDS, EARN_RULES, INITIAL_HISTORY, PointsTransaction } from '../data/loyaltyData';

interface LoyaltyViewProps {
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

type Tab = 'canjear' | 'ganar' | 'historial';

const fmt = (n: number) => n.toLocaleString('es-UY');

export const LoyaltyView: React.FC<LoyaltyViewProps> = ({ onNavigate, onBack, onShowToast }) => {
  const [tab, setTab] = useState<Tab>('canjear');
  const [points, setPoints] = useState(1240);
  const [history, setHistory] = useState<PointsTransaction[]>(INITIAL_HISTORY);
  const [myRewards, setMyRewards] = useState<{ id: string; rewardId: string; code: string }[]>([]);
  const [invited, setInvited] = useState(1);

  const redeem = (rewardId: string) => {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward || points < reward.cost) return;
    const code = `GB${Math.floor(1000 + Math.random() * 9000)}`;
    setPoints((p) => p - reward.cost);
    setMyRewards((prev) => [{ id: `${rewardId}-${Date.now()}`, rewardId, code }, ...prev]);
    setHistory((h) => [
      { id: `t-${Date.now()}`, label: `Canje: ${reward.title}`, points: -reward.cost, date: 'Hoy' },
      ...h,
    ]);
    onShowToast(`Canjeaste "${reward.title}"`, 'redeem');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'canjear', label: 'Canjear' },
    { id: 'ganar', label: 'Ganar puntos' },
    { id: 'historial', label: 'Historial' },
  ];

  return (
    <div className="flex flex-col w-full pb-28 bg-white min-h-screen">
      <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-[#EFEFEF]">
        <div className={HEADER_CONTAINER}>
          <HeaderLogo onNavigate={onNavigate} />
          <div className="flex items-center gap-1">
            <BackButton onBack={onBack} />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-16 max-w-3xl mx-auto px-5">
        <h1 className="pt-6 text-xl font-semibold text-[#111111]">Puntos Glow</h1>

        <section className="mt-4 rounded-2xl border border-[#E5E5E5] p-5">
          <span className="text-xs font-medium text-[#6B6B6B]">Puntos disponibles</span>
          <p className="mt-1 text-4xl font-semibold text-[#111111] tracking-tight">{fmt(points)}</p>
          <p className="mt-2 text-xs text-[#6B6B6B]">Ganás 1 punto por cada $10 en tus turnos.</p>
        </section>

        <nav className="mt-6 sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#EFEFEF] flex" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 h-11 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#111111] text-[#111111]'
                  : 'border-transparent text-[#8A8A8A] hover:text-[#111111]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'canjear' && (
          <div className="py-5 flex flex-col gap-8">
            <section className="flex flex-col gap-3">
              {REWARDS.map((r) => {
                const missing = r.cost - points;
                return (
                  <div key={r.id} className="rounded-2xl border border-[#E5E5E5] p-4 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-[#F1F1F1] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px] text-[#111111]">{r.icon}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111111]">{r.title}</p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{r.description}</p>
                      <p className="text-xs text-[#111111] mt-1 font-medium">{fmt(r.cost)} puntos</p>
                    </div>
                    <button
                      type="button"
                      disabled={missing > 0}
                      onClick={() => redeem(r.id)}
                      className="h-9 px-4 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-[#2A2A2A] transition-colors disabled:bg-[#F1F1F1] disabled:text-[#8A8A8A] disabled:cursor-not-allowed shrink-0"
                    >
                      {missing > 0 ? `Faltan ${fmt(missing)}` : 'Canjear'}
                    </button>
                  </div>
                );
              })}
            </section>

            {myRewards.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-[#111111]">Mis recompensas</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {myRewards.map((mr) => {
                    const reward = REWARDS.find((r) => r.id === mr.rewardId)!;
                    return (
                      <div key={mr.id} className="rounded-2xl border border-dashed border-[#111111] p-4">
                        <p className="text-sm font-semibold text-[#111111]">{reward.title}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">Mostrá este código en el salón</p>
                        <p className="mt-2 text-lg font-semibold tracking-widest text-[#111111]">{mr.code}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {tab === 'ganar' && (
          <div className="py-5 flex flex-col gap-6">
            <ul className="divide-y divide-[#F1F1F1]">
              {EARN_RULES.map((r) => (
                <li key={r.label} className="py-3.5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[22px] text-[#111111]">{r.icon}</span>
                  <span className="flex-1 text-sm text-[#111111]">{r.label}</span>
                  <span className="text-sm font-semibold text-[#111111]">{r.points}</span>
                </li>
              ))}
            </ul>

            <section className="rounded-2xl border border-[#E5E5E5] p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-[#111111]">Invitá a 3 amigas y ganá 500 puntos</h2>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{invited} de 3 completadas</p>
                <div className="mt-2 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full ${i < invited ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`} />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (invited < 3) setInvited((n) => n + 1);
                  onShowToast('Link de invitación copiado', 'link');
                }}
                className="h-10 px-4 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2A2A2A] transition-colors shrink-0"
              >
                Invitar
              </button>
            </section>
          </div>
        )}

        {tab === 'historial' && (
          <ul className="py-3 divide-y divide-[#F1F1F1]">
            {history.map((h) => (
              <li key={h.id} className="py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111111] truncate">{h.label}</p>
                  <p className="text-xs text-[#6B6B6B]">{h.date}</p>
                </div>
                <span className={`text-sm font-semibold ${h.points > 0 ? 'text-[#111111]' : 'text-[#6B6B6B]'}`}>
                  {h.points > 0 ? '+' : ''}
                  {fmt(h.points)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
