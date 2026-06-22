import { Navbar } from "@/components/marketing/Navbar";
import { Mesh } from "@/components/ui/mesh";
import { Hero, HowItWorks, OperatorsSection, FinalCTA, Footer } from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Mesh />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <OperatorsSection />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
