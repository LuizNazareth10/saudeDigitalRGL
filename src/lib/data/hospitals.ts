import type { Hospital } from "@/types";

/**
 * Hospitais da região de Juiz de Fora / MG. Coordenadas reais (aproximadas)
 * para o mapa. Especialidades/rede são fictícias para fins de simulação.
 */
export const HOSPITALS: Hospital[] = [
  { id: "h1", name: "Hospital Monte Sinai", area: "São Mateus", city: "Juiz de Fora", lat: -21.7665, lng: -43.3503, tags: ["Pronto-socorro 24h", "UTI", "Cardiologia"], from: "#0ea5e9", to: "#6366f1" },
  { id: "h2", name: "Hospital e Maternidade Therezinha de Jesus", area: "Bairu", city: "Juiz de Fora", lat: -21.7489, lng: -43.3398, tags: ["Maternidade", "UTI Neonatal", "Cirurgia"], from: "#ec4899", to: "#f43f5e" },
  { id: "h3", name: "Hospital Albert Sabin", area: "Centro", city: "Juiz de Fora", lat: -21.7625, lng: -43.3502, tags: ["Geral", "Ortopedia", "Urgência"], from: "#14b8a6", to: "#06b6d4" },
  { id: "h4", name: "Hospital São Lucas", area: "Centro", city: "Juiz de Fora", lat: -21.7587, lng: -43.3489, tags: ["Clínica geral", "Exames", "Internação"], from: "#8b5cf6", to: "#6366f1" },
  { id: "h5", name: "Santa Casa de Misericórdia", area: "Centro", city: "Juiz de Fora", lat: -21.7603, lng: -43.3534, tags: ["Alta complexidade", "Oncologia", "UTI"], from: "#f59e0b", to: "#ef4444" },
  { id: "h6", name: "Hospital Universitário UFJF", area: "Dom Bosco", city: "Juiz de Fora", lat: -21.7758, lng: -43.3712, tags: ["Ensino", "Especialidades", "Pesquisa"], from: "#10b981", to: "#22c55e" },
  { id: "h7", name: "Hospital Unimed Juiz de Fora", area: "São Pedro", city: "Juiz de Fora", lat: -21.7711, lng: -43.3889, tags: ["Cooperativa", "UTI", "Centro cirúrgico"], from: "#059669", to: "#10b981" },
  { id: "h8", name: "Hospital Maria José Baeta Reis (ASCOMCER)", area: "Salvaterra", city: "Juiz de Fora", lat: -21.7842, lng: -43.3651, tags: ["Oncologia", "Quimioterapia", "Radioterapia"], from: "#a855f7", to: "#d946ef" },
];

export const HOSPITAL_MAP: Record<string, Hospital> = Object.fromEntries(
  HOSPITALS.map((h) => [h.id, h])
);
