// Tipos de domínio — Seguros Digital RGL

export type OperatorId = "cedplan" | "plasc" | "unimedjf" | "sulamerica";
export type PlanTier = "Essencial" | "Plus" | "Premium";
export type Accommodation = "enfermaria" | "apartamento";
export type Coparticipation = "com" | "sem";
export type ContractType = "individual" | "familiar";
export type BeneficiaryType = "titular" | "dependente";
export type Role = "operador" | "gestor" | "admin";

export interface Operator {
  id: OperatorId;
  name: string;
  short: string;
  note: string;
  /** "*" = cobertura nacional. Caso contrário, lista de cidades atendidas. */
  regions: string[];
  from: string;
  to: string;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  tags: string[];
  from: string;
  to: string;
}

export interface Plan {
  id: string;
  operator: OperatorId;
  name: string;
  tier: PlanTier;
  /** Mensalidade base: enfermaria, com coparticipação, faixa 0–18. */
  basePrice: number;
  /** Rede de hospitais (ids). */
  network: string[];
  /** Margem fictícia da operadora (0–1) — usada no score. */
  margin: number;
  coverage: string;
  benefits: string[];
}

export interface Beneficiary {
  age: number;
  type: BeneficiaryType;
}

export interface SimulationInput {
  name?: string;
  phone?: string;
  city: string;
  uf: string;
  beneficiaries: Beneficiary[];
  contract: ContractType;
  coparticipation: Coparticipation;
  accommodation: Accommodation;
  hospitals: string[];
}

export interface ScoreBreakdown {
  hospital: number; // 0–1
  price: number; // 0–1
  margin: number; // 0–1
}

export interface PlanRecommendation extends Plan {
  price: number;
  coveredHospitals: number;
  totalSelectedHospitals: number;
  score: number; // 0–100
  breakdown: ScoreBreakdown;
}

export interface User {
  email: string;
  name: string;
  role: Role;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  uf: string;
  neighborhood: string;
  age: number;
  browser: string;
  os: string;
  device: "mobile" | "desktop" | "tablet";
  step: number;
  completed: boolean;
  proposalGenerated: boolean;
  selectedPlan: string | null;
  selectedOperator: string | null;
  selectedPrice: number | null;
  durationSec: number;
  createdAt: string; // ISO
}
