"use client";

import { useEffect, useState } from "react";
import WavingPortfolioLanding from "@/components/ui/waving-portfolio-landing";

export default function HeroSection() {
  // Intro poster hanya diputar setelah preloader terangkat, supaya tidak
  // habis diputar di balik layar loading.
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (window.__tansLoaded) {
      setIntro(true);
      return;
    }
    const onLoaded = () => setIntro(true);
    window.addEventListener("tans:loaded", onLoaded);
    return () => window.removeEventListener("tans:loaded", onLoaded);
  }, []);

  return (
    <section className="relative mt-14 w-full overflow-hidden bg-[#f6f4f0]">
      <WavingPortfolioLanding
        height="calc(100svh - 3.5rem)"
        name="TANS STUDIO"
        year="2026"
        roles={["Color Grading", "Retouching"]}
        lettersLeft={["P", "F"]}
        giantLetter="O"
        lettersRight={["RT", "LIO"]}
        title="Portfolio TANS Studio — color grading, retouching, dan key art"
        signature="TANS/STUDIO"
        greeting="Halo!"
        accent="#e10600"
        paper="#f6f4f0"
        ink="#141414"
        intro={intro}
      />
    </section>
  );
}
