"use client";
import * as React from "react";
import type { Lead } from "@/types";
import { generateLeads } from "@/lib/seed-leads";

interface Store {
  leads: Lead[];
  addLead: (lead: Lead) => void;
}
const StoreCtx = React.createContext<Store>({ leads: [], addLead: () => {} });
export const useStore = () => React.useContext(StoreCtx);

/** Demo: leads em memória. Em produção, trocar por fetch /api/leads (Neon). */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = React.useState<Lead[]>(() => generateLeads());
  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev]);
  return <StoreCtx.Provider value={{ leads, addLead }}>{children}</StoreCtx.Provider>;
}
