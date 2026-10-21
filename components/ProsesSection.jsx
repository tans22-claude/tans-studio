"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Brief & Arah",
    desc: "Lingkup, referensi, dan mood dikunci sebelum frame pertama disentuh.",
  },
  {
    num: "02",
    title: "Assembly",
    desc: "Potongan kasar, ritme, dan keseimbangan eksposur dasar.",
  },
  {
    num: "03",
    title: "Refine & Grade",
    desc: "Retouch level piksel dan grading multi-node di ruang ACES.",
  },
  {
    num: "04",
    title: "Master Deliver",
    desc: "ProRes 4444 XQ, TIFF/PNG, dan validasi profil warna akhir.",
  },
];

export default function ProsesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 86%" },
        }
      );
      gsap.fromTo(
        gridRef.current?.children ?? [],
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: gridRef.current, start: "top 84%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="proses"
      ref={sectionRef}
      className="section-pad w-full border-y border-black bg-[#1a0208]"
    >
      <div className="container-page">
        <div
          ref={headerRef}
          className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end md:pb-12"
        >
          <div>
            <p className="eyebrow mb-4">Proses — raw to master</p>
            <h2 className="display-xl text-[#e10600]">
              Empat
              <br />
              <span className="text-[#ffc7c6]">Langkah.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[330px] md:text-right">
            Alur kerja yang sama untuk setiap proyek. Terukur, tanpa kejutan di
            menit terakhir.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <article
              key={step.num}
              className="group flex min-h-[220px] flex-col justify-between rounded-xl border border-black bg-[#4f0423] p-5 transition-colors duration-200 hover:border-[#e10600]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-[46px] leading-none tracking-[0.02em] text-[#e10600]">
                  {step.num}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-8 bg-[#ffc7c6]/30 transition-colors duration-200 group-hover:bg-[#e10600]"
                />
              </div>
              <div className="mt-8">
                <h3 className="font-display text-[24px] leading-[0.95] tracking-[0.015em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[12px] leading-relaxed text-[#ffc7c6]/70">
                  {step.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
