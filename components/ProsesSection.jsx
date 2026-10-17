"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    phase: "FASE SATU",
    title: "Brief & Arah Visual",
    desc: "Penetapan ruang lingkup, referensi estetika, dan kalibrasi mood. Kami membedah rekaman mentah atau foto Anda dan mengunci moodboard sebelum memulai penyuntingan.",
    key: "Kunci: Penyelarasan Mood",
  },
  {
    num: "02",
    phase: "FASE DUA",
    title: "Edit & Assembly",
    desc: "Perakitan kasar, sinkronisasi ritme, stabilisasi shot, dan penyeimbangan eksposur dasar untuk membangun dinamika emosional cerita.",
    key: "Kunci: Penguncian Timeline",
  },
  {
    num: "03",
    phase: "FASE TIGA",
    title: "Refine & Grading",
    desc: "Retouching level piksel di Affinity dan grading multi-node di DaVinci. Isolasi warna kulit, grain film sintetis, dan perataan mikro detail visual.",
    key: "Kunci: Pemutaran Terkalibrasi",
  },
  {
    num: "04",
    phase: "FASE EMPAT",
    title: "Master Deliver",
    desc: "Ekspor resolusi penuh ProRes 4444 XQ, master uncompressed TIFF/PNG, format aspek media sosial, serta validasi profil warna untuk proyeksi dan cetak.",
    key: "Kunci: Pengiriman Arsip Selesai",
  },
];

export default function ProsesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stepsRef = useRef(null);

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
        stepsRef.current.children,
        { opacity: 0, y: 50, x: -20 },
        {
          opacity: 1, y: 0, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: stepsRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proses"
      ref={sectionRef}
      className="w-full bg-[#f5f5f5] py-24 px-6 md:px-12 border-b border-[#e5e5e5]"
    >
      <div className="w-full">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#e5e5e5] max-w-7xl mx-auto"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#707072]">
              PROTOKOL EKSEKUSI
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#111111] mt-1">
              Empat Langkah Dari RAW Hingga Master
            </h2>
          </div>
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#707072]">
            TRANSPARANSI PENUH • KETEPATAN JADWAL
          </div>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="sharp-tile bg-[#ffffff] p-8 border border-[#e5e5e5] flex flex-col justify-between hover:border-[#111111] transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-bold text-[#111111]">
                    {step.num}
                  </span>
                  <span className="px-3 py-1 pill-btn bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-widest text-[#707072]">
                    {step.phase}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-[#111111]">
                  {step.title}
                </h3>
                <p className="text-[#707072] text-[13px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#e5e5e5] text-[11px] font-bold uppercase tracking-wider text-[#707072]">
                {step.key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
