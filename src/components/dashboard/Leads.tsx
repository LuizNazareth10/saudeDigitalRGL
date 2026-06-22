"use client";
import * as React from "react";
import { Search, Download, CheckCircle2, Circle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/providers/store-provider";
import { BRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types";

type Filter = "todos" | "concluidas" | "abandonadas";

export function Leads() {
  const { leads } = useStore();
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("todos");

  const filtered = React.useMemo(() => {
    return leads.filter((l) => {
      if (filter === "concluidas" && !l.completed) return false;
      if (filter === "abandonadas" && l.completed) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return l.name.toLowerCase().includes(s) || l.city.toLowerCase().includes(s) || l.phone.includes(s);
    });
  }, [leads, q, filter]);

  const exportCSV = () => {
    const headers = ["ID", "Nome", "Telefone", "Cidade", "UF", "Idade", "Etapa", "Concluída", "Plano", "Operadora", "Mensalidade", "Data"];
    const rows = filtered.map((l) => [
      l.id, l.name, l.phone, l.city, l.uf, l.age, l.step, l.completed ? "Sim" : "Não",
      l.selectedPlan ?? "", l.selectedOperator ?? "", l.selectedPrice ?? "",
      new Date(l.createdAt).toLocaleString("pt-BR"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-rgl-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const FILTERS: [Filter, string][] = [["todos", "Todos"], ["concluidas", "Concluídas"], ["abandonadas", "Abandonadas"]];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, cidade ou telefone…" className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border surface p-1">
            {FILTERS.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition", filter === k ? "brand-gradient text-white" : "text-muted")}>
                {label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-3.5 w-3.5" /> CSV</Button>
        </div>
      </div>

      <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-2.5 text-xs text-muted">
        <Users className="mr-1.5 inline h-3.5 w-3.5 text-brand-500" />
        Todos os operadores visualizam todos os leads. Exibindo <strong>{filtered.length}</strong> de {leads.length}.
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left font-mono text-[11px] uppercase tracking-wider text-faint">
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Local</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Plano sugerido</th>
                <th className="px-4 py-3 text-right font-medium">Mensalidade</th>
                <th className="px-4 py-3 text-right font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 60).map((l: Lead) => (
                <tr key={l.id} className="border-b transition last:border-0 hover:bg-black/[.02] dark:hover:bg-white/[.03]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="font-mono text-xs text-faint">{l.phone}</div>
                  </td>
                  <td className="px-4 py-3"><div>{l.city}</div><div className="text-xs text-faint">{l.uf} · {l.age} anos</div></td>
                  <td className="px-4 py-3">
                    {l.completed
                      ? <Badge className="border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400"><CheckCircle2 className="h-3 w-3" /> Concluída</Badge>
                      : <Badge className="surface text-muted"><Circle className="h-3 w-3" /> Etapa {l.step}/7</Badge>}
                  </td>
                  <td className="px-4 py-3">{l.selectedPlan ?? <span className="text-faint">—</span>}</td>
                  <td className="px-4 py-3 text-right font-mono">{l.selectedPrice ? BRL(l.selectedPrice) : <span className="text-faint">—</span>}</td>
                  <td className="px-4 py-3 text-right text-xs text-faint">{new Date(l.createdAt).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
