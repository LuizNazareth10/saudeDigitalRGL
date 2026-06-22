"use client";
import * as React from "react";
import {
  User, MapPin, Baby, Users, Bed, Building2, Hospital, Percent, ShieldCheck,
  Plus, Trash2, Check, CheckCircle2, MapPin as Pin,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/lib/format";
import { bandFor } from "@/lib/pricing";
import { HOSPITALS } from "@/lib/data/hospitals";
import { useJourney } from "./JourneyProvider";

const UFS = ["MG", "RJ", "SP", "ES", "BA", "PR", "RS", "SC", "GO", "DF"];

function StepHead({ icon: Icon, kicker, title, desc }: { icon: any; kicker: string; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <Eyebrow>{kicker}</Eyebrow>
      <h2 className="mt-4 flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        <Icon className="h-7 w-7 text-brand-500" /> {title}
      </h2>
      {desc && <p className="mt-2 text-muted">{desc}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ChoiceCard({ active, onClick, icon: Icon, title, desc }: { active: boolean; onClick: () => void; icon: any; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-5 text-left transition",
        active ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500" : "surface hover:border-brand-500/40"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl", active ? "brand-gradient" : "bg-slate-400/15")}>
          <Icon className={cn("h-5 w-5", active ? "text-white" : "text-muted")} />
        </div>
        {active && <CheckCircle2 className="h-5 w-5 text-brand-500" />}
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted">{desc}</div>
    </button>
  );
}

export function Step1() {
  const { state, set } = useJourney();
  return (
    <div>
      <StepHead icon={User} kicker="Tela 1 de 7" title="Vamos começar" desc="Como podemos te chamar e como falamos com você?" />
      <div className="grid gap-5">
        <Field label="Nome completo">
          <Input value={state.name} onChange={(e) => set({ name: e.target.value })} placeholder="Seu nome" autoFocus />
        </Field>
        <Field label="Telefone / WhatsApp">
          <Input value={state.phone} onChange={(e) => set({ phone: maskPhone(e.target.value) })} placeholder="(32) 99999-9999" inputMode="tel" />
        </Field>
      </div>
    </div>
  );
}

export function Step2() {
  const { state, set } = useJourney();
  return (
    <div>
      <StepHead icon={MapPin} kicker="Tela 2 de 7" title="Onde você mora?" desc="Usamos sua localização para priorizar a rede da sua região." />
      <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
        <Field label="Cidade"><Input value={state.city} onChange={(e) => set({ city: e.target.value })} placeholder="Juiz de Fora" autoFocus /></Field>
        <Field label="Estado">
          <select value={state.uf} onChange={(e) => set({ uf: e.target.value })} className="w-full rounded-xl border surface px-4 py-3 outline-none focus:border-brand-500">
            {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Juiz de Fora", "Matias Barbosa", "Santos Dumont", "Lima Duarte"].map((c) => (
          <button key={c} onClick={() => set({ city: c, uf: "MG" })} className="rounded-lg border surface px-3 py-1.5 text-xs text-muted transition hover:border-brand-500/40">{c}</button>
        ))}
      </div>
    </div>
  );
}

