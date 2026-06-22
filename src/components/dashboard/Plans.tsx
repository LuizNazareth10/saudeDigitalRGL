"use client";
import * as React from "react";
import { Award, Layers, Building2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { KPI, ChartCard, useChartTheme, PIE } from "./primitives";
import { Card } from "@/components/ui/card";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { OPERATORS } from "@/lib/data/operators";
import { useStore } from "@/providers/store-provider";
import { BRL } from "@/lib/format";
import type { OperatorId } from "@/types";

export function Plans() {
  const { leads } = useStore();
  const ct = useChartTheme();
  const completed = leads.filter((l) => l.completed && l.selectedPlan);

  const byPlan = React.useMemo(() => {
    const m: Record<string, number> = {};
    completed.forEach((l) => { m[l.selectedPlan!] = (m[l.selectedPlan!] || 0) + 1; });
    return Object.entries(m).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [completed]);

  const byOp = React.useMemo(() => {
    const m: Record<string, number> = {};
    completed.forEach((l) => { m[l.selectedOperator!] = (m[l.selectedOperator!] || 0) + 1; });
    return Object.entries(m).map(([id, value]) => ({ id, name: OPERATORS[id as OperatorId]?.short ?? id, value }));
  }, [completed]);

  const prices = completed.map((l) => l.selectedPrice!).filter(Boolean);
  const minP = prices.length ? Math.min(...prices) : 0;
  const maxP = prices.length ? Math.max(...prices) : 0;
  const avgP = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Planos sugeridos" value={completed.length} icon={Layers} />
        <KPI label="Plano mais escolhido" value={byPlan[0]?.name ?? "—"} sub={`${byPlan[0]?.count ?? 0} vezes`} icon={Award} accent="#06b6d4" />
        <KPI label="Faixa de mensalidade" value={`${BRL(minP)}–${BRL(maxP)}`} sub={`média sugerida ${BRL(avgP)}`} icon={Building2} accent="#6366f1" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Distribuição por operadora">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byOp} dataKey="value" nameKey="name" innerRadius={55} outerRadius={92} paddingAngle={3}>
                {byOp.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip {...ct.tooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
            {byOp.map((o, i) => (
              <span key={o.id} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE[i % PIE.length] }} /> {o.name}
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Planos mais escolhidos">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byPlan.slice(0, 6)} layout="vertical" margin={{ left: 30, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: ct.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: ct.axis, fontSize: 10 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip {...ct.tooltip} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Operadoras por volume de propostas</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {byOp.sort((a, b) => b.value - a.value).map((o) => (
            <div key={o.id} className="flex items-center gap-3 rounded-xl border surface p-3">
              <OperatorMark op={o.id as OperatorId} size={40} />
              <div>
                <div className="text-sm font-medium">{o.name}</div>
                <div className="font-mono text-xs text-faint">{o.value} propostas</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
