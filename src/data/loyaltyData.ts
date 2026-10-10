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

export const EARN_RULES: { icon: string; label: string; points: string }[] = [
  { icon: 'event_available', label: 'Asistir a un turno reservado', points: '1 punto cada $10' },
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
