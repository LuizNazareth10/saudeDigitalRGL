"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { MapPin, Building2, Navigation } from "lucide-react";
import { KPI, ChartCard } from "./primitives";
import { Card } from "@/components/ui/card";
import { useStore } from "@/providers/store-provider";
import type { CityDensity } from "./HospitalMap";

const HospitalMap = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => <div className="skeleton h-[420px] w-full rounded-2xl" />,
});

export function Geographic() {
  const { leads } = useStore();

  const density: CityDensity[] = React.useMemo(() => {
    const m: Record<string, { leads: number; completed: number }> = {};
    leads.forEach((l) => {
      m[l.city] = m[l.city] || { leads: 0, completed: 0 };
      m[l.city].leads++;
      if (l.completed) m[l.city].completed++;
    });
    return Object.entries(m)
      .map(([city, v]) => ({ city, leads: v.leads, conv: v.leads ? (v.completed / v.leads) * 100 : 0 }))
      .sort((a, b) => b.leads - a.leads);
  }, [leads]);

  const topCity = density[0]?.city ?? "—";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Cidades atendidas" value={density.length} icon={MapPin} />
        <KPI label="Cidade líder" value={topCity} sub={`${density[0]?.leads ?? 0} leads`} icon={Navigation} accent="#06b6d4" />
        <KPI label="Hospitais mapeados" value={8} icon={Building2} accent="#6366f1" />
      </div>

      <ChartCard title="Mapa de cobertura — região de Juiz de Fora / MG">
        <HospitalMap density={density} />
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-brand-500" /> Hospitais da rede</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-accent-500/40" /> Densidade de leads por cidade</span>
        </div>
      </ChartCard>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Leads por cidade</h3>
        <div className="space-y-2.5">
          {density.map((d) => {
            const max = density[0].leads;
            return (
              <div key={d.city} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-sm">{d.city}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-lg bg-slate-400/15">
                  <div className="brand-gradient h-full rounded-lg" style={{ width: `${(d.leads / max) * 100}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-sm">{d.leads}</span>
                <span className="w-16 text-right font-mono text-xs text-faint">{d.conv.toFixed(0)}% conv</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
