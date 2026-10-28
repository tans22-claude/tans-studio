"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import LetterReveal from "@/components/ui/letter-reveal";

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
  const listRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
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
      className="section-pad w-full bg-bone"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 border-b border-ash pb-10 md:flex-row md:items-end md:pb-12">
          <div>
            <p className="eyebrow text-graphite">Layanan — satu suite</p>
            <LetterReveal
              as="h2"
              className="display mt-5"
              lines={[
                { text: "Tiga" },
                { text: "disiplin.", className: "text-graphite" },
              ]}
            />
          </div>
          <p className="body-copy max-w-[380px] md:pb-2 md:text-right">
            Editing, warna, dan tipografi dikerjakan di satu meja — tanpa
            estafet antar vendor.
          </p>
        </div>

        <div ref={listRef}>
          {services.map((service) => (
            <article
              key={service.num}
              className="group grid gap-5 border-b border-ash py-8 transition-colors duration-300 hover:bg-powder/25 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <div className="flex items-start justify-between gap-4 md:col-span-1 md:block">
                <span className="eyebrow text-graphite">{service.num}</span>
                <span className="tag md:hidden">{service.tool}</span>
              </div>

              <div className="md:col-span-4">
                <h3 className="heading-sm max-w-[300px] text-balance">
                  {service.title}
                </h3>
                <span className="mt-4 hidden md:block">
                  <span className="tag">{service.tool}</span>
                </span>
              </div>

              <div className="md:col-span-4">
                <p className="body-copy max-w-[440px]">{service.desc}</p>
              </div>

              <div className="flex flex-col gap-6 md:col-span-3">
                <ul className="space-y-1.5">
                  {service.outputs.map((output) => (
                    <li
                      key={output}
                      className="flex items-start gap-2 text-[13px] uppercase leading-relaxed tracking-[0.06em] text-graphite"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] h-1 w-1 shrink-0 bg-magenta"
                      />
                      {output}
                    </li>
                  ))}
                </ul>

                <a
                  href="#kontak"
                  aria-label={`Diskusikan layanan ${service.title}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ash text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-bone md:mt-auto md:self-end"
                >
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
