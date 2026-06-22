import type { Plan } from "@/types";

/**
 * Catálogo de planos. `basePrice` = mensalidade de referência de mercado
 * (enfermaria, com coparticipação, faixa 0–18). `margin` é fictícia (0–1) e
 * entra no score. Tudo aqui é substituível por tabelas reais sem tocar no motor.
 */
export const PLANS: Plan[] = [
  // ── Cedplan ───────────────────────────────────────────────
  { id: "ced-ess", operator: "cedplan", name: "Cedplan Essencial", tier: "Essencial", basePrice: 168, margin: 0.18, network: ["h4", "h5"], coverage: "Ambulatorial + Hospitalar", benefits: ["Pronto atendimento", "Consultas eletivas", "Exames básicos"] },
  { id: "ced-plus", operator: "cedplan", name: "Cedplan Plus", tier: "Plus", basePrice: 219, margin: 0.24, network: ["h1", "h4", "h5", "h6"], coverage: "Ambulatorial + Hospitalar + Obstetrícia", benefits: ["Telemedicina 24h", "Internação", "Exames de imagem"] },
  { id: "ced-prem", operator: "cedplan", name: "Cedplan Premium", tier: "Premium", basePrice: 289, margin: 0.31, network: ["h1", "h2", "h4", "h5", "h6", "h8"], coverage: "Cobertura completa ANS", benefits: ["Rede ampliada", "Oncologia", "Reembolso parcial"] },

  // ── Plasc ─────────────────────────────────────────────────
  { id: "pla-loc", operator: "plasc", name: "Plasc Local", tier: "Essencial", basePrice: 192, margin: 0.19, network: ["h3", "h4", "h5"], coverage: "Ambulatorial + Hospitalar", benefits: ["Foco em Juiz de Fora", "Consultas", "Urgência 24h"] },
  { id: "pla-int", operator: "plasc", name: "Plasc Integral", tier: "Plus", basePrice: 251, margin: 0.25, network: ["h1", "h3", "h4", "h5", "h7"], coverage: "Ambulatorial + Hospitalar + Obstetrícia", benefits: ["Telemedicina", "Internação", "Fisioterapia"] },
  { id: "pla-mas", operator: "plasc", name: "Plasc Master", tier: "Premium", basePrice: 321, margin: 0.30, network: ["h1", "h2", "h3", "h4", "h5", "h7", "h8"], coverage: "Cobertura completa ANS", benefits: ["Rede completa regional", "Oncologia", "Concierge de saúde"] },

  // ── Unimed Juiz de Fora ───────────────────────────────────
  { id: "uni-ple", operator: "unimedjf", name: "Unimed Pleno", tier: "Essencial", basePrice: 224, margin: 0.20, network: ["h5", "h7"], coverage: "Ambulatorial + Hospitalar", benefits: ["Rede própria Unimed", "Pronto-socorro", "Consultas"] },
  { id: "uni-col", operator: "unimedjf", name: "Unimed Coletivo+", tier: "Plus", basePrice: 274, margin: 0.26, network: ["h1", "h4", "h5", "h7"], coverage: "Ambulatorial + Hospitalar + Obstetrícia", benefits: ["Telemedicina Unimed", "Internação", "Programas de prevenção"] },
  { id: "uni-prem", operator: "unimedjf", name: "Unimed Premium", tier: "Premium", basePrice: 362, margin: 0.33, network: ["h1", "h2", "h4", "h5", "h6", "h7", "h8"], coverage: "Cobertura completa ANS", benefits: ["Rede máxima", "Oncologia", "Reembolso", "Check-up anual"] },

  // ── Sul América (nacional) ────────────────────────────────
  { id: "sul-cla", operator: "sulamerica", name: "Sul América Clássico", tier: "Plus", basePrice: 242, margin: 0.27, network: ["h1", "h4"], coverage: "Ambulatorial + Hospitalar + Obstetrícia", benefits: ["Cobertura nacional", "Telemedicina", "Rede credenciada ampla"] },
  { id: "sul-esp", operator: "sulamerica", name: "Sul América Especial", tier: "Premium", basePrice: 331, margin: 0.32, network: ["h1", "h2", "h4", "h6"], coverage: "Cobertura completa ANS", benefits: ["Reembolso", "Nacional", "Maternidade premium"] },
  { id: "sul-exe", operator: "sulamerica", name: "Sul América Executivo", tier: "Premium", basePrice: 432, margin: 0.36, network: ["h1", "h2", "h4", "h5", "h6", "h8"], coverage: "Cobertura completa + reembolso", benefits: ["Reembolso ampliado", "Rede nacional premium", "Concierge", "Coberturas internacionais"] },
];

export const PLAN_MAP: Record<string, Plan> = Object.fromEntries(PLANS.map((p) => [p.id, p]));
