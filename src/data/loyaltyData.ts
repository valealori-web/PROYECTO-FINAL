export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  perks: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { id: 'glow', name: 'Glow', minPoints: 0, perks: ['1 punto cada $10 en servicios', 'Regalo de cumpleaños'] },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    minPoints: 1000,
    perks: ['Todo lo de Glow', '1,25 puntos cada $10', 'Acceso anticipado a turnos de último momento'],
  },
  {
    id: 'black',
    name: 'Black',
    minPoints: 2500,
    perks: ['Todo lo de Rose Gold', '1,5 puntos cada $10', 'Un servicio de cortesía por año'],
  },
];

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
}

export const REWARDS: Reward[] = [
  { id: 'r-10off', title: '10% off en tu próximo servicio', description: 'Válido en cualquier salón adherido.', cost: 500, icon: 'sell' },
  { id: 'r-credit', title: '$500 de crédito', description: 'Se descuenta de tu próxima reserva.', cost: 800, icon: 'payments' },
  { id: 'r-brows', title: 'Perfilado de cejas de cortesía', description: 'En Brow Bar Atelier.', cost: 1200, icon: 'visibility' },
  { id: 'r-hydra', title: 'Tratamiento de hidratación', description: 'En Maison Hair Co. Studio.', cost: 1500, icon: 'water_drop' },
  { id: 'r-nails', title: 'Esmaltado semipermanente', description: 'En Studio Velvet Nails.', cost: 1800, icon: 'brush' },
  { id: 'r-facial', title: 'Limpieza facial express', description: 'En Clínica Lumière.', cost: 2200, icon: 'spa' },
];

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  daysLeft: number;
  progress: number;
  goal: number;
  isNew?: boolean;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'c-3visits',
    title: 'Tres visitas en 30 días',
    description: 'Asistí a 3 turnos reservados con Glow Buzz.',
    reward: 300,
    daysLeft: 12,
    progress: 1,
    goal: 3,
    isNew: true,
  },
  {
    id: 'c-reviews',
    title: 'Contá cómo te fue',
    description: 'Dejá 2 reseñas con foto de tus últimos servicios.',
    reward: 150,
    daysLeft: 8,
    progress: 1,
    goal: 2,
  },
  {
    id: 'c-explore',
    title: 'Probá algo nuevo',
    description: 'Reservá un servicio de una categoría que no hayas probado.',
    reward: 200,
    daysLeft: 20,
    progress: 0,
    goal: 1,
    isNew: true,
  },
];

export interface StampCard {
  id: string;
  salonId: string;
  salonName: string;
  goal: number;
  stamps: number;
  prize: string;
}

export const STAMP_CARDS: StampCard[] = [
  { id: 's-maison', salonId: 'maison-hair-co', salonName: 'Maison Hair Co. Studio', goal: 5, stamps: 3, prize: '20% off en tu 5ta visita' },
  { id: 's-velvet', salonId: 'studio-velvet-nails', salonName: 'Studio Velvet Nails', goal: 4, stamps: 1, prize: 'Nail art de regalo' },
  { id: 's-brow', salonId: 'brow-bar-atelier', salonName: 'Brow Bar Atelier', goal: 6, stamps: 0, prize: 'Laminado gratis' },
];

export interface LoyaltyBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const BADGES: LoyaltyBadge[] = [
  { id: 'b-first', name: 'Primera reserva', description: 'Reservaste tu primer turno.', icon: 'event_available', unlocked: true },
  { id: 'b-review', name: 'Reseñadora', description: 'Dejaste tu primera reseña.', icon: 'rate_review', unlocked: true },
  { id: 'b-photo', name: 'Look real', description: 'Subiste tu primer look.', icon: 'photo_camera', unlocked: true },
  { id: 'b-loyal', name: 'Fiel', description: '3 visitas al mismo salón.', icon: 'favorite', unlocked: false },
  { id: 'b-explorer', name: 'Exploradora', description: 'Visitaste 3 barrios distintos.', icon: 'explore', unlocked: false },
  { id: 'b-friends', name: 'Embajadora', description: 'Invitaste a 3 amigas.', icon: 'group_add', unlocked: false },
];

export const EARN_RULES: { icon: string; label: string; points: string }[] = [
  { icon: 'event_available', label: 'Asistir a un turno reservado', points: '1 pt cada $10' },
  { icon: 'rate_review', label: 'Reseña con foto', points: '+50' },
  { icon: 'photo_camera', label: 'Subir un look', points: '+30' },
  { icon: 'group_add', label: 'Invitar a una amiga', points: '+200' },
];

export interface PointsTransaction {
  id: string;
  label: string;
  points: number;
  date: string;
}

export const INITIAL_HISTORY: PointsTransaction[] = [
  { id: 't1', label: 'Maison Hair Co. · Balayage Signature', points: 390, date: '12 Sep' },
  { id: 't2', label: 'Reseña con foto', points: 50, date: '12 Sep' },
  { id: 't3', label: 'Studio Velvet Nails · Kapping Gel', points: 145, date: '28 Ago' },
  { id: 't4', label: 'Look subido a tu perfil', points: 30, date: '28 Ago' },
  { id: 't5', label: 'Amiga invitada: Camila', points: 200, date: '15 Ago' },
  { id: 't6', label: 'Bono de bienvenida', points: 425, date: '02 Ago' },
];
