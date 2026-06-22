"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border px-4 py-3 outline-none transition surface placeholder:text-faint",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
