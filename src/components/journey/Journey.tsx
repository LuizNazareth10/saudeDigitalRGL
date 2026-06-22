"use client";
import * as React from "react";
import Link from "next/link";
import {
  User, MapPin, Baby, Users, Bed, Hospital, Award, Check, ArrowLeft, ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Mesh } from "@/components/ui/mesh";
import { cn } from "@/lib/utils";
import { useStore } from "@/providers/store-provider";
import { Step1, Step2, Step3, Step4, Step5, Step6 } from "./steps";
import { Result, ResultSkeleton } from "./Result";
import { useJourney, TOTAL_STEPS } from "./JourneyProvider";

const STEPS = [
  { n: 1, label: "Identificação", icon: User },
  { n: 2, label: "Localização", icon: MapPin },
  { n: 3, label: "Beneficiários", icon: Baby },
  { n: 4, label: "Contratação", icon: Users },
  { n: 5, label: "Características", icon: Bed },
  { n: 6, label: "Hospitais", icon: Hospital },
  { n: 7, label: "Resultado", icon: Award },
];

export function Journey() {
  const { state, next, back, canAdvance, computing, setComputing } = useJourney();
  const { addLead } = useStore();

  const goNext = () => {
    if (state.step === 6) {
      setComputing(true);
      addLead({
        id: "L" + Math.floor(Math.random() * 90000 + 9000),
        name: state.name, phone: state.phone, city: state.city, uf: state.uf, neighborhood: "—",
        age: state.beneficiaries[0]?.age || 0,
        browser: typeof navigator !== "undefined" ? navigator.userAgent.split(/[ /]/)[0] || "Web" : "Web",
        os: "Web", device: "desktop",
        step: 7, completed: true, proposalGenerated: true,
        selectedPlan: null, selectedOperator: null, selectedPrice: null,
        durationSec: 95, createdAt: new Date().toISOString(),
      });
      setTimeout(() => { setComputing(false); next(); }, 950);
    } else next();
  };

  return (
    <div className="relative min-h-screen">
      <Mesh />
      <div className="relative z-10 border-b">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link href="/"><Logo size="text-base" /></Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-faint">Etapa {state.step}/{TOTAL_STEPS}</span>
            <ThemeToggle />
          </div>
        </div>
        <div className="h-1 w-full bg-slate-400/20">
          <div className="brand-gradient h-full transition-all duration-500" style={{ width: `${(state.step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-10">
        <div className="mb-10 hidden items-center justify-between sm:flex">
          {STEPS.map((s, i) => {
            const active = state.step === s.n, done = state.step > s.n;
            return (
              <React.Fragment key={s.n}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-full border transition", (done || active) && "brand-gradient border-transparent text-white")}>
                    {done ? <Check className="h-4 w-4" /> : <s.icon className={cn("h-4 w-4", active ? "text-white" : "text-faint")} />}
                  </div>
                  <span className={cn("text-[10px]", active ? "text-brand-500" : "text-faint")}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={cn("mx-1 h-px flex-1", done ? "bg-brand-500" : "bg-slate-400/30")} />}
              </React.Fragment>
            );
          })}
        </div>

        <div key={state.step} className="animate-fadeUp">
          {computing ? <ResultSkeleton /> : (
            <>
              {state.step === 1 && <Step1 />}
              {state.step === 2 && <Step2 />}
              {state.step === 3 && <Step3 />}
              {state.step === 4 && <Step4 />}
              {state.step === 5 && <Step5 />}
              {state.step === 6 && <Step6 />}
              {state.step === 7 && <Result />}
            </>
          )}
        </div>

        {!computing && state.step < 7 && (
          <div className="mt-10 flex items-center justify-between">
            <Button variant="outline" onClick={state.step === 1 ? undefined : back} className={state.step === 1 ? "opacity-40 pointer-events-none" : ""}>
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <Button onClick={goNext} disabled={!canAdvance}>
              {state.step === 6 ? "Ver planos" : "Continuar"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
