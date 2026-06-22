import * as React from "react";
import { cn } from "@/lib/utils";

/** Marca Seguros Digital RGL — escudo + pulso (healthtech). */
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
      aria-label="Seguros Digital RGL"
    >
      <defs>
        <linearGradient id="rgl-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path
        d="M24 3.5 6.5 10.5v11.2C6.5 33 13.9 41.5 24 44.5c10.1-3 17.5-11.5 17.5-22.8V10.5L24 3.5Z"
        fill="url(#rgl-grad)"
      />
      <path
        d="M14 25h5.2l2.4-5.5 3.6 11 2.6-6 1.4 0.5H34"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ size = "text-lg", className }: { size?: string; className?: string }) {
  return (
    <div className={cn("flex select-none items-center gap-2.5", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-brand-500/50 blur-md" />
        <LogoMark className="relative" size={36} />
      </div>
      <span className={cn("font-semibold tracking-tight", size)}>
        Seguros Digital <span className="text-brand-500">RGL</span>
      </span>
    </div>
  );
}
