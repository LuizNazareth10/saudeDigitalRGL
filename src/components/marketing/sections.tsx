"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle2, Zap, User, Hospital, Award,
  Building2, LayoutGrid, Clock, Shield, MapPin, Phone,
  Instagram, MessageCircle,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mesh } from "@/components/ui/mesh";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { OPERATOR_LIST } from "@/lib/data/operators";
import { PLANS } from "@/lib/data/plans";

/* ── Hero ─────────────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-28">
      {/* ECG decorativo no topo */}
      <div className="ecg-line mb-10 w-full" />

      <div className="max-w-3xl">
        <div className="animate-fadeUp">
          <Eyebrow>Simulador inteligente · Região de Juiz de Fora / MG</Eyebrow>
        </div>

        <h1
          className="mt-5 animate-fadeUp text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
          style={{ animationDelay: ".06s" }}
        >
          Encontre o plano de saúde{" "}
          <span className="brand-text">certo para você</span>{" "}
          em menos de 2 minutos.
        </h1>

        <p className="mt-6 max-w-2xl animate-fadeUp text-lg leading-relaxed text-muted" style={{ animationDelay: ".12s" }}>
          A <strong className="font-semibold text-white/90">RGL Consultoria</strong> compara
          Cedplan, Plasc, Unimed Juiz de Fora e Sul América e recomenda as melhores opções
          baseadas no seu perfil, hospitais preferidos e orçamento.
        </p>

        <div className="mt-9 flex animate-fadeUp flex-wrap items-center gap-3" style={{ animationDelay: ".18s" }}>
          <Link href="/simular">
            <Button size="lg" className="brand-glow">
              Simular meu plano <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#como">
            <Button variant="outline" size="lg">Como funciona</Button>
          </a>
        </div>

        <div className="mt-10 flex animate-fadeUp flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted" style={{ animationDelay: ".24s" }}>
          {[
            ["Sem cadastro para simular", CheckCircle2],
            ["100% gratuito", CheckCircle2],
            ["Resultado na hora", Zap],
          ].map(([txt, Ic]: any) => (
            <span key={txt} className="flex items-center gap-2">
              <Ic className="h-4 w-4 text-brand-400" /> {txt}
            </span>
          ))}
        </div>
      </div>

      {/* Stat cards — identidade RGL */}
      <div
        className="mt-16 grid animate-fadeUp grid-cols-2 gap-3 sm:grid-cols-4"
        style={{ animationDelay: ".30s" }}
      >
        {[
          { n: String(OPERATOR_LIST.length), l: "operadoras",    ic: Building2  },
          { n: "8",                          l: "hospitais",      ic: Hospital   },
          { n: String(PLANS.length),         l: "planos",         ic: LayoutGrid },
          { n: "~90s",                       l: "para simular",   ic: Clock      },
        ].map(({ n, l, ic: Ic }) => (
          <div
            key={l}
            className="group relative overflow-hidden rounded-2xl border border-brand-700/40 bg-brand-900/20 p-5 backdrop-blur-sm transition hover:border-brand-500/60 hover:bg-brand-900/35"
          >
            {/* Shine top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/12">
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

/* ── HowItWorks ───────────────────────────────────────────────────────────── */
export function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Conte seu perfil",
      d: "Informe a idade dos beneficiários, cidade, tipo de contratação e preferências de acomodação.",
      ic: User,
    },
    {
      n: "02",
      t: "Escolha seus hospitais",
      d: "Selecione visualmente os hospitais que importam para você na região de Juiz de Fora.",
      ic: Hospital,
    },
    {
      n: "03",
      t: "Receba a recomendação",
      d: "Nossa IA compara cobertura, preço e rede credenciada e mostra os planos mais compatíveis com você.",
      ic: Award,
    },
  ];

  return (
    <section id="como" className="relative mx-auto max-w-6xl px-5 py-20">
      <div className="ecg-line mb-12 w-full" />
      <Eyebrow>Como funciona</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Três passos até a sua recomendação
      </h2>
      <p className="mt-3 max-w-xl text-muted">
        Processo simples, transparente e 100% gratuito. Sem vendas, sem pressão.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <Card
            key={s.n}
            className="card-rgl group relative overflow-hidden p-7 transition hover:-translate-y-1.5"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 transition group-hover:bg-brand-500/20">
                <s.ic className="h-5 w-5 text-brand-400" />
              </div>
              <span className="font-mono text-3xl font-bold tracking-tight text-brand-500/20">{s.n}</span>
            </div>
            <h3 className="mt-6 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ── OperatorsSection ─────────────────────────────────────────────────────── */
export function OperatorsSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20">
      <div className="ecg-line mb-12 w-full" />
      <Eyebrow>Operadoras parceiras</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Comparamos as principais da região
      </h2>
      <p className="mt-3 max-w-xl text-muted">
        Análise imparcial das melhores operadoras de planos de saúde disponíveis para Juiz de Fora e região.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OPERATOR_LIST.map((o) => (
          <Card key={o.id} className="card-rgl group p-6 transition hover:-translate-y-1">
            <OperatorMark op={o.id} size={52} />
            <div className="mt-5 font-semibold">{o.name}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted">{o.note}</div>
            <div className="mt-4 font-mono text-xs text-brand-400">
              {PLANS.filter((p) => p.operator === o.id).length} planos disponíveis
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ── TrustSection ─────────────────────────────────────────────────────────── */
export function TrustSection() {
  const items = [
    { ic: Shield,         t: "Consultoria especializada",  d: "Anos de experiência no mercado de planos de saúde em Juiz de Fora." },
    { ic: MapPin,         t: "Atendimento regional",       d: "Focados na região de Juiz de Fora e Zona da Mata Mineira." },
    { ic: CheckCircle2,   t: "Análise imparcial",          d: "Comparamos todas as operadoras sem preferências comerciais." },
    { ic: MessageCircle,  t: "Suporte no WhatsApp",        d: "Fale diretamente com nossos corretores por WhatsApp após a simulação." },
  ];

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20">
      <div className="ecg-line mb-12 w-full" />
      <Eyebrow>Por que a RGL Consultoria</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Mais de uma década cuidando da sua saúde
      </h2>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ ic: Ic, t, d }) => (
          <div key={t} className="card-rgl group rounded-2xl p-6 transition hover:-translate-y-1">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 transition group-hover:bg-brand-500/20">
              <Ic className="h-5 w-5 text-brand-400" />
            </div>
            <div className="font-semibold">{t}</div>
            <div className="mt-1.5 text-sm leading-relaxed text-muted">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FinalCTA ─────────────────────────────────────────────────────────────── */
export function FinalCTA() {
  const waLink = "https://wa.me/5532999405609?text=Ol%C3%A1%21+Gostaria+de+simular+um+plano+de+sa%C3%BAde.";
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-brand-700/40 bg-gradient-to-br from-brand-900/60 via-rgl-surface/80 to-brand-800/30 p-12 shadow-teal sm:p-16">
        <Mesh />
        {/* ECG linha decorativa */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

        {/* Logo RGL watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden sm:block">
          <Image
            src="https://rglconsultoriajf.com.br/wp-content/uploads/2024/01/Logo-Branca.png"
            alt=""
            width={180}
            height={180}
            className="h-40 w-auto"
            unoptimized
          />
        </div>

        <div className="relative max-w-xl">
          <span className="mb-4 inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-400">
            RGL Consultoria · Juiz de Fora / MG
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pronto para encontrar<br />seu plano ideal?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Leva menos de 2 minutos. Sem cadastro, sem compromisso — e com o suporte de quem entende do assunto.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/simular">
              <Button size="lg" className="brand-glow">
                Simular agora <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <MessageCircle className="h-4 w-4" /> Falar com corretor
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
export function Footer() {
  const waLink = "https://wa.me/5532999405609";
  return (
    <footer className="relative border-t border-brand-900/60">
      <div className="ecg-line" />
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="https://rglconsultoriajf.com.br/wp-content/uploads/2024/01/Logo-Branca.png"
                alt="RGL Consultoria"
                width={32}
                height={32}
                className="h-8 w-auto opacity-90"
                unoptimized
              />
              <span className="font-bold">RGL <span className="brand-text">Consultoria</span></span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Planos de saúde sob medida para você e sua família na região de Juiz de Fora, MG.
            </p>
          </div>

          {/* Contato */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">Contato</div>
            <div className="space-y-2 text-sm text-muted">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-brand-400">
                <MessageCircle className="h-4 w-4 text-brand-500" /> (32) 99940-5609
              </a>
              <a href="https://instagram.com/rglconsultoria" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-brand-400">
                <Instagram className="h-4 w-4 text-brand-500" /> @rglconsultoria
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-500" />
                <span>Rua Braz Bernadino, 105 · loja 214<br />Centro · Juiz de Fora / MG</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">Navegação</div>
            <div className="space-y-2 text-sm">
              <Link href="/simular" className="block text-muted transition hover:text-brand-400">Simular plano</Link>
              <Link href="/login" className="block text-muted transition hover:text-brand-400">Área restrita</Link>
              <a href="https://rglconsultoriajf.com.br" target="_blank" rel="noopener noreferrer" className="block text-muted transition hover:text-brand-400">
                Site institucional ↗
              </a>
            </div>
          </div>
        </div>

        <div className="ecg-line mt-10" />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-faint sm:flex-row">
          <span>© {new Date().getFullYear()} RGL Consultoria · Todos os direitos reservados.</span>
          <span className="font-mono">segurosdigital-rgl.vercel.app</span>
        </div>
      </div>
    </footer>
  );
}
