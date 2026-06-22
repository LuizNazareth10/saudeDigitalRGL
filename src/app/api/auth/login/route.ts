import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { verifyCredentials } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  // Check DB users first, fall back to SEED_USERS
  let user = null;
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: (email ?? "").trim().toLowerCase() },
    });
    if (dbUser && dbUser.active && dbUser.password === (password ?? "")) {
      user = { email: dbUser.email, name: dbUser.name, role: dbUser.role as "operador" | "gestor" | "admin" };
    }
  } catch {
    // DB unavailable — fall back to seed
  }
  if (!user) user = verifyCredentials(email ?? "", password ?? "");
  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me-min-32-chars-xx");
  const token = await new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "8h")
    .sign(secret);

  const res = NextResponse.json({ user });
  res.cookies.set("rgl-token", token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8,
  });
  return res;
}
