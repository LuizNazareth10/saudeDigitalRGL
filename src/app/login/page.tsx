"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mesh } from "@/components/ui/mesh";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/providers/auth-provider";
import { firstRouteFor } from "@/lib/nav";
import { verifyCredentials } from "@/lib/auth";

const DEMO = [
  { role: "Operador", email: "operador@segurosdigital.com.br", password: "Operador@123" },
  { role: "Gestor", email: "gestor@segurosdigital.com.br", password: "Gestor@123" },
  { role: "Admin", email: "admin@segurosdigital.com.br", password: "Admin@123" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = () => {
    if (login(email, password)) {
      const u = verifyCredentials(email, password)!;
      router.push(firstRouteFor(u.role));
    } else setError("Credenciais inválidas. Use um dos acessos de demonstração.");
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <Mesh />
      <div className="absolute right-5 top-5 z-10"><ThemeToggle /></div>
      <Link href="/" className="absolute left-5 top-5 z-10 flex items-center gap-2 text-sm text-muted transition hover:text-brand-500">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <Card className="relative z-10 w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-7 flex items-center gap-2 text-2xl font-semibold tracking-tight"><Lock className="h-5 w-5 text-brand-500" /> Área restrita</h1>
        <p className="mt-1 text-sm text-muted">RGL Consultoria — acesso para operadores, gestores e administradores.</p>

        <div className="mt-7 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-muted">E-mail</span>
            <Input className="mt-1.5" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="voce@segurosdigital.com.br" type="email" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-muted">Senha</span>
            <Input className="mt-1.5" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" type="password"
              onKeyDown={(e) => e.key === "Enter" && submit()} />
          </label>
          {error && <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500"><AlertCircle className="h-4 w-4" /> {error}</div>}
          <Button className="w-full" size="lg" onClick={submit}>Entrar <ArrowRight className="h-4 w-4" /></Button>
        </div>

        <div className="mt-7 border-t pt-5">
          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint"><ShieldCheck className="h-3.5 w-3.5" /> Acessos de demonstração</div>
          <div className="grid gap-2">
            {DEMO.map((d) => (
              <button key={d.role} onClick={() => { setEmail(d.email); setPassword(d.password); setError(""); }}
                className="flex items-center justify-between rounded-xl border surface px-3 py-2.5 text-left text-sm transition hover:border-brand-500/40">
                <span className="font-medium">{d.role}</span>
                <span className="font-mono text-xs text-faint">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
