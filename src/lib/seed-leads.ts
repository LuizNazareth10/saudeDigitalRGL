import type { Lead } from "@/types";
import { recommend } from "@/lib/recommendation";

/** PRNG determinístico (mulberry32) — métricas estáveis entre execuções. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REF_DATE = new Date(); // hoje — base dinâmica para KPIs

export function generateLeads(n = 168): Lead[] {
  const rng = mulberry32(20260620);
  const wpick = <T,>(pairs: [T, number][]): T => {
    let x = rng();
    for (const [v, w] of pairs) if ((x -= w) <= 0) return v;
    return pairs[0][0];
  };
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

  const cities: [string, number][] = [
    ["Juiz de Fora", 0.74], ["Matias Barbosa", 0.06], ["Santos Dumont", 0.06],
    ["Lima Duarte", 0.05], ["Bicas", 0.04], ["Coronel Pacheco", 0.03], ["Chácara", 0.02],
  ];
  const hoods = ["Centro", "São Mateus", "Cascatinha", "Bom Pastor", "Santa Helena", "Granbery", "Alto dos Passos", "Benfica", "Cidade Alta", "São Pedro"];
  const firsts = ["Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João", "Larissa", "Marcos", "Natália", "Otávio", "Paula", "Rafael", "Sofia", "Thiago", "Vanessa", "William"];
  const lasts = ["Silva", "Souza", "Oliveira", "Costa", "Pereira", "Rodrigues", "Almeida", "Carvalho", "Gomes", "Martins"];
  const browsers: [string, number][] = [["Chrome", 0.58], ["Safari", 0.18], ["Edge", 0.12], ["Samsung Internet", 0.07], ["Firefox", 0.05]];
  const oses: [string, number][] = [["Android", 0.41], ["Windows", 0.27], ["iOS", 0.22], ["macOS", 0.07], ["Linux", 0.03]];
  const devices: [Lead["device"], number][] = [["mobile", 0.66], ["desktop", 0.27], ["tablet", 0.07]];

  const out: Lead[] = [];
  for (let i = 0; i < n; i++) {
    const r = rng();
    let step = 7;
    if (r > 0.18) step = 6;
    if (r > 0.34) step = 5;
    if (r > 0.52) step = 4;
    if (r > 0.69) step = 3;
    if (r > 0.84) step = 2;
    if (r > 0.94) step = 1;
    const completed = step === 7;
    const city = wpick(cities);
    const age = 18 + Math.floor(rng() * 55);
    const daysAgo = Math.floor(rng() * 30);
    const now = new Date();
    const created = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, Math.floor(rng() * 24), Math.floor(rng() * 60));

    let selPlan: string | null = null;
    let selOp: string | null = null;
    let selPrice: number | null = null;
    if (completed) {
      const recs = recommend({
        city, uf: "MG", beneficiaries: [{ age, type: "titular" }],
        contract: "individual",
        coparticipation: rng() > 0.5 ? "sem" : "com",
        accommodation: rng() > 0.5 ? "apartamento" : "enfermaria",
        hospitals: [],
      });
      const chosen = recs[Math.floor(rng() * Math.min(3, recs.length))];
      if (chosen) {
        selPlan = chosen.name;
        selOp = chosen.operator;
        selPrice = Math.round(chosen.price);
      }
    }

    out.push({
      id: "L" + (1000 + i),
      name: `${pick(firsts)} ${pick(lasts)}`,
      phone: `(32) 9${Math.floor(1000 + rng() * 8999)}-${Math.floor(1000 + rng() * 8999)}`,
      city, uf: "MG", neighborhood: pick(hoods), age,
      browser: wpick(browsers), os: wpick(oses), device: wpick(devices),
      step, completed, proposalGenerated: completed,
      selectedPlan: selPlan, selectedOperator: selOp, selectedPrice: selPrice,
      durationSec: 40 + Math.floor(rng() * 320),
      createdAt: created.toISOString(),
    });
  }
  return out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export const isSameDay = (iso: string) => new Date(iso).toDateString() === REF_DATE.toDateString();
export const withinDays = (iso: string, days: number) =>
  (+REF_DATE - +new Date(iso)) / 86_400_000 <= days;
