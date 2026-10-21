"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";

const TICKER_ITEMS = [
  "Color Grade",
  "Editorial Retouch",
  "Key Art",
  "Motion Finish",
  "ACES Pipeline",
];

const HERO_MASKS = [
  {
    src: "/desaind/perang.webp",
    className:
      "mask-cut-a left-[2.5vw] top-[19%] hidden w-[clamp(110px,13vw,190px)] xl:block",
    rotate: "-7deg",
    position: "center 42%",
  },
  {
    src: "/desaind/putriasing.webp",
    className:
      "mask-cut-b right-[3vw] top-[16%] hidden w-[clamp(105px,12vw,175px)] xl:block",
    rotate: "6deg",
    position: "center 30%",
  },
  {
    src: "/desaind/coffe.jpg",
    className:
      "mask-cut-c bottom-[16%] left-[6vw] hidden w-[clamp(95px,10vw,150px)] xl:block",
    rotate: "4deg",
    position: "center 48%",
  },
  {
    src: "/desaind/Frame 50.webp",
    className:
      "mask-cut-b bottom-[20%] right-[5vw] hidden w-[clamp(90px,9vw,140px)] xl:block",
    rotate: "-5deg",
    position: "center 40%",
  },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 38 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.2,
        }
      );
      gsap.fromTo(
        "[data-hero-mask]",
        { opacity: 0, scale: 0.96, y: 18 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.35,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#260212] pt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {HERO_MASKS.map((mask) => (
          <div
            key={mask.src}
            data-hero-mask
            className={`absolute aspect-[4/5] overflow-hidden ${mask.className}`}
            style={{ transform: `rotate(${mask.rotate})` }}
          >
            <Image
              src={mask.src}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
              style={{ objectPosition: mask.position }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-1 items-center">
        <div
          ref={contentRef}
          className="mx-auto w-full max-w-[1180px] px-5 py-16 text-center md:px-8 md:py-20"
        >
          <p className="eyebrow mb-6 md:mb-8">
            Studio pasca-produksi — UTC+7
          </p>

          <h1 className="display-hero text-[#e10600]">
            <span className="block">Setiap Bingkai.</span>
            <span className="block text-[#ffc7c6]">(Setiap Warna.)</span>
          </h1>

          <p className="body-copy mx-auto mt-7 max-w-[460px] md:mt-9">
            Color grading, retouching editorial, dan key art untuk film,
            fashion, serta brand yang peduli pada detail.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#karya" className="btn-primary w-full sm:w-auto">
              Lihat Arsip
            </a>
            <a href="#kontak" className="btn-ghost w-full sm:w-auto">
              Mulai Proyek
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-7 md:px-8">
        <div className="flex items-center justify-between border-t border-black/80 pt-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 bg-[#e10600]"
            />
            <span className="label text-[#ffc7c6]">
              Tersedia untuk proyek 2026
            </span>
          </div>
          <a
            href="#karya"
            className="label hidden items-center gap-2 text-white/55 transition-colors hover:text-white sm:flex"
          >
            Gulir
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="ticker relative z-10">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="ticker-group"
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {TICKER_ITEMS.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center gap-10">
                  {item}
                  <span aria-hidden="true">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
