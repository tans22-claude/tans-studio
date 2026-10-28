"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const facts = [
  ["Based in", "Yogyakarta, ID"],
  ["Focus", "Color / Retouch / Key art"],
  ["Availability", "Open for 2026"],
];

const swatches = ["bg-powder", "bg-mint", "bg-candy", "bg-signal"];

export default function AboutMeSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-pad relative overflow-hidden border-b border-ash bg-bone"
    >
      <div
        ref={contentRef}
        className="shell grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8"
      >
        <div className="lg:col-span-7">
          <p className="eyebrow text-graphite">Tentang — di balik frame</p>
          <h2 className="display mt-5 text-balance">
            Warna sebagai
            <br />
            <span className="text-graphite">bahasa.</span>
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <p className="body-copy max-w-[440px]">
              TANS Studio adalah praktik pasca-produksi independen. Pekerjaan
              dikerjakan langsung oleh editor yang mengeksekusi setiap frame —
              bukan diteruskan ke lapisan agensi.
            </p>
            <p className="body-copy max-w-[440px]">
              Fokus pada color grading, retouching, dan key art. Semua diproses
              di satu meja, dengan komunikasi yang dekat dan keputusan visual
              yang disengaja.
            </p>
          </div>

          <dl className="mt-10 grid gap-0 border-t border-ash sm:grid-cols-3">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-ash py-4 sm:border-b-0 sm:border-r sm:pr-5 sm:last:border-r-0"
              >
                <dt className="eyebrow text-graphite">{label}</dt>
                <dd className="mt-2 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5 lg:pl-10">
          <div
            aria-hidden="true"
            className="absolute -left-1 top-5 hidden h-full w-full bg-powder lg:block"
          />
          <figure className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-powder">
              {!photoFailed ? (
                <Image
                  src="/bg/profile.jpeg"
                  alt="Potret tim TANS Studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  onError={() => setPhotoFailed(true)}
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="text-7xl font-light leading-none text-ink/20">
                    TS
                  </span>
                  <span className="eyebrow text-ink/40">Photo offline</span>
                </div>
              )}
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 border-t border-ink/20 pt-3">
              <span className="eyebrow text-graphite">Di balik meja</span>
              <span className="flex gap-1.5" aria-hidden="true">
                {swatches.map((color) => (
                  <span
                    key={color}
                    className={`h-3 w-3 ${color}`}
                  />
                ))}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
