import * as React from "react";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-500">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </div>
  );
}
