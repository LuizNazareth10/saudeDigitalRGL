"use client";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Marca vetorial RGL — ECG + escudo, identidade da RGL Consultoria */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="RGL Consultoria"
    >
      <defs>
        <linearGradient id="rgl-shield" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A7A8A" />
          <stop offset="0.55" stopColor="#0CC4BE" />
          <stop offset="1" stopColor="#14D4C8" />
        </linearGradient>
        <linearGradient id="rgl-glow" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14D4C8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#14D4C8" />
          <stop offset="1" stopColor="#14D4C8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Escudo */}
      <path
        d="M24 3.5 6.5 10.5v11.2C6.5 33 13.9 41.5 24 44.5c10.1-3 17.5-11.5 17.5-22.8V10.5L24 3.5Z"
        fill="url(#rgl-shield)"
      />
      {/* Linha ECG (batimento cardíaco) */}
      <path
        d="M11 26h5.5l2.5-5.8 3.8 11.5L26 25l1.5 1H37"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
    </svg>
  );
}

/** Logo completo com imagem oficial da RGL ou fallback em texto */
export function Logo({ size = "text-lg", className, white = false }: { size?: string; className?: string; white?: boolean }) {
  return (
    <div className={cn("flex select-none items-center gap-3", className)}>
      {/* Marca oficial da RGL Consultoria — Logo-Branca.png */}
      <div className="relative flex items-center">
        <div className="absolute inset-0 rounded-xl blur-md" style={{ background: "rgba(12,196,190,0.45)" }} />
        <Image
          src="https://rglconsultoriajf.com.br/wp-content/uploads/2024/01/Logo-Branca.png"
          alt="RGL Consultoria"
          width={40}
          height={40}
          className="relative h-9 w-auto object-contain drop-shadow-lg"
          unoptimized
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn("font-bold tracking-tight", size, white ? "text-white" : "")}>
          RGL <span className="brand-text">Consultoria</span>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
          Planos de Saúde
        </span>
      </div>
    </div>
  );
}

/** Versão compacta — só o escudo SVG (para favicons, watermarks) */
export { LogoMark as RGLMark };
