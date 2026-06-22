"use client";
import * as React from "react";
import type {
  Beneficiary, ContractType, Coparticipation, Accommodation,
} from "@/types";

export interface JourneyState {
  step: number;
  name: string;
  phone: string;
  city: string;
  uf: string;
  beneficiaries: Beneficiary[];
  contract: ContractType | "";
  coparticipation: Coparticipation | "";
  accommodation: Accommodation | "";
  hospitals: string[];
  lat: number | null;
  lng: number | null;
  neighborhood: string | null;
}

const INITIAL: JourneyState = {
  step: 1,
  name: "", phone: "", city: "", uf: "MG",
  beneficiaries: [{ age: NaN, type: "titular" }],
  contract: "", coparticipation: "", accommodation: "", hospitals: [],
  lat: null, lng: null, neighborhood: null,
};

interface JourneyApi {
  state: JourneyState;
  set: (patch: Partial<JourneyState>) => void;
  next: () => void;
  back: () => void;
  goto: (step: number) => void;
  canAdvance: boolean;
  computing: boolean;
  setComputing: (v: boolean) => void;
}

const Ctx = React.createContext<JourneyApi | null>(null);
export const useJourney = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useJourney deve estar dentro de JourneyProvider");
  return c;
};

export const TOTAL_STEPS = 7;

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<JourneyState>(INITIAL);
  const [computing, setComputing] = React.useState(false);
  const set = (patch: Partial<JourneyState>) => setState((s) => ({ ...s, ...patch }));

  const canAdvance = React.useMemo(() => {
    const s = state;
    switch (s.step) {
      case 1: return s.name.trim().length > 1 && s.phone.replace(/\D/g, "").length >= 10;
      case 2: return s.city.trim().length > 1 && !!s.uf;
      case 3: return s.beneficiaries.length > 0 && s.beneficiaries.every((b) => Number.isFinite(b.age) && b.age >= 0 && b.age <= 120);
      case 4: return !!s.contract;
      case 5: return !!s.coparticipation && !!s.accommodation;
      case 6: return true;
      default: return true;
    }
  }, [state]);

  const next = () => setState((s) => ({ ...s, step: Math.min(TOTAL_STEPS, s.step + 1) }));
  const back = () => setState((s) => ({ ...s, step: Math.max(1, s.step - 1) }));
  const goto = (step: number) => setState((s) => ({ ...s, step }));

  return (
    <Ctx.Provider value={{ state, set, next, back, goto, canAdvance, computing, setComputing }}>
      {children}
    </Ctx.Provider>
  );
}
