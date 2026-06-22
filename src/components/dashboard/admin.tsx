"use client";
import * as React from "react";
import { Shield, Plus, MapPin, Layers, SlidersHorizontal, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { SEED_USERS } from "@/lib/auth";
import { OPERATOR_LIST } from "@/lib/data/operators";
import { PLANS } from "@/lib/data/plans";
import { AGE_BANDS, MODIFIERS } from "@/lib/pricing";
import { WEIGHTS } from "@/lib/recommendation";
import { BRL, pct } from "@/lib/format";
import type { OperatorId } from "@/types";

function Header({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div><h2 className="text-lg font-semibold">{title}</h2><p className="text-sm text-muted">{desc}</p></div>
      {action}
    </div>
  );
}

const roleBadge: Record<string, string> = {
  admin: "border-rose-500/30 bg-rose-500/10 text-rose-500",
  gestor: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  operador: "border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400",
};

export function AdminUsers() {
  return (
    <div>
      <Header title="Usuários e permissões" desc="Controle de acesso por perfil." action={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Novo usuário</Button>} />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left font-mono text-[11px] uppercase tracking-wider text-faint">
            <th className="px-4 py-3 font-medium">Usuário</th><th className="px-4 py-3 font-medium">E-mail</th><th className="px-4 py-3 font-medium">Perfil</th><th className="px-4 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {SEED_USERS.map((u) => (
              <tr key={u.email} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{u.email}</td>
                <td className="px-4 py-3"><Badge className={roleBadge[u.role]}><Shield className="h-3 w-3" /> {u.role}</Badge></td>
                <td className="px-4 py-3"><Badge className="border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400">Ativo</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function AdminOperators() {
  return (
    <div>
      <Header title="Operadoras" desc="Cobertura por localidade. As regionais são limitadas por cidade; Sul América é nacional." />
      <div className="grid gap-4 sm:grid-cols-2">
        {OPERATOR_LIST.map((o) => (
          <Card key={o.id} className="p-5">
            <div className="flex items-center gap-3">
              <OperatorMark op={o.id} size={44} />
              <div><div className="font-semibold">{o.name}</div><div className="text-xs text-muted">{o.note}</div></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-faint"><MapPin className="h-3.5 w-3.5" /> Cidades atendidas</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {o.regions.includes("*")
                ? <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500">Cobertura nacional</Badge>
                : o.regions.map((c) => <Badge key={c} className="surface">{c}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminPlans() {
  return (
    <div>
      <Header title="Planos" desc="Catálogo com mensalidade-base de mercado, rede e margem." action={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Novo plano</Button>} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left font-mono text-[11px] uppercase tracking-wider text-faint">
              <th className="px-4 py-3 font-medium">Plano</th><th className="px-4 py-3 font-medium">Tier</th><th className="px-4 py-3 font-medium">Rede</th>
              <th className="px-4 py-3 text-right font-medium">Margem</th><th className="px-4 py-3 text-right font-medium">Base</th>
            </tr></thead>
            <tbody>
              {PLANS.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><OperatorMark op={p.operator} size={28} /><span className="font-medium">{p.name}</span></div></td>
                  <td className="px-4 py-3"><Badge className="surface">{p.tier}</Badge></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.network.length} hospitais</td>
                  <td className="px-4 py-3 text-right font-mono">{pct(p.margin * 100)}</td>
                  <td className="px-4 py-3 text-right font-mono">{BRL(p.basePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function AdminPrices() {
  return (
    <div className="space-y-6">
      <Header title="Regras de precificação" desc="Faixas etárias ANS, modificadores e pesos do score — toda a lógica de negócio centralizada." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4 text-brand-500" /> Faixas etárias (ANS)</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AGE_BANDS.map((b) => (
              <div key={b.label} className="rounded-lg border surface p-2.5 text-center">
                <div className="font-mono text-xs text-faint">{b.label}</div>
                <div className="font-mono text-sm font-semibold">×{b.mult}</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold">Modificadores</div>
            <Mod label="Apartamento (vs enfermaria)" v={`×${MODIFIERS.apartamento}`} />
            <Mod label="Sem coparticipação (vs com)" v={`×${MODIFIERS.semCoparticipacao}`} />
            <Mod label="Dependente (titular = ×1.0)" v={`×${MODIFIERS.dependente}`} />
          </Card>
          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold">Pesos do score</div>
            <Mod label="Cobertura de hospitais" v={pct(WEIGHTS.hospital * 100)} />
            <Mod label="Menor preço" v={pct(WEIGHTS.price * 100)} />
            <Mod label="Maior margem" v={pct(WEIGHTS.margin * 100)} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Mod({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted">{label}</span><span className="font-mono font-semibold text-brand-500">{v}</span>
    </div>
  );
}

const AUDIT = [
  { who: "admin@segurosdigital.com.br", what: "Atualizou margem do plano Unimed Premium", when: "Há 2 horas" },
  { who: "gestor@segurosdigital.com.br", what: "Exportou relatório de leads (CSV)", when: "Há 5 horas" },
  { who: "admin@segurosdigital.com.br", what: "Criou usuário operador", when: "Ontem" },
  { who: "operador@segurosdigital.com.br", what: "Visualizou proposta #L1043", when: "Ontem" },
  { who: "admin@segurosdigital.com.br", what: "Alterou peso do score (hospital 0.5)", when: "Há 2 dias" },
];

export function AdminAudit() {
  return (
    <div>
      <Header title="Auditoria" desc="Trilha de ações no sistema." />
      <Card className="p-2">
        {AUDIT.map((a, i) => (
          <div key={i} className="flex items-start gap-3 border-b p-3 last:border-0">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-500/10"><History className="h-4 w-4 text-brand-500" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm">{a.what}</div>
              <div className="font-mono text-xs text-faint">{a.who}</div>
            </div>
            <span className="shrink-0 text-xs text-faint">{a.when}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
