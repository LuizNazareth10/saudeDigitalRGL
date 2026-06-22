"use client";
import * as React from "react";
import { Smartphone, Monitor, Tablet, Globe } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { KPI, ChartCard, useChartTheme, PIE } from "./primitives";
import { Card } from "@/components/ui/card";
import { useStore } from "@/providers/store-provider";

function dist<T extends string>(arr: { key: T; completed: boolean }[]) {
  const m: Record<string, { total: number; done: number }> = {};
  arr.forEach((x) => { m[x.key] = m[x.key] || { total: 0, done: 0 }; m[x.key].total++; if (x.completed) m[x.key].done++; });
  return Object.entries(m).map(([name, v]) => ({ name, value: v.total, conv: v.total ? (v.done / v.total) * 100 : 0 })).sort((a, b) => b.value - a.value);
}

export function UX() {
  const { leads } = useStore();
  const ct = useChartTheme();

  const devices = dist(leads.map((l) => ({ key: l.device, completed: l.completed })));
  const browsers = dist(leads.map((l) => ({ key: l.browser, completed: l.completed })));
  const oses = dist(leads.map((l) => ({ key: l.os, completed: l.completed })));

  const dIcon: Record<string, any> = { mobile: Smartphone, desktop: Monitor, tablet: Tablet };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {devices.map((d) => {
          const Ic = dIcon[d.name] ?? Globe;
          return <KPI key={d.name} label={d.name[0].toUpperCase() + d.name.slice(1)} value={d.value} sub={`${d.conv.toFixed(0)}% conversão`} icon={Ic} />;
        })}
        <KPI label="Navegadores" value={browsers.length} icon={Globe} accent="#6366f1" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Dispositivos">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={devices} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={3}>
                {devices.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip {...ct.tooltip} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Navegadores</h3>
          <div className="space-y-2.5">
            {browsers.map((b, i) => (
              <Row key={b.name} name={b.name} value={b.value} conv={b.conv} max={browsers[0].value} color={PIE[i % PIE.length]} />
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Sistemas operacionais</h3>
          <div className="space-y-2.5">
            {oses.map((o, i) => (
              <Row key={o.name} name={o.name} value={o.value} conv={o.conv} max={oses[0].value} color={PIE[i % PIE.length]} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ name, value, conv, max, color }: { name: string; value: number; conv: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-sm">{name}</span>
      <div className="h-5 flex-1 overflow-hidden rounded-md bg-slate-400/15">
        <div className="h-full rounded-md" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="w-8 text-right font-mono text-sm">{value}</span>
      <span className="w-14 text-right font-mono text-xs text-faint">{conv.toFixed(0)}%</span>
    </div>
  );
}
