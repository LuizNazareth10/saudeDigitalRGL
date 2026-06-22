"use client";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/"><Logo /></Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" size="sm"><Lock className="h-3.5 w-3.5" /> Área restrita</Button>
          </Link>
          <Link href="/simular"><Button size="sm">Simular</Button></Link>
        </div>
      </div>
    </header>
  );
}
