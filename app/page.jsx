import SmoothScroll from "@/components/SmoothScroll";
import LoadingGate from "@/components/LoadingGate";
import { Component as KineticNav } from "@/components/ui/sterling-gate-kinetic-navigation";
import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import PersonalProjectSection from "@/components/PersonalProjectSection";
import VideoProjectsSection from "@/components/VideoProjectsSection";
import WipeInspector from "@/components/WipeInspector";
import LayananSection from "@/components/LayananSection";
import ProsesSection from "@/components/ProsesSection";
import TentangSection from "@/components/TentangSection";
import KontakSection from "@/components/KontakSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LoadingGate
      word="TANS"
      caption="loading, with love"
      palette={{
        paper: "#fffef7",
        ink: "#000000",
        sun: "#8a0467",
        core: "#101731",
        glow: "#fffef7",
      }}
    >
      <SmoothScroll>
        <KineticNav />
        <main id="main">
          <HeroSection />
          <AboutMeSection />
          <PersonalProjectSection />
          <VideoProjectsSection />
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
