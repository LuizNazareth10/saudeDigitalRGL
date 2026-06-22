import { NextResponse } from "next/server";
import { recommend } from "@/lib/recommendation";
import type { SimulationInput } from "@/types";

/** POST /api/recommend — motor de recomendação (stateless). */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as SimulationInput | null;
  if (!body?.city || !Array.isArray(body.beneficiaries)) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const results = recommend(body, 6);
  return NextResponse.json({ results });
}
