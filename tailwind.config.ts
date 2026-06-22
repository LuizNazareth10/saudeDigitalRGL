import type { Config } from "tailwindcss";

/**
 * Sistema de design — RGL Consultoria · Simulador de Planos de Saúde
 * Identidade visual: teal escuro → ciano brilhante (gradiente da marca RGL).
 * Referências: Stripe / Linear / Vercel — premium healthtech.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#ECFFFE",
          100: "#CCFFFE",
          200: "#9BFAF5",
          300: "#5EF3ED",
          400: "#14D4C8", // ciano brilhante — brand highlight
          500: "#0CC4BE", // teal primário — ações, links, ícones
          600: "#0AA0A0", // pressed / active
          700: "#0A8090", // deep teal — gradient escuro
          800: "#0A6070",
          900: "#0A4858",
          950: "#062E38",
        },
        accent: {
          400: "#22EADF",
          500: "#14D4C8", // ciano brilhante accent
          600: "#0CBCBC",
        },
        // Dark surface com tint teal para o tema escuro
        rgl: {
          bg:      "#020C12", // fundo escuro — quase preto com tint teal
          surface: "#061820", // superfície de cards
          border:  "#0C3040", // borda sutil teal
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem", "3xl": "1.5rem" },
      boxShadow: {
        brand:  "0 8px 30px -8px rgba(12,196,190,0.50)",
        glass:  "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 40px -12px rgba(0,0,0,0.4)",
        teal:   "0 0 40px -8px rgba(20,212,200,0.35)",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        floaty:  { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        pulse:   { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
        ecg: {
          "0%":   { strokeDashoffset: "200" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        fadeUp:  "fadeUp 0.55s cubic-bezier(.22,1,.36,1) both",
        floaty:  "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
        ecg:     "ecg 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
