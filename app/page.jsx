import SmoothScroll from "@/components/SmoothScroll";
import LoadingGate from "@/components/LoadingGate";
import { Component as KineticNav } from "@/components/ui/sterling-gate-kinetic-navigation";
import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import PosterSection from "@/components/PosterSection";
import WorkspaceSection from "@/components/WorkspaceSection";
import WipeInspector from "@/components/WipeInspector";
import LayananSection from "@/components/LayananSection";
import ProsesSection from "@/components/ProsesSection";
import TentangSection from "@/components/TentangSection";
import KontakSection from "@/components/KontakSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LoadingGate word="TANS" caption="loading, with love">
      <SmoothScroll>
        <KineticNav />
        <main>
          <HeroSection />
          <AboutMeSection />
          <PosterSection />
          <WorkspaceSection />
          <WipeInspector />
          <LayananSection />
          <ProsesSection />
          <TentangSection />
          <KontakSection />
        </main>
        <Footer />
      </SmoothScroll>
    </LoadingGate>
  );
}
