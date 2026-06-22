import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Lead } from "@/types";

function mapToLead(l: {
  id: string; name: string; phone: string; createdAt: Date;
  budget: {
    city: string; uf: string; neighborhood: string | null; leadAge: number | null;
    browser: string | null; os: string | null; device: string;
    journey: unknown; completedJourney: boolean; proposalGenerated: boolean;
    selectedPlan: string | null; selectedOperator: string | null; selectedPrice: number | null;
    journeyDuration: number | null;
  } | null;
}): Lead {
  const b = l.budget;
  const journeyStep = b ? ((b.journey as { step?: number })?.step ?? 7) : 1;
  return {
    id: l.id,
    name: l.name,
    phone: l.phone,
    city: b?.city ?? "—",
    uf: b?.uf ?? "MG",
    neighborhood: b?.neighborhood ?? "—",
    age: b?.leadAge ?? 0,
    browser: b?.browser ?? "Web",
    os: b?.os ?? "Web",
    device: (b?.device ?? "desktop") as Lead["device"],
    step: journeyStep,
    completed: b?.completedJourney ?? false,
    proposalGenerated: b?.proposalGenerated ?? false,
    selectedPlan: b?.selectedPlan ?? null,
    selectedOperator: b?.selectedOperator ?? null,
    selectedPrice: b?.selectedPrice ?? null,
    durationSec: b?.journeyDuration ?? 0,
    createdAt: l.createdAt.toISOString(),
  };
}

export async function GET() {
  const rows = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { budget: true },
  });
  const leads: Lead[] = rows.map(mapToLead);
  return NextResponse.json({ leads });
}

type LeadPostBody = Partial<Lead> & {
  contractType?: string;
  beneficiaries?: { age: number; type: string }[];
  plans?: unknown[];
  matchScore?: number;
};

export async function POST(req: Request) {
  const body: LeadPostBody = await req.json().catch(() => null);
  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: "name e phone são obrigatórios" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      phone: body.phone,
      budget: {
        create: {
          journey: {
            step: body.step ?? 7,
            city: body.city,
            uf: body.uf,
            contract: body.contractType,
            beneficiaries: body.beneficiaries,
          },
          completedJourney: body.completed ?? false,
          journeyDuration: body.durationSec ?? null,
          city: body.city ?? "—",
          neighborhood: body.neighborhood && body.neighborhood !== "—" ? body.neighborhood : null,
          uf: body.uf ?? "MG",
          leadAge: body.age || null,
          contractType: body.contractType ?? null,
          beneficiaries: body.beneficiaries ? (body.beneficiaries as object[]) : undefined,
          device: (body.device ?? "desktop") as "mobile" | "desktop" | "tablet",
          browser: body.browser ?? null,
          os: body.os ?? null,
          selectedPlan: body.selectedPlan ?? null,
          selectedOperator: body.selectedOperator ?? null,
          selectedPrice: body.selectedPrice ?? null,
          plans: body.plans ? (body.plans as object[]) : undefined,
          proposalGenerated: body.proposalGenerated ?? false,
        },
      },
    },
    include: { budget: true },
  });

  return NextResponse.json({ ok: true, lead: mapToLead(lead) }, { status: 201 });
}
