"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import NeuralBackground from "@/components/ui/flow-field-background";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
      .fromTo(
        headlineRef.current.children,
        { opacity: 0, y: 60, skewY: 3 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.2"
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        btnsRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.3"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#111111] text-[#ffffff] border-b border-[#e5e5e5] overflow-hidden relative min-h-screen flex items-center"
    >
      {/* Neural particle background */}
      <div className="absolute inset-0 z-0">
        <NeuralBackground
          color="#9333ea" // Purple-600 for elegant contrast
          trailOpacity={0.10} // Matched to control (0.10)
          particleCount={500}
          speed={0.58} // Matched to control (0.58)
        />
      </div>

      <div className="w-full relative z-10 py-20 md:py-24 px-6 md:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
          {/* Headline */}
          <div className="xl:col-span-8">
            <div
              ref={badgeRef}
              className="inline-block px-3 py-1 pill-btn bg-[#222222] text-[11px] font-bold tracking-widest uppercase text-[#ffffff] mb-6"
            >
              Studio Pasca-Produksi &amp; Visual Design
            </div>
            <h1
              ref={headlineRef}
              className="font-display text-[48px] sm:text-[64px] lg:text-[76px] leading-[0.95] font-bold uppercase tracking-tight text-[#ffffff]"
            >
              <span className="block">SETIAP BINGKAI.</span>
              <span className="block">SETIAP WARNA.</span>
              <span className="block">SETIAP DETAIL.</span>
            </h1>
          </div>

          {/* Sub + CTA */}
          <div className="xl:col-span-4 space-y-6">
            <p
              ref={subRef}
              className="text-[#707072] text-[15px] sm:text-[16px] leading-relaxed"
            >
              Studio kreatif independen yang berdedikasi mengangkat kekuatan
              narasi melalui gradasi warna presisi tinggi, retouching editorial
              berstandar tinggi, dan sistem desain grafis monokrom mutlak.
            </p>
            <div ref={btnsRef} className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#karya"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#karya")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 pill-btn bg-[#ffffff] text-[#111111] text-[13px] font-bold uppercase tracking-wider hover:bg-[#e5e5e5] transition-colors duration-200"
              >
                Lihat Showcase Film
              </a>
              <a
                href="#kontak"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#kontak")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 pill-btn border border-[#e5e5e5] text-[#ffffff] text-[13px] font-bold uppercase tracking-wider hover:border-[#ffffff] transition-colors duration-200"
              >
                Mulai Proyek
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
