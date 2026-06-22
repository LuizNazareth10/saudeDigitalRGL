"use client";
import * as React from "react";
import { FileText, Eye, Calendar, Phone, MapPin, User, Star, CheckCircle2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { useStore } from "@/providers/store-provider";
import { OPERATORS } from "@/lib/data/operators";
import { PLANS } from "@/lib/data/plans";
import { BRL } from "@/lib/format";
import type { Lead, OperatorId } from "@/types";

function ProposalModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const op = OPERATORS[lead.selectedOperator as OperatorId];
  const plan = PLANS.find((p) => p.name === lead.selectedPlan);
  const waMsg = encodeURIComponent(
    `Olá! Vi meu plano sugerido: *${lead.selectedPlan}* (${BRL(lead.selectedPrice ?? 0)}/mês) e gostaria de mais informações.`
  );
  const waLink = `https://wa.me/5532999999999?text=${waMsg}`;

  return (
    <Modal open onClose={onClose} title="Proposta gerada" className="max-w-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border surface p-4">
          {lead.selectedOperator && <OperatorMark op={lead.selectedOperator as OperatorId} size={48} />}
          <div>
            <div className="font-semibold">{lead.selectedPlan}</div>
            <div className="text-sm text-muted">{op?.name}</div>
            <div className="mt-1 font-mono text-xl font-bold text-brand-500">
              {BRL(lead.selectedPrice ?? 0)}<span className="text-xs font-normal text-faint">/mês</span>
            </div>
          </div>
        </div>

        {plan?.benefits && plan.benefits.length > 0 && (
          <div className="rounded-xl border surface p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">Benefícios incluídos</div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {plan.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-500" /> {b}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border surface p-4 space-y-2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">Dados do lead</div>
          <div className="flex items-center gap-2 text-sm"><User className="h-3.5 w-3.5 text-faint" /> {lead.name}</div>
          <div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-faint" /> {lead.phone}</div>
          <div className="flex items-center gap-2 text-sm"><MapPin className="h-3.5 w-3.5 text-faint" /> {lead.city} · {lead.uf}</div>
          <div className="flex items-center gap-2 text-sm"><Calendar className="h-3.5 w-3.5 text-faint" /> {new Date(lead.createdAt).toLocaleDateString("pt-BR")}</div>
        </div>

        {plan?.network && plan.network.length > 0 && (
          <div className="rounded-xl border surface p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">
              Rede hospitalar — {plan.network.length} hospital(is)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {plan.network.map((h) => (
                <Badge key={h} className="surface text-xs">{h}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full gap-2">
              <MessageCircle className="h-4 w-4" /> Contatar via WhatsApp
            </Button>
          </a>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
}

export function Proposals() {
  const { leads } = useStore();
  const proposals = leads.filter((l) => l.proposalGenerated && l.selectedPlan);
  const [selected, setSelected] = React.useState<Lead | null>(null);

  return (
    <div className="space-y-5">
      {selected && <ProposalModal lead={selected} onClose={() => setSelected(null)} />}

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
              <Badge className="border-brand-500/30 bg-brand-500/10 font-mono text-brand-600 dark:text-brand-400">#{l.id.slice(-6)}</Badge>
            </div>
            <div className="mt-4 rounded-xl border surface p-3">
              <div className="text-xs text-faint">Plano sugerido</div>
              <div className="text-sm font-medium">{l.selectedPlan}</div>
              <div className="mt-1 text-xs text-muted">{OPERATORS[l.selectedOperator as OperatorId]?.name}</div>
              <div className="mt-2 font-mono text-lg font-semibold">{BRL(l.selectedPrice ?? 0)}<span className="text-xs font-normal text-faint">/mês</span></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-faint">
                <Calendar className="h-3.5 w-3.5" /> {new Date(l.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelected(l)}>
                <Eye className="h-3.5 w-3.5" /> Ver proposta
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
