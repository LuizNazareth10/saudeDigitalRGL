"use client";
import * as React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HOSPITALS } from "@/lib/data/hospitals";

export interface CityDensity {
  city: string;
  leads: number;
  conv: number;
}

const CITY_COORDS: Record<string, [number, number]> = {
  "Juiz de Fora": [-21.7642, -43.3503],
  "Matias Barbosa": [-21.8628, -43.3306],
  "Santos Dumont": [-21.4622, -43.5519],
  "Lima Duarte": [-21.8419, -43.7928],
  "Bicas": [-21.7186, -43.0631],
  "Coronel Pacheco": [-21.5778, -43.2675],
  "Chácara": [-21.6594, -43.2306],
};

export default function HospitalMap({ density }: { density: CityDensity[] }) {
  const maxLeads = Math.max(1, ...density.map((d) => d.leads));
  return (
    <MapContainer center={[-21.74, -43.4]} zoom={10} scrollWheelZoom={false} style={{ height: 420, width: "100%", borderRadius: "1rem" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Densidade de leads por cidade (heat) */}
      {density.map((d) => {
        const coords = CITY_COORDS[d.city];
        if (!coords) return null;
        const radius = 14 + (d.leads / maxLeads) * 36;
        return (
          <CircleMarker key={`c-${d.city}`} center={coords} radius={radius}
            pathOptions={{ color: "#06b6d4", fillColor: "#06b6d4", fillOpacity: 0.18, weight: 1 }}>
            <LTooltip>{d.city}: {d.leads} leads · {d.conv.toFixed(0)}% conversão</LTooltip>
          </CircleMarker>
        );
      })}

      {/* Hospitais */}
      {HOSPITALS.map((h) => (
        <CircleMarker key={h.id} center={[h.lat, h.lng]} radius={7}
          pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.9, weight: 2 }}>
          <Popup>
            <strong>{h.name}</strong>
            <br />
            {h.area}, {h.city}
            <br />
            {h.tags.join(" · ")}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
