"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, User, Hospital, Award, Building2, LayoutGrid, Clock } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mesh } from "@/components/ui/mesh";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { OPERATOR_LIST } from "@/lib/data/operators";
import { PLANS } from "@/lib/data/plans";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
      <div className="max-w-3xl">
        <div className="animate-fadeUp"><Eyebrow>Simulador inteligente · Região de Juiz de Fora</Eyebrow></div>
        <h1 className="mt-5 animate-fadeUp text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl" style={{ animationDelay: ".06s" }}>
          Encontre o plano de saúde <span className="brand-text">certo para você</span> em menos de 2 minutos.
        </h1>
        <p className="mt-6 max-w-2xl animate-fadeUp text-lg text-muted" style={{ animationDelay: ".12s" }}>
          Informe suas necessidades, idade, cidade e hospitais de preferência. Comparamos Cedplan, Plasc,
          Unimed Juiz de Fora e Sul América e recomendamos as melhores opções para o seu perfil.
        </p>
        <div className="mt-9 flex animate-fadeUp flex-wrap items-center gap-3" style={{ animationDelay: ".18s" }}>
          <Link href="/simular"><Button size="lg">Simular meu plano <ArrowRight className="h-4 w-4" /></Button></Link>
          <a href="#como"><Button variant="outline" size="lg">Como funciona</Button></a>
        </div>
        <div className="mt-10 flex animate-fadeUp flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted" style={{ animationDelay: ".24s" }}>
          {[["Sem cadastro para simular", CheckCircle2], ["100% gratuito", CheckCircle2], ["Resultado na hora", Zap]].map(([txt, Ic]: any) => (
            <span key={txt} className="flex items-center gap-2"><Ic className="h-4 w-4 text-brand-500" /> {txt}</span>
          ))}
        </div>
      </div>
      <div className="mt-14 grid animate-fadeUp grid-cols-2 gap-3 sm:grid-cols-4" style={{ animationDelay: ".3s" }}>
        {[
          { n: String(OPERATOR_LIST.length), l: "operadoras", ic: Building2 },
          { n: "8", l: "hospitais", ic: Hospital },
          { n: String(PLANS.length), l: "planos", ic: LayoutGrid },
          { n: "~90s", l: "para simular", ic: Clock },
        ].map(({ n, l, ic: Ic }) => (
          <div key={l} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition hover:border-brand-500/40 hover:bg-white/[0.07]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
              <Ic className="h-4 w-4 text-brand-400" />
            </div>
            <div className="font-mono text-3xl font-bold tracking-tight text-white">{n}</div>
            <div className="mt-1 text-sm font-medium text-slate-400">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", t: "Conte seu perfil", d: "Idade dos beneficiários, cidade, tipo de contratação e preferências de acomodação.", ic: User },
    { n: "02", t: "Escolha seus hospitais", d: "Selecione visualmente os hospitais que importam para você na sua região.", ic: Hospital },
    { n: "03", t: "Receba os planos", d: "Comparamos cobertura, preço e margem e mostramos as melhores opções para você.", ic: Award },
  ];
  return (
    <section id="como" className="relative mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Como funciona</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">Três passos até a sua recomendação</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.n} className="p-6 transition hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/10">
                <s.ic className="h-5 w-5 text-brand-500" />
              </div>
              <span className="font-mono text-sm text-faint">{s.n}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted">{s.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function OperatorsSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Operadoras parceiras</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">Comparamos as principais da região</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OPERATOR_LIST.map((o) => (
          <Card key={o.id} className="p-6">
            <OperatorMark op={o.id} size={48} />
            <div className="mt-4 font-semibold">{o.name}</div>
            <div className="mt-1 text-xs text-muted">{o.note}</div>
            <div className="mt-4 font-mono text-xs text-faint">{PLANS.filter((p) => p.operator === o.id).length} planos</div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16">
      <div className="glass relative overflow-hidden rounded-3xl p-10 sm:p-14">
        <Mesh />
        <div className="relative max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight">Pronto para encontrar seu plano?</h2>
          <p className="mt-3 text-muted">Leva menos de dois minutos e você não precisa se cadastrar.</p>
          <Link href="/simular" className="mt-7 inline-block">
            <Button size="lg">Começar simulação <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-10 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-muted sm:flex-row">
        <span className="font-semibold">Seguros Digital <span className="text-brand-500">RGL</span></span>
        <span className="font-mono text-xs">© {new Date().getFullYear()} · segurosdigital-rgl.com.br</span>
      </div>
    </footer>
  );
}
