import React, { useMemo, useState } from 'react';
import { ActiveScreen } from '../types';
import { HEADER_CONTAINER, HeaderLogo, BackButton } from '../components/HeaderParts';
import {
  LOYALTY_TIERS,
  REWARDS,
  CHALLENGES,
  STAMP_CARDS,
  BADGES,
  EARN_RULES,
  INITIAL_HISTORY,
  PointsTransaction,
} from '../data/loyaltyData';

interface LoyaltyViewProps {
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

type Tab = 'resumen' | 'canjear' | 'desafios' | 'historial';

const MEMBER_ID = 'GB-4821-7305';

const fmt = (n: number) => n.toLocaleString('es-UY');

/** Código visual de socia (maqueta): grilla determinística con marcadores en las esquinas. */
const MemberCode: React.FC<{ seed: string }> = ({ seed }) => {
  const size = 25;
  const cells = useMemo(() => {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const rand = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return (h >>> 0) / 4294967295;
    };
    const inFinder = (x: number, y: number) =>
      (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
    const out: { x: number; y: number }[] = [];
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (!inFinder(x, y) && rand() > 0.52) out.push({ x, y });
    return out;
  }, [seed]);
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#111" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#111" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" role="img" aria-label="Código de socia">
      <rect width={size} height={size} fill="#fff" />
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="1" height="1" fill="#111" />
      ))}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  );
};

