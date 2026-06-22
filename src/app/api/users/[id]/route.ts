import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => null);
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.email && { email: body.email.trim().toLowerCase() }),
        ...(body.password && { password: body.password }),
        ...(body.role && { role: body.role as "operador" | "gestor" | "admin" }),
        ...(typeof body.active === "boolean" && { active: body.active }),
      },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    console.error("[PUT /api/users/[id]]", err);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    console.error("[DELETE /api/users/[id]]", err);
    return NextResponse.json({ error: "Erro ao remover usuário" }, { status: 500 });
  }
}
