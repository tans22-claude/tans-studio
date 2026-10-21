"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { name: "DaVinci Resolve Studio", sub: "Color · ACES · Fairlight", version: "19.1" },
  { name: "Affinity Suite", sub: "Photo · Designer · Publisher", version: "V2" },
  { name: "CapCut Pro", sub: "Pacing · 4K social", version: "Pro" },
];

const pillars = [
  {
    num: "01",
    title: "Presisi",
    desc: "Pipeline ACES menjaga warna tetap akurat dari monitor ke master.",
  },
  {
    num: "02",
    title: "Ritme",
    desc: "Potongan, musik, dan emosi narasi diselaraskan sampai terasa utuh.",
  },
  {
    num: "03",
    title: "Akses",
    desc: "Komunikasi langsung dengan editor dari potongan awal sampai final.",
  },
];

export default function TentangSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="tentang"
      ref={sectionRef}
      className="section-pad w-full bg-[#260212]"
    >
      <div ref={contentRef} className="container-page">
        <p className="eyebrow mb-5">Tentang studio</p>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <h2 className="display-lg text-[#e10600]">
            Tanpa
            <br />
            birokrasi.
            <br />
            <span className="text-[#ffc7c6]">Hanya presisi.</span>
          </h2>

          <div className="lg:pt-2">
            <p className="body-copy max-w-[440px]">
              TANS STUDIO adalah suite pasca-produksi independen. Pekerjaan
              dikerjakan langsung oleh artisan yang mengeksekusi setiap frame —
              bukan diteruskan ke lapisan agensi.
            </p>
            <p className="mt-4 max-w-[440px] text-[13px] leading-relaxed text-[#ffc7c6]/55">
              Berbasis di UTC+7, berkolaborasi dengan sineas, fotografer, dan
              brand dari berbagai zona waktu.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-black pt-8 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.num}>
              <span className="label text-[#e10600]">{pillar.num}</span>
              <h3 className="mt-3 font-display text-[27px] leading-none tracking-[0.015em] text-white">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-[12px] leading-relaxed text-[#ffc7c6]/65">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-black bg-[#4f0423] p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black pb-4">
            <span className="label text-[#ffc7c6]">Toolkit</span>
            <span className="label text-[#ffc7c6]/45">
              Monitor 10-bit · D65 · 1000 nits
            </span>
          </div>
          <ul className="divide-y divide-black/70">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] text-white">
                    {tool.name}
                  </div>
                  <div className="mt-1 text-[11px] text-[#ffc7c6]/55">
                    {tool.sub}
                  </div>
                </div>
                <span className="label shrink-0 rounded-[5px] border border-[#ffc7c6]/25 px-2 py-1 text-[#ffc7c6]">
                  {tool.version}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
