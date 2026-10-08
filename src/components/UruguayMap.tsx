import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Salon } from '../types';
import { LatLng, URUGUAY_BOUNDS, URUGUAY_CENTER } from '../lib/geo';

interface UruguayMapProps {
  salons: Salon[];
  selectedId?: string;
  onSelect: (salonId: string) => void;
  /** Ubicación del usuario; solo se dibuja si es real (no el fallback). */
  userPosition?: LatLng | null;
  /** Cambia cada vez que el usuario pide re-centrar. */
  recenterToken?: number;
  /** Si es true, al montar vuela al salón seleccionado en vez de mostrar todos. */
  focusSelectedOnMount?: boolean;
}

const escapeHtml = (t: string) =>
  t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function pinHtml(salon: Salon, selected: boolean) {
  const price = salon.services[0]?.price ?? '';
  return `
    <div class="gb-pin ${selected ? 'gb-pin--selected' : ''}">
      <div class="gb-pin__bubble">
        <img src="${escapeHtml(salon.logo)}" alt="" />
        <div class="gb-pin__text">
          <span class="gb-pin__name">${escapeHtml(salon.name.split(' ')[0])}</span>
          <span class="gb-pin__price">${escapeHtml(price)}</span>
        </div>
      </div>
      <div class="gb-pin__stem"></div>
      <div class="gb-pin__dot"></div>
    </div>`;
}

export const UruguayMap: React.FC<UruguayMapProps> = ({
  salons,
  selectedId,
  onSelect,
  userPosition,
  recenterToken = 0,
  focusSelectedOnMount = false,
}) => {
  const firstFlyRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Crear el mapa una sola vez
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [URUGUAY_CENTER.lat, URUGUAY_CENTER.lng],
      zoom: 7,
      minZoom: 6,
      maxBounds: URUGUAY_BOUNDS,
      maxBoundsViscosity: 0.8,
      zoomControl: false,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    const markers = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
      userMarkerRef.current = null;
    };
  }, []);

  const fitToSalons = (animate: boolean) => {
    const map = mapRef.current;
    if (!map || salons.length === 0) return;
    const points = salons.map((s) => [s.coordinates.lat, s.coordinates.lng] as [number, number]);
    if (points.length === 1) {
      map.setView(points[0], 15, { animate });
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 14, animate });
    }
  };

  // Sincronizar marcadores con los salones filtrados y ajustar la vista
  const salonKey = salons.map((s) => s.id).join('|');
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;
    const ids = new Set(salons.map((s) => s.id));

    markers.forEach((marker, id) => {
      if (!ids.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    });

    for (const salon of salons) {
      const icon = L.divIcon({
        className: 'gb-pin-wrapper',
        html: pinHtml(salon, salon.id === selectedId),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      const existing = markers.get(salon.id);
      if (existing) {
        existing.setIcon(icon);
      } else {
        const marker = L.marker([salon.coordinates.lat, salon.coordinates.lng], { icon, keyboard: true, title: salon.name })
          .on('click', () => onSelectRef.current(salon.id))
          .addTo(map);
        markers.set(salon.id, marker);
      }
      markers.get(salon.id)!.setZIndexOffset(salon.id === selectedId ? 1000 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salons, selectedId]);

  // Re-encuadrar solo cuando cambia el conjunto de salones o se pide re-centrar
  useEffect(() => {
    fitToSalons(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salonKey, recenterToken]);

  // Volar al salón seleccionado
  useEffect(() => {
    const map = mapRef.current;
    const salon = salons.find((s) => s.id === selectedId);
    if (!map || !salon) return;
    if (firstFlyRef.current) {
      firstFlyRef.current = false;
      if (!focusSelectedOnMount) return;
    }
    map.flyTo([salon.coordinates.lat, salon.coordinates.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Marcador de ubicación del usuario
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
    if (!userPosition) return;
    userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
      icon: L.divIcon({
        className: 'gb-user-wrapper',
        html: '<div class="gb-user"><span class="gb-user__pulse"></span><span class="gb-user__dot"></span></div>',
        iconSize: [0, 0],
      }),
      interactive: false,
      keyboardable: false,
    } as L.MarkerOptions).addTo(map);
  }, [userPosition]);

  return <div ref={containerRef} className="absolute inset-0 z-0" role="application" aria-label="Mapa de salones en Uruguay" />;
};
