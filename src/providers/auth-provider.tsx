"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { verifyCredentials } from "@/lib/auth";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
const AuthCtx = React.createContext<AuthState>({ user: null, login: () => false, logout: () => {} });
export const useAuth = () => React.useContext(AuthCtx);

/**
 * Demo: valida contra usuários-semente no cliente. Em produção, troque `login`
 * por uma chamada a POST /api/auth/login (JWT em cookie httpOnly).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const raw = localStorage.getItem("rgl-user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = (email: string, password: string) => {
    const u = verifyCredentials(email, password);
    if (!u) return false;
    setUser(u);
    localStorage.setItem("rgl-user", JSON.stringify(u));
    return true;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("rgl-user");
    router.push("/");
  };

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
