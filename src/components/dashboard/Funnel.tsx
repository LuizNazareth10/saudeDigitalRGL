"use client";
import * as React from "react";
import { Target, CheckCircle2, Gauge } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { KPI, ChartCard, useChartTheme } from "./primitives";
import { useStore } from "@/providers/store-provider";

const STEP_LABELS = ["Identificação", "Localização", "Beneficiários", "Contratação", "Características", "Hospitais", "Resultado"];

export function Funnel() {
  const { leads } = useStore();
  const ct = useChartTheme();

  const counts = STEP_LABELS.map((_, i) => leads.filter((l) => l.step >= i + 1).length);
  const data = STEP_LABELS.map((label, i) => ({
    name: `Tela ${i + 1}`,
    label,
    count: counts[i],
    pct: counts[0] ? (counts[i] / counts[0]) * 100 : 0,
    drop: i === 0 ? 0 : counts[i - 1] ? ((counts[i - 1] - counts[i]) / counts[i - 1]) * 100 : 0,
    time: 12 + i * 9 + (i === 5 ? 18 : 0),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Entradas (Tela 1)" value={counts[0]} icon={Target} />
        <KPI label="Conclusões (Tela 7)" value={counts[6]} icon={CheckCircle2} accent="#06b6d4" />
        <KPI label="Conversão total" value={`${data[6].pct.toFixed(1)}%`} icon={Gauge} accent="#6366f1" />
      </div>

      <ChartCard title="Conversão por etapa">
        <div className="space-y-2.5">
          {data.map((d) => (
            <div key={d.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="font-mono text-xs text-faint">{d.name}</span> {d.label}</span>
                <span className="flex items-center gap-3">
                  {d.drop > 0 && <span className="text-xs text-rose-500">−{d.drop.toFixed(0)}%</span>}
                  <span className="font-mono text-sm">{d.pct.toFixed(0)}%</span>
                  <span className="w-12 text-right font-mono text-xs text-faint">{d.count}</span>
                </span>
              </div>
              <div className="h-7 overflow-hidden rounded-lg bg-slate-400/15">
                <div className="brand-gradient h-full rounded-lg transition-all duration-700" style={{ width: `${d.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Tempo médio por etapa (s)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ left: -20, top: 6 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ct.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ct.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...ct.tooltip} />
            <Bar dataKey="time" radius={[6, 6, 0, 0]} fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