export const LoyaltyView: React.FC<LoyaltyViewProps> = ({ onNavigate, onBack, onShowToast }) => {
  const [tab, setTab] = useState<Tab>('resumen');
  const [points, setPoints] = useState(1240);
  const [history, setHistory] = useState<PointsTransaction[]>(INITIAL_HISTORY);
  const [myRewards, setMyRewards] = useState<{ id: string; rewardId: string; code: string }[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<string[]>(['c-3visits']);
  const [invited, setInvited] = useState(1);
  const [showCode, setShowCode] = useState(false);

  const tierIndex = LOYALTY_TIERS.reduce((acc, t, i) => (points >= t.minPoints ? i : acc), 0);
  const tier = LOYALTY_TIERS[tierIndex];
  const nextTier = LOYALTY_TIERS[tierIndex + 1];
  const progress = nextTier
    ? Math.min(100, ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)
    : 100;

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
    { id: 'resumen', label: 'Resumen' },
    { id: 'canjear', label: 'Canjear' },
    { id: 'desafios', label: 'Desafíos' },
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

      <main className="flex-1 w-full pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="pt-6 text-xl font-semibold text-[#111111]">Puntos Glow</h1>

        {/* Estado + tarjeta de socia */}
        <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E5E5E5] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6B6B]">Puntos disponibles</span>
              <span className="px-2.5 py-1 rounded-full bg-[#111111] text-white text-xs font-semibold">
                {tier.name}
              </span>
            </div>
            <p className="mt-2 text-4xl font-semibold text-[#111111] tracking-tight">{fmt(points)}</p>

            <div className="mt-5">
              <div
                className="h-2 rounded-full bg-[#F1F1F1] overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full bg-[#111111] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-[#6B6B6B]">
                {nextTier
                  ? `Te faltan ${fmt(nextTier.minPoints - points)} puntos para ${nextTier.name}`
                  : 'Alcanzaste el nivel máximo'}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setTab('canjear')}
                className="flex-1 h-10 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2A2A2A] transition-colors"
              >
                Canjear
              </button>
              <button
                type="button"
                onClick={() => setTab('historial')}
                className="flex-1 h-10 rounded-lg bg-[#F1F1F1] text-[#111111] text-sm font-semibold hover:bg-[#E5E5E5] transition-colors"
              >
                Historial
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#111111] text-white p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/60">Tarjeta de socia</p>
                <p className="text-base font-semibold mt-0.5">Valentina Rossi</p>
              </div>
              <span className="text-xs text-white/60">{tier.name}</span>
            </div>
            <p className="mt-4 text-sm tracking-widest text-white/80">{MEMBER_ID}</p>
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="mt-auto pt-4 self-start text-sm font-semibold underline underline-offset-4"
            >
              {showCode ? 'Ocultar código' : 'Mostrar código en el salón'}
            </button>
            {showCode && (
              <div className="mt-3 self-center w-40 h-40 p-2 bg-white rounded-xl">
                <MemberCode seed={MEMBER_ID} />
              </div>
            )}
          </div>
        </section>

        {/* Tabs */}
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

        {/* RESUMEN */}
        {tab === 'resumen' && (
          <div className="py-5 flex flex-col gap-8">
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

            <section>
              <h2 className="text-sm font-semibold text-[#111111]">Tarjetas de sellos</h2>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Juntá sellos visitando tus salones favoritos.</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {STAMP_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => onNavigate({ name: 'salon_profile', salonId: card.salonId })}
                    className="rounded-2xl border border-[#E5E5E5] p-4 text-left hover:border-[#111111] transition-colors"
                  >
                    <p className="text-sm font-semibold text-[#111111] truncate">{card.salonName}</p>
                    <div className="mt-3 flex gap-1.5">
                      {Array.from({ length: card.goal }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                            i < card.stamps ? 'bg-[#111111] border-[#111111] text-white' : 'border-[#D9D9D9] text-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-[#6B6B6B]">
                      {card.stamps}/{card.goal} · {card.prize}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-[#111111]">Insignias</h2>
                <span className="text-xs text-[#6B6B6B]">
                  {BADGES.filter((b) => b.unlocked).length}/{BADGES.length}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BADGES.map((b) => (
                  <div key={b.id} className="flex flex-col items-center text-center gap-1.5" title={b.description}>
                    <span
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        b.unlocked ? 'bg-[#111111] text-white' : 'bg-[#F1F1F1] text-[#BDBDBD]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[26px]">{b.unlocked ? b.icon : 'lock'}</span>
                    </span>
                    <span className={`text-xs ${b.unlocked ? 'text-[#111111] font-medium' : 'text-[#8A8A8A]'}`}>{b.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-[#111111]">Cómo ganar puntos</h2>
              <ul className="mt-2 divide-y divide-[#F1F1F1]">
                {EARN_RULES.map((r) => (
                  <li key={r.label} className="py-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[22px] text-[#111111]">{r.icon}</span>
                    <span className="flex-1 text-sm text-[#111111]">{r.label}</span>
                    <span className="text-sm font-semibold text-[#111111]">{r.points}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-[#111111]">Beneficios de tu nivel</h2>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {LOYALTY_TIERS.map((t, i) => (
                  <div
                    key={t.id}
                    className={`rounded-2xl border p-4 ${i === tierIndex ? 'border-[#111111]' : 'border-[#E5E5E5]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#111111]">{t.name}</span>
                      <span className="text-xs text-[#6B6B6B]">{i === tierIndex ? 'Tu nivel' : `${fmt(t.minPoints)} pts`}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {t.perks.map((p) => (
                        <li key={p} className="text-xs text-[#444444] flex gap-1.5">
                          <span className="material-symbols-outlined text-[14px] mt-px">check</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CANJEAR */}
        {tab === 'canjear' && (
          <div className="py-5 flex flex-col gap-8">
            <section>
              <h2 className="text-sm font-semibold text-[#111111]">Recompensas</h2>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <p className="text-xs text-[#111111] mt-1 font-medium">{fmt(r.cost)} pts</p>
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
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-[#111111]">Mis recompensas</h2>
              {myRewards.length === 0 ? (
                <p className="mt-2 text-sm text-[#6B6B6B]">Todavía no canjeaste nada. Lo que canjees aparece acá.</p>
              ) : (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
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
              )}
            </section>
          </div>
        )}

        {/* DESAFÍOS */}
        {tab === 'desafios' && (
          <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHALLENGES.map((c) => {
              const active = activeChallenges.includes(c.id);
              return (
                <div key={c.id} className="rounded-2xl border border-[#E5E5E5] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                    <span>Quedan {c.daysLeft} días</span>
                    {c.isNew && <span className="px-2 py-0.5 rounded-full bg-[#111111] text-white font-semibold">Nuevo</span>}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[#111111]">Ganá {c.reward} puntos</p>
                    <p className="text-sm text-[#111111] mt-0.5">{c.title}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">{c.description}</p>
                  </div>
                  <div>
                    <div className="h-1.5 rounded-full bg-[#F1F1F1] overflow-hidden">
                      <div
                        className="h-full bg-[#111111] rounded-full"
                        style={{ width: `${(c.progress / c.goal) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-[#6B6B6B]">
                      {c.progress}/{c.goal}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={active}
                    onClick={() => {
                      setActiveChallenges((a) => [...a, c.id]);
                      onShowToast('Desafío activado', 'flag');
                    }}
                    className="h-10 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2A2A2A] transition-colors disabled:bg-[#F1F1F1] disabled:text-[#6B6B6B] disabled:cursor-default"
                  >
                    {active ? 'En curso' : 'Activar'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORIAL */}
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
