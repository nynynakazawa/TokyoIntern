"use client";

import { useEffect } from "react";

export interface Marker {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

export default function MapModal({
  isOpen,
  onClose,
  markers,
}: {
  isOpen: boolean;
  onClose: () => void;
  markers: Marker[];
}) {
  // Mapbox SDK 等は後でここで初期化
  useEffect(() => {
    if (!isOpen) return;
    /* TODO:
       import("@mapbox/mapbox-gl").then(({ default: mapboxgl }) => {
         const map = new mapboxgl.Map({ … });
         markers.forEach(m => new mapboxgl.Marker().setLngLat([m.lng, m.lat]).addTo(map));
       });
    */
  }, [isOpen, markers]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="h-[80vh] w-[90vw] max-w-3xl overflow-hidden rounded bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="font-bold">企業マップ</h2>
          <button onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div id="map-container" className="h-full w-full bg-gray-100">
          {/* 地図がここに描画される予定 */}
          <p className="flex h-full items-center justify-center text-gray-400">
            Map Coming Soon…
          </p>
        </div>
      </div>
    </div>
  );
}