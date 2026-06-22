import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEED_USERS } from "@/lib/auth";

async function ensureSeeded() {
  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.createMany({
      data: SEED_USERS.map((u) => ({
        email: u.email,
        name: u.name,
        password: u.password,
        role: u.role as "operador" | "gestor" | "admin",
        active: true,
      })),
      skipDuplicates: true,
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return NextResponse.json({ users: [], error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.email || !body?.name || !body?.password) {
      return NextResponse.json({ error: "email, name e password são obrigatórios" }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        email: body.email.trim().toLowerCase(),
        name: body.name.trim(),
        password: body.password,
        role: (body.role ?? "operador") as "operador" | "gestor" | "admin",
        active: true,
      },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }
    console.error("[POST /api/users]", err);
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}
