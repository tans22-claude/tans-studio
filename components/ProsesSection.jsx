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
    accent: "bg-powder",
  },
  {
    num: "02",
    title: "Assembly",
    desc: "Potongan kasar, ritme, dan keseimbangan eksposur dasar.",
    accent: "bg-mint",
  },
  {
    num: "03",
    title: "Refine & Grade",
    desc: "Retouch level piksel dan grading multi-node di ruang ACES.",
    accent: "bg-candy",
  },
  {
    num: "04",
    title: "Master Deliver",
    desc: "ProRes 4444 XQ, TIFF/PNG, dan validasi profil warna akhir.",
    accent: "bg-signal",
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
      className="section-pad w-full bg-bone"
    >
      <div className="shell">
        <div
          ref={headerRef}
          className="flex flex-col justify-between gap-8 border-b border-ash pb-10 md:flex-row md:items-end md:pb-12"
        >
          <div>
            <p className="eyebrow text-graphite">Proses — raw to master</p>
            <h2 className="display mt-5">
              Empat
              <br />
              <span className="text-graphite">langkah.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[330px] md:pb-2 md:text-right">
            Alur kerja yang sama untuk setiap proyek. Terukur, tanpa kejutan di
            menit terakhir.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <article
              key={step.num}
              className="group flex min-h-[250px] flex-col border-t border-ink pt-5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="eyebrow text-graphite">{step.num}</span>
                <span
                  aria-hidden="true"
                  className={`h-3 w-3 ${step.accent} transition-transform duration-300 group-hover:scale-125`}
                />
              </div>
              <div className="mt-auto pt-16">
                <h3 className="heading-sm">{step.title}</h3>
                <p className="body-copy mt-3">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
