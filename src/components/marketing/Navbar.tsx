"use client";
import Link from "next/link";
import { Lock, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const waLink = "https://wa.me/5532999405609?text=Ol%C3%A1%21+Gostaria+de+simular+um+plano+de+sa%C3%BAde.";

  return (
    <header className="relative z-20">
      {/* Borda superior — gradiente RGL */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/"><Logo /></Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-3.5 w-3.5 text-brand-400" />
              <span className="hidden md:inline">Falar com corretor</span>
            </Button>
          </a>
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" size="sm"><Lock className="h-3.5 w-3.5" /> Área restrita</Button>
          </Link>
          <Link href="/simular">
            <Button size="sm">Simular</Button>
          </Link>
        </div>
      </div>

      {/* Linha ECG sutil */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-700/50 to-transparent" />
    </header>
  );
}
