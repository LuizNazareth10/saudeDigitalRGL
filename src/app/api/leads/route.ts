import { NextResponse } from "next/server";
import { generateLeads } from "@/lib/seed-leads";

/**
 * GET  /api/leads — lista leads (demo: dados-semente; produção: Prisma/Neon).
 * POST /api/leads — registra um lead.
 */
export async function GET() {
  return NextResponse.json({ leads: generateLeads() });
}

export async function POST(req: Request) {
  const lead = await req.json().catch(() => null);
  if (!lead) return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  // TODO produção: await prisma.lead.create({ data: ... })
  return NextResponse.json({ ok: true, lead }, { status: 201 });
}
