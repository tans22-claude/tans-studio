"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  {
    name: "DaVinci Resolve Studio",
    sub: "Color · ACES · Fairlight",
    version: "19.1",
  },
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
      className="section-pad w-full border-t border-ash bg-bone"
    >
      <div ref={contentRef} className="shell">
        <p className="eyebrow text-graphite">Tentang studio</p>

        <div className="mt-5 grid gap-10 border-b border-ash pb-12 lg:grid-cols-12 lg:gap-8">
          <h2 className="display lg:col-span-7">
            Tanpa
            <br />
            <span className="text-graphite">birokrasi.</span>
          </h2>

          <div className="lg:col-span-5 lg:pt-2">
            <p className="body-copy max-w-[440px]">
              TANS STUDIO adalah suite pasca-produksi independen. Pekerjaan
              dikerjakan langsung oleh artisan yang mengeksekusi setiap frame —
              bukan diteruskan ke lapisan agensi.
            </p>
            <p className="body-copy mt-4 max-w-[440px]">
              Berbasis di UTC+7, berkolaborasi dengan sineas, fotografer, dan
              brand dari berbagai zona waktu.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="border-t border-ink pt-4"
            >
              <span className="eyebrow text-graphite">{pillar.num}</span>
              <h3 className="heading-sm mt-8">{pillar.title}</h3>
              <p className="body-copy mt-3">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid border border-ink bg-powder md:grid-cols-[0.7fr_1.3fr]">
          <div className="border-b border-ink p-6 md:border-b-0 md:border-r md:p-8">
            <p className="eyebrow text-ink/60">Toolkit</p>
            <p className="heading-sm mt-4 max-w-[300px]">
              Monitor 10-bit. D65. 1000 nits.
            </p>
            <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-ink/65">
              Ruang kerja yang dikalibrasi untuk keputusan warna yang bisa
              dipertanggungjawabkan.
            </p>
          </div>

          <ul className="divide-y divide-ink/20">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className="flex items-center justify-between gap-4 px-6 py-4 md:px-8"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm">{tool.name}</div>
                  <div className="mt-1 text-[11px] text-ink/55">
                    {tool.sub}
                  </div>
                </div>
                <span className="tag shrink-0 border-ink/30">
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
