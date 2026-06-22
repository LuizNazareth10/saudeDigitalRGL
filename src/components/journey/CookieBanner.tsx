"use client";
import * as React from "react";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "rgl-geo-consent";

export interface GeoData {
  lat: number;
  lng: number;
  city?: string;
  neighborhood?: string;
}

interface Props {
  onGeo: (data: GeoData | null) => void;
}

export function CookieBanner({ onGeo }: Props) {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // already accepted — pass stored geo back
        if (parsed.accepted && parsed.lat) onGeo({ lat: parsed.lat, lng: parsed.lng, city: parsed.city, neighborhood: parsed.neighborhood });
      } catch {}
      return;
    }
    // Show banner after short delay
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: false }));
    setVisible(false);
    onGeo(null);
  };

  const accept = () => {
    setLoading(true);
    if (!("geolocation" in navigator)) {
      dismiss();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let city: string | undefined;
        let neighborhood: string | undefined;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt`,
            { headers: { "User-Agent": "SegurosDigitalRGL/1.0" } }
          );
          const data = await res.json();
          city = data.address?.city || data.address?.town || data.address?.municipality;
          neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.village;
        } catch {}
        const geo: GeoData = { lat, lng, city, neighborhood };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, ...geo }));
        onGeo(geo);
        setVisible(false);
        setLoading(false);
      },
      () => { dismiss(); setLoading(false); },
      { timeout: 8000 }
    );
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:w-[360px] animate-fadeUp">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-faint transition hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-start gap-3 pr-4">
          <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/10">
            <MapPin className="h-4 w-4 text-brand-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Ativar localização?</div>
            <div className="mt-0.5 text-xs text-slate-400">
              Usamos sua localização para personalizar os planos e preencher automaticamente sua cidade.
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" onClick={accept} disabled={loading}>
            {loading ? "Obtendo…" : "Sim, ativar"}
          </Button>
          <Button size="sm" variant="outline" onClick={dismiss} disabled={loading}>
            Agora não
          </Button>
        </div>
      </div>
    </div>
  );
}
