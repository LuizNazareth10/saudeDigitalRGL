"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";

export const PIE = ["#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

export function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    grid: dark ? "#1e293b" : "#e2e8f0",
    axis: dark ? "#64748b" : "#94a3b8",
    tooltip: {
      contentStyle: {
        background: dark ? "#0f172a" : "#ffffff",
        border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
        borderRadius: 12,
        fontSize: 12,
      },
      labelStyle: { color: dark ? "#94a3b8" : "#64748b" },
    },
  };
}

export function KPI({
  label, value, sub, icon: Icon, accent = "#10b981",
}: { label: string; value: React.ReactNode; sub?: string; icon: any; accent?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${accent}1f` }}>
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-faint">{sub}</div>}
    </Card>
  );
}

export function ChartCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>{right}
      </div>
      {children}
    </Card>
  );
}
