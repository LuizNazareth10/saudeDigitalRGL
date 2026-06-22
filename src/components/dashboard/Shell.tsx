"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GitBranch, Map, Layers, MousePointerClick, Users, FileText,
  UserCog, Building2, SlidersHorizontal, ScrollText, LogOut, ExternalLink, Menu, X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { navForRole, NAV_ITEMS, type NavGroup } from "@/lib/nav";

const ICONS: Record<string, any> = {
  executivo: LayoutDashboard, funil: GitBranch, geografico: Map, planos: Layers, ux: MousePointerClick,
  leads: Users, propostas: FileText,
  usuarios: UserCog, operadoras: Building2, "planos-admin": Layers, precos: SlidersHorizontal, auditoria: ScrollText,
};
const GROUPS: NavGroup[] = ["Dashboards", "Operação", "Administração"];

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  if (!user) return null;

  const items = navForRole(user.role);
  const current = Object.values(NAV_ITEMS).find((n) => pathname === n.href);

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5"><Link href="/" onClick={() => setOpen(false)}><Logo size="text-base" /></Link></div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {GROUPS.map((g) => {
          const groupItems = items.filter((i) => i.group === g);
          if (!groupItems.length) return null;
          return (
            <div key={g}>
              <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{g}</div>
              <div className="space-y-1">
                {groupItems.map((it) => {
                  const Icon = ICONS[it.key] ?? LayoutDashboard;
                  const active = pathname === it.href;
                  return (
                    <Link key={it.key} href={it.href} onClick={() => setOpen(false)}
                      className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                        active ? "brand-gradient font-medium text-white shadow-brand" : "text-muted hover:bg-black/5 dark:hover:bg-white/5")}>
                      <Icon className="h-4 w-4 shrink-0" /> {it.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full brand-gradient text-sm font-semibold text-white">
            {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate font-mono text-[11px] capitalize text-faint">{user.role}</div>
          </div>
        </div>
        <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-rose-500/10 hover:text-rose-500">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r surface lg:block">{SidebarBody}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r surface">{SidebarBody}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 surface/80 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border glass lg:hidden"><Menu className="h-4 w-4" /></button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">{current?.label ?? "Painel"}</h1>
              <p className="hidden text-xs text-faint sm:block">Seguros Digital RGL · área restrita</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/simular" className="hidden items-center gap-1.5 rounded-lg border glass px-3 py-2 text-xs font-medium sm:flex">
              <ExternalLink className="h-3.5 w-3.5" /> Ver simulador
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
