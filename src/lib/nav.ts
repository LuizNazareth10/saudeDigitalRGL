import type { Role } from "@/types";
import { NAV_BY_ROLE } from "@/lib/auth";

export type NavGroup = "Dashboards" | "Operação" | "Administração";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  group: NavGroup;
}

/** Metadados de cada seção do painel (sem ícones — ver Shell). */
export const NAV_ITEMS: Record<string, NavItem> = {
  executivo: { key: "executivo", label: "Executivo", href: "/painel/executivo", group: "Dashboards" },
  funil: { key: "funil", label: "Funil de conversão", href: "/painel/funil", group: "Dashboards" },
  geografico: { key: "geografico", label: "Geográfico", href: "/painel/geografico", group: "Dashboards" },
  planos: { key: "planos", label: "Planos", href: "/painel/planos", group: "Dashboards" },
  ux: { key: "ux", label: "Comportamento (UX)", href: "/painel/ux", group: "Dashboards" },
  leads: { key: "leads", label: "Leads", href: "/painel/leads", group: "Operação" },
  propostas: { key: "propostas", label: "Propostas", href: "/painel/propostas", group: "Operação" },
  usuarios: { key: "usuarios", label: "Usuários", href: "/painel/admin/usuarios", group: "Administração" },
  operadoras: { key: "operadoras", label: "Operadoras", href: "/painel/admin/operadoras", group: "Administração" },
  "planos-admin": { key: "planos-admin", label: "Catálogo de planos", href: "/painel/admin/planos", group: "Administração" },
  precos: { key: "precos", label: "Regras de preço", href: "/painel/admin/precos", group: "Administração" },
  auditoria: { key: "auditoria", label: "Auditoria", href: "/painel/admin/auditoria", group: "Administração" },
};

export function navForRole(role: Role): NavItem[] {
  return NAV_BY_ROLE[role].map((k) => NAV_ITEMS[k]).filter(Boolean);
}

export function firstRouteFor(role: Role): string {
  return navForRole(role)[0]?.href ?? "/painel/leads";
}
