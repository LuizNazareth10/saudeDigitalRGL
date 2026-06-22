import type { Metadata } from "next";
import { JourneyProvider } from "@/components/journey/JourneyProvider";
import { Journey } from "@/components/journey/Journey";

export const metadata: Metadata = { title: "Simular plano" };

export default function SimularPage() {
  return (
    <JourneyProvider>
      <Journey />
    </JourneyProvider>
  );
}
