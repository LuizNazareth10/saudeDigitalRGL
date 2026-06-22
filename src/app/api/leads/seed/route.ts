import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateLeads } from "@/lib/seed-leads";

/** POST /api/leads/seed — insere leads fictícias no Neon para teste. Remover em produção final. */
export async function POST() {
  const leads = generateLeads(168);
  let inserted = 0;

  for (const l of leads) {
    try {
      await prisma.lead.create({
        data: {
          name: l.name,
          phone: l.phone,
          createdAt: new Date(l.createdAt),
          budget: {
            create: {
              journey: { step: l.step },
              completedJourney: l.completed,
              journeyDuration: l.durationSec,
              city: l.city,
              neighborhood: l.neighborhood && l.neighborhood !== "—" ? l.neighborhood : null,
              uf: l.uf,
              leadAge: l.age,
              device: l.device,
              browser: l.browser,
              os: l.os,
              selectedPlan: l.selectedPlan,
              selectedOperator: l.selectedOperator,
              selectedPrice: l.selectedPrice,
              proposalGenerated: l.proposalGenerated,
            },
          },
        },
      });
      inserted++;
    } catch {
      // ignora duplicatas / erros individuais
    }
  }

  return NextResponse.json({ ok: true, inserted });
}
