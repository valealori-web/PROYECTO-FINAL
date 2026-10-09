export interface LatLng {
  lat: number;
  lng: number;
}

/** Plaza Independencia, Montevideo: ubicación por defecto si el usuario no comparte la suya. */
export const MONTEVIDEO_CENTER: LatLng = { lat: -34.9059, lng: -56.1991 };

/** Vista inicial del mapa. */
export const CITY_CENTER: LatLng = MONTEVIDEO_CENTER;

/** Límites de Montevideo con margen, para que el mapa no se pierda por el mundo. */
export const MONTEVIDEO_BOUNDS: [[number, number], [number, number]] = [
  [-35.05, -56.6],
  [-34.65, -55.85],
];

export function isInMontevideo({ lat, lng }: LatLng): boolean {
  return (
    lat >= MONTEVIDEO_BOUNDS[0][0] &&
    lat <= MONTEVIDEO_BOUNDS[1][0] &&
    lng >= MONTEVIDEO_BOUNDS[0][1] &&
    lng <= MONTEVIDEO_BOUNDS[1][1]
  );
}

/** Distancia en km entre dos puntos (fórmula de haversine). */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `a ${Math.round(km * 10) * 100} m`;
  if (km < 10) return `a ${km.toFixed(1)} km`;
  return `a ${Math.round(km)} km`;
}

/** Convierte "< 5 km" en 5; "Todo Montevideo" (o cualquier otro valor) en null. */
export function parseMaxDistance(label: string): number | null {
  const m = label.match(/(\d+)\s*km/i);
  return m ? Number(m[1]) : null;
}
