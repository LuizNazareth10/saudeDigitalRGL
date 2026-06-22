"use client";
import * as React from "react";
import {
  Users, Zap, TrendingUp, Clock, Target, CheckCircle2, Gauge, FileText, Award, Crown,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell,
} from "recharts";
import { KPI, ChartCard, useChartTheme, PIE } from "./primitives";
import { useStore } from "@/providers/store-provider";
import { isSameDay, withinDays } from "@/lib/seed-leads";

export function Executive() {
  const { leads } = useStore();
  const ct = useChartTheme();

  const total = leads.length;
  const today = leads.filter((l) => isSameDay(l.createdAt)).length;
  const week = leads.filter((l) => withinDays(l.createdAt, 7)).length;
  const month = leads.filter((l) => withinDays(l.createdAt, 30)).length;
  const completed = leads.filter((l) => l.completed).length;
  const proposals = leads.filter((l) => l.proposalGenerated).length;
  const convRate = total ? ((completed / total) * 100).toFixed(1) : "0";

  const planLeader = React.useMemo(() => {
    const m: Record<string, number> = {};
    leads.forEach((l) => { if (l.selectedPlan) m[l.selectedPlan] = (m[l.selectedPlan] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [leads]);

  const opLeader = React.useMemo(() => {
    const m: Record<string, number> = {};
    leads.forEach((l) => { if (l.selectedOperator) m[l.selectedOperator] = (m[l.selectedOperator] || 0) + 1; });
    return Object.entries(m).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [leads]);

  const byDay = React.useMemo(() => {
    const m: Record<string, { day: string; leads: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(2026, 5, 20 - i);
      m[d.toISOString().slice(0, 10)] = { day: `${d.getDate()}/${d.getMonth() + 1}`, leads: 0 };
    }
    leads.forEach((l) => { const k = l.createdAt.slice(0, 10); if (m[k]) m[k].leads++; });
    return Object.values(m);
  }, [leads]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Leads totais" value={total} icon={Users} />
        <KPI label="Leads hoje" value={today} icon={Zap} accent="#06b6d4" />
        <KPI label="Leads na semana" value={week} icon={TrendingUp} accent="#6366f1" />
        <KPI label="Leads no mês" value={month} icon={Clock} accent="#8b5cf6" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Jornadas iniciadas" value={total} icon={Target} />
        <KPI label="Jornadas concluídas" value={completed} icon={CheckCircle2} accent="#06b6d4" />
        <KPI label="Taxa de conclusão" value={`${convRate}%`} icon={Gauge} accent="#6366f1" />
        <KPI label="Propostas geradas" value={proposals} icon={FileText} accent="#f59e0b" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KPI label="Plano mais sugerido" value={planLeader} sub="por volume de propostas" icon={Award} />
        <KPI label="Operadora líder" value={opLeader[0]?.name ?? "—"} sub="por volume de propostas" icon={Crown} accent="#f59e0b" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Leads nos últimos 14 dias">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={byDay} margin={{ left: -18, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="exg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: ct.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: ct.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...ct.tooltip} />
                <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fill="url(#exg)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Propostas por operadora">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={opLeader} margin={{ left: -20, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: ct.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: ct.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...ct.tooltip} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {opLeader.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
