"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { firstRouteFor } from "@/lib/nav";

export default function PainelIndex() {
  const { user } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (user) router.replace(firstRouteFor(user.role));
  }, [user, router]);
  return <div className="skeleton h-10 w-40 rounded-xl" />;
}
