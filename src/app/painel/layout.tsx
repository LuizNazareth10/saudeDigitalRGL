"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Shell } from "@/components/dashboard/Shell";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!user && !localStorage.getItem("rgl-user")) router.replace("/login");
      else setReady(true);
    }, 60);
    return () => clearTimeout(t);
  }, [user, router]);

  if (!ready && !user) {
    return <div className="grid min-h-screen place-items-center"><div className="skeleton h-10 w-40 rounded-xl" /></div>;
  }
  return <Shell>{children}</Shell>;
}
