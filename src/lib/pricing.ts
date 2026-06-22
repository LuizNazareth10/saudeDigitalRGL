import type { Plan, Beneficiary, Accommodation, Coparticipation } from "@/types";

/**
 * Motor de precificação — desacoplado e configurável.
 * Substitua MODIFIERS / AGE_BANDS por tabelas reais sem alterar o restante.
 */

/** 10 faixas etárias regulamentadas pela ANS. Reajuste 59+ < 6x a 1ª faixa. */
export const AGE_BANDS = [
  { max: 18, mult: 1.0, label: "0–18" },
  { max: 23, mult: 1.25, label: "19–23" },
  { max: 28, mult: 1.45, label: "24–28" },
  { max: 33, mult: 1.65, label: "29–33" },
  { max: 38, mult: 1.85, label: "34–38" },
  { max: 43, mult: 2.1, label: "39–43" },
  { max: 48, mult: 2.45, label: "44–48" },
  { max: 53, mult: 2.9, label: "49–53" },
  { max: 58, mult: 3.6, label: "54–58" },
  { max: Infinity, mult: 5.8, label: "59+" },
] as const;

export const MODIFIERS = {
  /** Apartamento vs enfermaria. */
  apartamento: 1.35,
  /** Sem coparticipação vs com. */
  semCoparticipacao: 1.18,
  /** Fator aplicado a dependentes (titular = 1.0). Configurável. */
  dependente: 0.95,
} as const;

export function bandFor(age: number) {
  return AGE_BANDS.find((b) => age <= b.max) ?? AGE_BANDS[AGE_BANDS.length - 1];
}

/** Preço por beneficiário, já com modificadores de acomodação/coparticipação/tipo. */
export function priceForBeneficiary(
  plan: Plan,
  ben: Beneficiary,
  accommodation: Accommodation,
  coparticipation: Coparticipation
): number {
  const accMod = accommodation === "apartamento" ? MODIFIERS.apartamento : 1;
  const copMod = coparticipation === "sem" ? MODIFIERS.semCoparticipacao : 1;
  const typeMod = ben.type === "dependente" ? MODIFIERS.dependente : 1;
  return plan.basePrice * bandFor(ben.age).mult * accMod * copMod * typeMod;
}

/** Mensalidade total do contrato. */
export function priceForPlan(
  plan: Plan,
  beneficiaries: Beneficiary[],
  accommodation: Accommodation,
  coparticipation: Coparticipation
): number {
  const list = beneficiaries.length ? beneficiaries : [{ age: 30, type: "titular" as const }];
  return list.reduce((sum, b) => sum + priceForBeneficiary(plan, b, accommodation, coparticipation), 0);
}
