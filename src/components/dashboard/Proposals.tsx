"use client";
import * as React from "react";
import { FileText, Eye, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { useStore } from "@/providers/store-provider";
import { OPERATORS } from "@/lib/data/operators";
import { BRL } from "@/lib/format";
import type { OperatorId } from "@/types";

export function Proposals() {
  const { leads } = useStore();
  const proposals = leads.filter((l) => l.proposalGenerated && l.selectedPlan);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-2.5 text-xs text-muted">
        <FileText className="mr-1.5 inline h-3.5 w-3.5 text-brand-500" />
        <strong>{proposals.length}</strong> propostas geradas a partir de jornadas concluídas.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {proposals.slice(0, 30).map((l) => (
          <Card key={l.id} className="p-5 transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {l.selectedOperator && <OperatorMark op={l.selectedOperator as OperatorId} size={42} />}
                <div>
                  <div className="text-sm font-semibold leading-tight">{l.name}</div>
                  <div className="text-xs text-faint">{l.city} · {l.uf}</div>
                </div>
              </div>
              <Badge className="border-brand-500/30 bg-brand-500/10 font-mono text-brand-600 dark:text-brand-400">#{l.id}</Badge>
            </div>
            <div className="mt-4 rounded-xl border surface p-3">
              <div className="text-xs text-faint">Plano sugerido</div>
              <div className="text-sm font-medium">{l.selectedPlan}</div>
              <div className="mt-1 text-xs text-muted">{OPERATORS[l.selectedOperator as OperatorId]?.name}</div>
              <div className="mt-2 font-mono text-lg font-semibold">{BRL(l.selectedPrice ?? 0)}<span className="text-xs font-normal text-faint">/mês</span></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-faint"><Calendar className="h-3.5 w-3.5" /> {new Date(l.createdAt).toLocaleDateString("pt-BR")}</span>
              <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5" /> Ver proposta</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
