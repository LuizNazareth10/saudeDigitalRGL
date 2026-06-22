import type { Operator, OperatorId } from "@/types";

/**
 * Operadoras. As três regionais são limitadas por cidade (Zona da Mata / MG).
 * Sul América é nacional ("*"). Valores e cobertura são fictícios.
 */
export const OPERATORS: Record<OperatorId, Operator> = {
  cedplan: {
    id: "cedplan",
    name: "Cedplan",
    short: "Cedplan",
    note: "Regional · Zona da Mata",
    regions: ["Juiz de Fora", "Matias Barbosa", "Santos Dumont", "Coronel Pacheco", "Chácara"],
    from: "#6366f1",
    to: "#3b82f6",
  },
  plasc: {
    id: "plasc",
    name: "Plasc",
    short: "Plasc",
    note: "Foco em Juiz de Fora",
    regions: ["Juiz de Fora", "Matias Barbosa", "Bicas"],
    from: "#0d9488",
    to: "#06b6d4",
  },
  unimedjf: {
    id: "unimedjf",
    name: "Unimed Juiz de Fora",
    short: "Unimed JF",
    note: "Cooperativa regional",
    regions: ["Juiz de Fora", "Lima Duarte", "Santos Dumont", "Bicas", "Matias Barbosa", "Chácara", "Coronel Pacheco"],
    from: "#059669",
    to: "#10b981",
  },
  sulamerica: {
    id: "sulamerica",
    name: "Sul América",
    short: "Sul América",
    note: "Cobertura nacional",
    regions: ["*"],
    from: "#f59e0b",
    to: "#f97316",
  },
};

export const OPERATOR_LIST = Object.values(OPERATORS);

export function operatorCoversCity(id: OperatorId, city: string): boolean {
  const op = OPERATORS[id];
  if (op.regions.includes("*")) return true;
  return op.regions.some((c) => c.toLowerCase() === city.trim().toLowerCase());
}
