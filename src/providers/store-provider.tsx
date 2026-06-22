"use client";
import * as React from "react";
import type { Lead } from "@/types";

interface Store {
  leads: Lead[];
  loading: boolean;
  addLead: (lead: Lead) => void;
  refreshLeads: () => Promise<void>;
}
const StoreCtx = React.createContext<Store>({ leads: [], loading: true, addLead: () => {}, refreshLeads: async () => {} });
export const useStore = () => React.useContext(StoreCtx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refreshLeads = React.useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch {
      // mantém leads atuais em caso de falha de rede
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshLeads();
    const onFocus = () => refreshLeads();
    window.addEventListener("focus", onFocus);
    const interval = setInterval(refreshLeads, 30_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [refreshLeads]);

  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev]);

  return (
    <StoreCtx.Provider value={{ leads, loading, addLead, refreshLeads }}>
      {children}
    </StoreCtx.Provider>
  );
}
