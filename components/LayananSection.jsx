"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    category: "VISUAL EDITORIAL",
    icon: "crop_free",
    title: "Penyuntingan Foto & Retouching",
    desc: "Pasca-produksi kecantikan komersial dan editorial kelas atas. Kami menjaga tekstur alami pori kulit, menyeimbangkan luminansi seragam, dan menghasilkan kebersihan visual tingkat tinggi.",
    outputs: [
      "Frekuensi Separasi Pori 16-Bit",
      "Clean Plate & Penghilangan Objek",
      "Proof Kalibrasi Cetak CMYK / D65",
    ],
    toolBadge: "AFFINITY PHOTO 2",
    spec: "100% SRGB / CMYK",
  },
  {
    num: "02",
    category: "MOTION & COLOR",
    icon: "movie",
    title: "Penyuntingan Video & Color Grading",
    desc: "Pacing dinamis, ritme narasi, dan master color grading. Menggunakan pipeline warna ACES terdepan pada DaVinci Resolve Studio serta turnaround cepat untuk kebutuhan platform sosial modern lewat CapCut Pro.",
    outputs: [
      "Narrative Assembly & Sound Rhythm",
      "Custom Look LUT & Film Halation",
      "Multi-Format (16:9, 9:16, 4:5 Scope)",
    ],
    toolBadge: "DAVINCI / CAPCUT",
    spec: "ACEScg / REC.709",
  },
  {
    num: "03",
    category: "SYSTEMS & BRAND",
    icon: "grid_view",
    title: "Desain Grafis & Key Art",
    desc: "Tipografi brand berkarakter kuat, key art poster film, sampul vinil rekaman, dan tata letak publikasi arsitektural yang dibangun di atas presisi grid vektor tanpa kompromi.",
    outputs: [
      "Sistem Tipografi Vektor & Logotype",
      "Theatrical Key Art Poster Sinema",
      "Panduan Visual Editorial & Press Kit",
    ],
    toolBadge: "AFFINITY SUITE",
    spec: "VECTOR SVG / PDF/X-4",
  },
];

export default function LayananSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="layanan"
      ref={sectionRef}
      className="w-full bg-[#ffffff] py-24 px-6 md:px-12 border-b border-[#e5e5e5]"
    >
      <div className="w-full">
        {/* Header */}
        <div ref={headerRef} className="max-w-2xl mb-16 space-y-3 max-w-7xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#707072]">
            DISIPLIN &amp; SPESIFIKASI
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#111111]">
            Layanan Pasca-Produksi
          </h2>
          <p className="text-[#707072] text-[15px] leading-relaxed">
            Setiap layanan dikerjakan dengan presisi tanpa kompromi. Kami tidak
            memakai preset generik—setiap timeline disesuaikan dengan intensitas
            cerita dan estetika Anda.
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((s) => (
            <div
              key={s.num}
              className="sharp-tile border border-[#e5e5e5] p-8 md:p-10 flex flex-col justify-between bg-[#ffffff] hover:border-[#111111] transition-colors duration-300 group"
            >
              <div className="space-y-6">
                {/* Card header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
                    {s.num} // {s.category}
                  </span>
                  <span className="material-symbols-outlined text-[#111111]">
                    {s.icon}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold uppercase text-[#111111]">
                  {s.title}
                </h3>
                <p className="text-[#707072] text-[14px] leading-relaxed">
                  {s.desc}
                </p>

                {/* Outputs */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#707072]">
                    Output Master:
                  </div>
                  {s.outputs.map((o) => (
                    <div
                      key={o}
                      className="flex items-center gap-2 text-[12px] font-medium text-[#111111]"
                    >
                      <span className="w-1.5 h-1.5 bg-[#111111] rounded-full flex-shrink-0" />
                      {o}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 mt-8 border-t border-[#e5e5e5] flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#707072]">
                <span className="px-3 py-1 pill-btn bg-[#f5f5f5] text-[#111111]">
                  {s.toolBadge}
                </span>
                <span>{s.spec}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
