import type { Role, User } from "@/types";

/**
 * Usuários-semente para teste. Em produção, substitua por consulta ao banco
 * com senha em hash (bcrypt/argon2) — ver prisma/schema.prisma + /api/auth/login.
 */
export interface SeedUser extends User {
  password: string;
}

export const SEED_USERS: SeedUser[] = [
  { email: "operador@segurosdigital.com.br", password: "Operador@123", role: "operador", name: "Operador Demo" },
  { email: "gestor@segurosdigital.com.br", password: "Gestor@123", role: "gestor", name: "Gestor Demo" },
  { email: "admin@segurosdigital.com.br", password: "Admin@123", role: "admin", name: "Administrador Demo" },
];

export function verifyCredentials(email: string, password: string): User | null {
  const u = SEED_USERS.find(
    (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password
  );
  if (!u) return null;
  return { email: u.email, name: u.name, role: u.role };
}

/** Navegação permitida por perfil (hierárquico). */
export const NAV_BY_ROLE: Record<Role, string[]> = {
  operador: ["leads", "propostas"],
  gestor: ["executivo", "funil", "geografico", "planos", "ux"],
  admin: [
    "executivo", "funil", "geografico", "planos", "ux",
    "leads", "propostas",
    "usuarios", "operadoras", "planos-admin", "precos", "auditoria",
  ],
};
