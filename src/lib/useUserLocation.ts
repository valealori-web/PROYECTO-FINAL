import { useCallback, useEffect, useState } from 'react';
import { LatLng, MONTEVIDEO_CENTER, isInMontevideo } from './geo';

export type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable';

/**
 * Ubicación real del usuario vía Geolocation API. Si no hay permiso, no hay soporte
 * o está fuera de Montevideo, cae en el centro de Montevideo (isFallback = true).
 */
export function useUserLocation() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');

  const locate = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('granted');
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  const isReal = position !== null && isInMontevideo(position);
  return {
    position: isReal ? position : MONTEVIDEO_CENTER,
    isFallback: !isReal,
    status,
    locate,
  };
}
