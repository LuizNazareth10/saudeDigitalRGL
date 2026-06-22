import type { Config } from "tailwindcss";

/**
 * Sistema de design — Seguros Digital RGL
 * Identidade: healthtech premium (referências Stripe / Linear / Vercel).
 * Cor de marca: esmeralda → ciano. Tipografia técnica em mono para dados.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // primária
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        accent: {
          400: "#22d3ee",
          500: "#06b6d4", // secundária (ciano)
          600: "#0891b2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem", "3xl": "1.5rem" },
      boxShadow: {
        brand: "0 8px 30px -8px rgba(16,185,129,0.45)",
        glass: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 40px -12px rgba(0,0,0,0.4)",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
      },
      animation: {
        fadeUp: "fadeUp 0.55s cubic-bezier(.22,1,.36,1) both",
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