export function Step3() {
  const { state, set } = useJourney();
  const update = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(0, 3);
    const list = [...state.beneficiaries];
    list[i] = { ...list[i], age: v === "" ? NaN : Number(v) };
    set({ beneficiaries: list });
  };
  const add = () => set({ beneficiaries: [...state.beneficiaries, { age: NaN, type: "dependente" }] });
  const remove = (i: number) => set({ beneficiaries: state.beneficiaries.filter((_, k) => k !== i) });
  return (
    <div>
      <StepHead icon={Baby} kicker="Tela 3 de 7" title="Idade dos beneficiários" desc="Informe apenas a idade. Não pedimos CPF nem data de nascimento. O titular é o 1º beneficiário." />
      <div className="grid gap-3">
        {state.beneficiaries.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1">
              <Input value={Number.isFinite(b.age) ? String(b.age) : ""} onChange={(e) => update(i, e.target.value)} placeholder={i === 0 ? "Idade do titular" : `Idade do dependente ${i}`} inputMode="numeric" />
            </div>
            <Badge className="surface">{i === 0 ? "Titular" : "Dependente"}</Badge>
            {Number.isFinite(b.age) && <Badge className="surface font-mono">faixa {bandFor(b.age).label}</Badge>}
            {state.beneficiaries.length > 1 && i > 0 && (
              <button onClick={() => remove(i)} className="grid h-10 w-10 place-items-center rounded-xl border surface hover:border-rose-500/40"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 inline-flex items-center gap-2 rounded-xl border surface px-4 py-2.5 text-sm font-medium transition hover:border-brand-500/40">
        <Plus className="h-4 w-4" /> Adicionar dependente
      </button>
    </div>
  );
}

export function Step4() {
  const { state, set } = useJourney();
  return (
    <div>
      <StepHead icon={Users} kicker="Tela 4 de 7" title="Tipo de contratação" />
      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceCard active={state.contract === "individual"} onClick={() => set({ contract: "individual" })} icon={User} title="Individual" desc="Plano para uma pessoa." />
        <ChoiceCard active={state.contract === "familiar"} onClick={() => set({ contract: "familiar" })} icon={Users} title="Familiar" desc="Plano para você e seus dependentes." />
      </div>
    </div>
  );
}

export function Step5() {
  const { state, set } = useJourney();
  return (
    <div>
      <StepHead icon={Bed} kicker="Tela 5 de 7" title="Características desejadas" />
      <div className="mb-3 text-sm font-medium text-muted">Coparticipação</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceCard active={state.coparticipation === "com"} onClick={() => set({ coparticipation: "com" })} icon={Percent} title="Com coparticipação" desc="Mensalidade menor, paga parte ao usar." />
        <ChoiceCard active={state.coparticipation === "sem"} onClick={() => set({ coparticipation: "sem" })} icon={ShieldCheck} title="Sem coparticipação" desc="Mensalidade maior, uso ilimitado." />
      </div>
      <div className="mb-3 mt-7 text-sm font-medium text-muted">Acomodação</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceCard active={state.accommodation === "enfermaria"} onClick={() => set({ accommodation: "enfermaria" })} icon={Bed} title="Enfermaria" desc="Quarto compartilhado." />
        <ChoiceCard active={state.accommodation === "apartamento"} onClick={() => set({ accommodation: "apartamento" })} icon={Building2} title="Apartamento" desc="Quarto individual." />
      </div>
    </div>
  );
}

export function Step6() {
  const { state, set } = useJourney();
  const toggle = (id: string) =>
    set({ hospitals: state.hospitals.includes(id) ? state.hospitals.filter((h) => h !== id) : [...state.hospitals, id] });
  return (
    <div>
      <StepHead icon={Hospital} kicker="Tela 6 de 7" title="Hospitais de preferência" desc="Selecione os hospitais que importam para você. Priorizamos planos que os atendem (opcional)." />
      <div className="grid gap-4 sm:grid-cols-2">
        {HOSPITALS.map((h) => {
          const active = state.hospitals.includes(h.id);
          return (
            <button key={h.id} onClick={() => toggle(h.id)} className={cn("overflow-hidden rounded-2xl border text-left transition", active ? "border-brand-500 ring-1 ring-brand-500" : "surface")}>
              <div className="relative h-24" style={{ background: `linear-gradient(135deg,${h.from},${h.to})` }}>
                <Hospital className="absolute bottom-3 right-3 h-10 w-10 text-white/30" />
                {active && <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white"><Check className="h-4 w-4 text-brand-600" /></div>}
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold leading-snug">{h.name}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-faint"><Pin className="h-3 w-3" /> {h.area}, {h.city}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {h.tags.map((tg) => <Badge key={tg} className="surface">{tg}</Badge>)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
