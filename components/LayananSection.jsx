"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Foto & Retouching",
    desc: "Pasca-produksi kecantikan dan editorial. Tekstur kulit tetap hidup, luminansi seimbang, hasil siap cetak.",
    outputs: ["Frequency separation 16-bit", "Clean plate", "Proof CMYK / D65"],
    tool: "Affinity Photo 2",
  },
  {
    num: "02",
    title: "Video & Color Grading",
    desc: "Pacing, ritme narasi, dan grading ACES di DaVinci Resolve. Dari assembly sampai master akhir.",
    outputs: ["Narrative assembly", "Custom LUT & halation", "Multi-format export"],
    tool: "DaVinci Resolve",
  },
  {
    num: "03",
    title: "Key Art & Desain",
    desc: "Tipografi brand, key art poster, dan tata letak publikasi dengan grid vektor yang presisi.",
    outputs: ["Sistem tipografi", "Theatrical key art", "Press kit"],
    tool: "Affinity Designer",
  },
];

export default function LayananSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
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
        listRef.current?.children ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: listRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="layanan"
      ref={sectionRef}
      className="section-pad w-full bg-[#260212]"
    >
      <div className="container-page">
        <div
          ref={headerRef}
          className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end md:pb-12"
        >
          <div>
            <p className="eyebrow mb-4">Layanan — satu suite</p>
            <h2 className="display-xl text-[#e10600]">
              Tiga
              <br />
              <span className="text-[#ffc7c6]">Disiplin.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[340px] md:text-right">
            Editing, warna, dan tipografi dikerjakan di satu meja — tanpa
            estafet antar vendor.
          </p>
        </div>

        <div ref={listRef} className="space-y-2.5">
          {services.map((service) => (
            <article
              key={service.num}
              className="group grid gap-5 rounded-xl border border-black bg-[#4f0423] p-5 transition-colors duration-200 hover:border-[#e10600] md:grid-cols-[132px_1fr_auto] md:items-start md:gap-8 md:p-7"
            >
              <div className="flex items-start justify-between gap-4 md:block">
                <span className="font-display text-[44px] leading-[0.8] tracking-[0.02em] text-[#e10600] md:text-[64px]">
                  {service.num}
                </span>
                <span className="label whitespace-nowrap border border-[#ffc7c6]/25 px-2 py-1.5 !text-[9px] !tracking-[0.08em] text-[#ffc7c6] md:mt-4 md:inline-block">
                  {service.tool}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="font-display text-[30px] leading-[0.92] tracking-[0.015em] text-white md:text-[38px]">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-[560px] text-[13px] leading-relaxed text-[#ffc7c6]/80">
                  {service.desc}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {service.outputs.map((output) => (
                    <li
                      key={output}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-[#ffc7c6]/60"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 bg-[#e10600]"
                      />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#kontak"
                aria-label={`Diskusikan layanan ${service.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#ffc7c6]/25 text-[#ffc7c6] transition-colors duration-200 hover:border-[#e10600] hover:bg-[#e10600] hover:text-white md:justify-self-end"
              >
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
