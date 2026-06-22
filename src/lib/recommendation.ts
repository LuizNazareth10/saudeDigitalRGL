import type { Plan, PlanRecommendation, SimulationInput } from "@/types";
import { PLANS } from "@/lib/data/plans";
import { operatorCoversCity } from "@/lib/data/operators";
import { priceForPlan } from "@/lib/pricing";

/**
 * Motor de recomendação.
 * Score = média ponderada de 3 fatores normalizados (0–1):
 *   1. Cobertura de hospitais selecionados pelo usuário
 *   2. Preço (menor = melhor, normalizado entre os candidatos)
 *   3. Margem da operadora (maior = melhor)
 * Pesos centralizados em WEIGHTS — ajuste de negócio em um único lugar.
 */
export const WEIGHTS = {
  hospital: 0.5,
  price: 0.3,
  margin: 0.2,
} as const;

const norm = (v: number, min: number, max: number) => (max === min ? 1 : (v - min) / (max - min));

export function recommend(input: SimulationInput, limit = 6): PlanRecommendation[] {
  // 1) Elegibilidade regional: operadoras regionais precisam cobrir a cidade.
  const eligible: Plan[] = PLANS.filter((p) => operatorCoversCity(p.operator, input.city));
  const pool = eligible.length ? eligible : PLANS; // fallback: nenhuma cobre → mostra todas

  // 2) Preço de cada plano
  const priced = pool.map((p) => ({
    plan: p,
    price: priceForPlan(p, input.beneficiaries, input.accommodation, input.coparticipation),
  }));

  const prices = priced.map((x) => x.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const margins = pool.map((p) => p.margin);
  const minMargin = Math.min(...margins);
  const maxMargin = Math.max(...margins);

  const selected = input.hospitals;

  const scored: PlanRecommendation[] = priced.map(({ plan, price }) => {
    const covered = selected.length ? selected.filter((h) => plan.network.includes(h)).length : 0;
    const hospitalScore = selected.length ? covered / selected.length : 0.6; // neutro se não escolheu
    const priceScore = 1 - norm(price, minPrice, maxPrice); // mais barato = melhor
    const marginScore = norm(plan.margin, minMargin, maxMargin);

    const score =
      (WEIGHTS.hospital * hospitalScore +
        WEIGHTS.price * priceScore +
        WEIGHTS.margin * marginScore) *
      100;

    return {
      ...plan,
      price,
      coveredHospitals: covered,
      totalSelectedHospitals: selected.length,
      score: Math.round(score * 10) / 10,
      breakdown: { hospital: hospitalScore, price: priceScore, margin: marginScore },
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
