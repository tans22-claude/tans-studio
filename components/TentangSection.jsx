"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  {
    name: "DaVinci Resolve Studio",
    sub: "Color Grading • ACES Pipeline • Fairlight",
    version: "19.1",
  },
  {
    name: "CapCut Pro Production",
    sub: "High-Speed Pacing • 4K Social Editorial",
    version: "PRO",
  },
  {
    name: "Affinity Suite (Canva)",
    sub: "Photo • Designer • Publisher (32-Bit OCIO)",
    version: "V2",
  },
];

const pillars = [
  {
    title: "Presisi Sains",
    desc: "Alur kerja ACES menjaga akurasi warna di seluruh perangkat pemutaran modern.",
  },
  {
    title: "Prioritas Ritme",
    desc: "Potongan yang mengalir. Penyelarasan ketat antara ritme musik dan emosi narasi.",
  },
  {
    title: "Akses Langsung",
    desc: "Komunikasi langsung dengan editor dan colorist dari potongan awal hingga master akhir.",
  },
];

export default function TentangSection() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="tentang"
      ref={sectionRef}
      className="w-full bg-[#ffffff] py-24 px-6 md:px-12 border-b border-[#e5e5e5]"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
        {/* Philosophy Left */}
        <div ref={leftRef} className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#707072]">
              TENTANG TANS STUDIO
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#111111] mt-2 leading-[1.05]">
              Tanpa birokrasi berbelit.
              <br />
              Keahlian terfokus pada setiap piksel.
            </h2>
          </div>
          <p className="text-[#707072] text-[15px] sm:text-[16px] leading-relaxed">
            TANS STUDIO didirikan dengan prinsip tegas: pasca-produksi terbaik
            lahir saat Anda memangkas perantara dan bekerja langsung bersama
            artisan yang mengeksekusi setiap frame karya Anda. Kami beroperasi
            sebagai boutique suite independen yang berkolaborasi secara global
            dengan sinematografer, agensi, dan kreator independen.
          </p>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#e5e5e5]">
            {pillars.map((p) => (
              <div key={p.title} className="space-y-2">
                <div className="font-display text-lg font-bold uppercase text-[#111111]">
                  {p.title}
                </div>
                <p className="text-[#707072] text-[13px]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Toolkit Right */}
        <div
          ref={rightRef}
          className="lg:col-span-5 bg-[#f5f5f5] sharp-tile border border-[#e5e5e5] p-8 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
                TOOLKIT KREATIF TERUJI
              </span>
              <span className="text-[11px] font-semibold uppercase text-[#707072]">
                HARDWARE &amp; STACK
              </span>
            </div>

            <div className="space-y-3">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="sharp-tile bg-[#ffffff] border border-[#e5e5e5] p-4 flex items-center justify-between hover:border-[#111111] transition-colors duration-200"
                >
                  <div>
                    <div className="font-bold text-[14px] text-[#111111] uppercase">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-[#707072] uppercase">
                      {tool.sub}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 pill-btn bg-[#111111] text-[#ffffff] text-[10px] font-bold flex-shrink-0">
                    {tool.version}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#e5e5e5] flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#707072]">
            <span>MONITOR 10-BIT KALIBRASI</span>
            <span>D65 1000 NITS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
