"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AmourSunrisePreloader from "@/components/ui/amour-sunrise-preloader";

gsap.registerPlugin(ScrollTrigger);

// Bungkus preloader: setelah gerbang terangkat, dokumen berubah dari kotak
// 100svh (posisi terkunci saat loading) menjadi tinggi konten penuh, jadi
// Lenis dan ScrollTrigger harus dihitung ulang supaya scroll jalan normal.
export default function LoadingGate({ children, ...props }) {
  const handleComplete = () => {
    const settle = () => {
      window.__lenis?.resize?.();
      ScrollTrigger.refresh();
    };
    requestAnimationFrame(() => requestAnimationFrame(settle));
    window.setTimeout(settle, 300);

    // Kabari section (mis. intro hero) bahwa gerbang sudah terangkat,
    // supaya intro besar tidak diputar di balik preloader.
    window.__tansLoaded = true;
    window.dispatchEvent(new CustomEvent("tans:loaded"));
  };

  return (
    <AmourSunrisePreloader onComplete={handleComplete} {...props}>
      {children}
    </AmourSunrisePreloader>
  );
}
