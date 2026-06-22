"use client";
import * as React from "react";
import {
  Award, Sparkles, Hospital, ChevronDown, CheckCircle2, Star, Users, MapPin, User, Percent, Bed,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { cn } from "@/lib/utils";
import { BRL } from "@/lib/format";
import { OPERATORS } from "@/lib/data/operators";
import { HOSPITAL_MAP } from "@/lib/data/hospitals";
import { recommend } from "@/lib/recommendation";
import type { SimulationInput } from "@/types";
import { useStore } from "@/providers/store-provider";
import { useJourney } from "./JourneyProvider";

export function ResultSkeleton() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="skeleton h-7 w-7 rounded-full" />
        <div className="skeleton h-8 w-72 rounded-lg" />
      </div>
      <div className="grid gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2"><div className="skeleton h-4 w-40 rounded" /><div className="skeleton h-3 w-24 rounded" /></div>
              <div className="skeleton h-9 w-24 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Result() {
  const { state } = useJourney();
  const { addLead, refreshLeads } = useStore();
  const [open, setOpen] = React.useState<string | null>(null);
  const savedRef = React.useRef(false);

  const input: SimulationInput = {
    city: state.city, uf: state.uf,
    beneficiaries: state.beneficiaries,
    contract: (state.contract || "individual") as SimulationInput["contract"],
    coparticipation: (state.coparticipation || "com") as SimulationInput["coparticipation"],
    accommodation: (state.accommodation || "enfermaria") as SimulationInput["accommodation"],
    hospitals: state.hospitals,
  };
  const recs = React.useMemo(() => recommend(input, 6), [JSON.stringify(input)]);

  React.useEffect(() => {
    if (savedRef.current || recs.length === 0 || !state.name) return;
    savedRef.current = true;
    const top = recs[0];
    const newLead = {
      id: "L" + Math.floor(Math.random() * 90000 + 9000),
      name: state.name, phone: state.phone,
      city: state.city, uf: state.uf,
      neighborhood: state.neighborhood ?? "—",
      age: state.beneficiaries[0]?.age || 0,
      browser: typeof navigator !== "undefined" ? navigator.userAgent.split(/[ /]/)[0] || "Web" : "Web",
      os: "Web", device: "desktop" as const,
      step: 7, completed: true, proposalGenerated: true,
      selectedPlan: top.name,
      selectedOperator: top.operator,
      selectedPrice: Math.round(top.price),
      durationSec: 95,
      createdAt: new Date().toISOString(),
    };
    addLead(newLead);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newLead,
        contractType: state.contract,
        beneficiaries: state.beneficiaries,
        plans: recs,
        matchScore: Math.round(top.score),
        lat: state.lat ?? undefined,
        lng: state.lng ?? undefined,
      }),
    })
      .then((r) => { if (r.ok) refreshLeads(); })
      .catch(() => {});
  }, [recs.length]);

  const chips: [string, any][] = [
    [`${state.beneficiaries.length} beneficiário(s)`, Users],
    [state.city || "—", MapPin],
    [state.contract === "familiar" ? "Familiar" : "Individual", User],
    [state.coparticipation === "sem" ? "Sem coparticipação" : "Com coparticipação", Percent],
    [state.accommodation === "apartamento" ? "Apartamento" : "Enfermaria", Bed],
  ];

  return (
    <div>
      <div className="mb-8">
        <Eyebrow>Tela 7 de 7</Eyebrow>
        <h2 className="mt-4 flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          <Award className="h-7 w-7 text-brand-500" /> {recs.length} planos recomendados
        </h2>
        <p className="mt-2 text-muted">
          Ordenados por compatibilidade com seu perfil{state.hospitals.length ? " e hospitais escolhidos" : ""}.
        </p>
      </div>

      <div className="glass mb-6 flex flex-wrap gap-2 rounded-2xl p-4 text-xs">
        {chips.map(([txt, Ic]) => (
          <Badge key={txt} className="surface px-3 py-1.5"><Ic className="h-3.5 w-3.5" /> {txt}</Badge>
        ))}
      </div>

      <div className="grid gap-4">
        {recs.map((p, i) => {
          const o = OPERATORS[p.operator];
          const isOpen = open === p.id;
          return (
            <Card key={p.id} className={cn("animate-fadeUp overflow-hidden", i === 0 && "border-brand-500")} style={{ animationDelay: `${Math.min(i, 5) * 0.06}s` }}>
              {i === 0 && (
                <div className="brand-gradient flex items-center gap-1.5 px-5 py-2 font-mono text-xs font-medium text-white">
                  <Sparkles className="h-3.5 w-3.5" /> MELHOR COMPATIBILIDADE
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <OperatorMark op={p.operator} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <Badge className="surface font-mono">{p.tier}</Badge>
                    </div>
                    <div className="text-sm text-muted">{o.name} · {p.coverage}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-400/20">
                        <div className="brand-gradient h-full" style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="font-mono text-xs font-semibold text-brand-500">{Math.round(p.score)}% match</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] text-faint">a partir de</div>
                    <div className="font-mono text-2xl font-semibold tracking-tight">{BRL(p.price)}</div>
                    <div className="text-[10px] text-faint">/mês</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {state.hospitals.length > 0 && (
                    <span className="rounded-lg bg-brand-500/15 px-2.5 py-1 text-[11px] font-medium text-brand-600 dark:text-brand-400">
                      <Hospital className="mr-1 inline h-3 w-3" />{p.coveredHospitals}/{state.hospitals.length} hospitais atendidos
                    </span>
                  )}
                  {p.benefits.slice(0, 3).map((b) => <Badge key={b} className="surface px-2.5 py-1">{b}</Badge>)}
                </div>

                <button onClick={() => setOpen(isOpen ? null : p.id)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500">
                  {isOpen ? "Ocultar detalhes" : "Ver detalhes completos"}
                  <ChevronDown className={cn("h-4 w-4 transition", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="mt-4 grid gap-5 border-t pt-4 sm:grid-cols-2">
                    <div>
                      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">Hospitais na rede</div>
                      <div className="space-y-1.5">
                        {p.network.map((hid) => (
                          <div key={hid} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" /> {HOSPITAL_MAP[hid]?.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">Benefícios</div>
                      <div className="space-y-1.5">
                        {p.benefits.map((b) => (
                          <div key={b} className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 shrink-0 text-brand-500" /> {b}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center font-mono text-xs text-faint">
        Valores fictícios · faixas etárias ANS · esta versão não realiza vendas.
      </div>
    </div>
  );
}
