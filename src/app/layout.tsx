import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Seguros Digital RGL · Simulador de planos de saúde", template: "%s · Seguros Digital RGL" },
  description:
    "Simule e compare planos de saúde das principais operadoras da região de Juiz de Fora / MG. Recomendação inteligente em menos de 2 minutos.",
  applicationName: "Seguros Digital RGL",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://segurosdigital-rgl.com.br"),
  openGraph: {
    title: "Seguros Digital RGL",
    description: "Encontre o plano de saúde certo para você na região de Juiz de Fora.",
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
