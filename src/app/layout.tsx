import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "RGL Consultoria · Simulador de Planos de Saúde", template: "%s · RGL Consultoria" },
  description:
    "Simule e compare planos de saúde da Cedplan, Plasc, Unimed JF e Sul América. Recomendação personalizada em menos de 2 minutos — pela RGL Consultoria, Juiz de Fora/MG.",
  applicationName: "RGL Consultoria",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://segurosdigital-rgl.vercel.app"),
  openGraph: {
    title: "RGL Consultoria · Simulador de Planos de Saúde",
    description: "Encontre o plano de saúde certo para você com a RGL Consultoria em Juiz de Fora / MG.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
