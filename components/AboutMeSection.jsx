"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import LetterReveal from "@/components/ui/letter-reveal";
import RotatingBadge from "@/components/ui/rotating-badge";
import { FEATURED_POSTERS } from "@/lib/posters";

gsap.registerPlugin(ScrollTrigger);

const facts = [
  ["Based in", "Yogyakarta, ID"],
  ["Focus", "Color / Retouch / Key art"],
  ["Availability", "Open for 2026"],
];

const swatches = ["bg-powder", "bg-mint", "bg-candy", "bg-signal"];
const portraitPills = [
  FEATURED_POSTERS[3],
  FEATURED_POSTERS[5],
  FEATURED_POSTERS[0],
].filter(Boolean);

export default function AboutMeSection() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const portraitRef = useRef(null);
  const factsRef = useRef(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !frameRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top 84%",
          },
        }
      );

      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { scale: 1.18 },
          {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top 84%",
            },
          }
        );

        gsap.fromTo(
          portraitRef.current,
          { yPercent: 7 },
          {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      const pills = gsap.utils.toArray("[data-portrait-pill]", sectionRef.current);
      if (pills.length > 0) {
        gsap.fromTo(
          pills,
          { scale: 0.6, y: 12, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "back.out(1.7)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top 72%",
            },
          }
        );
      }

      const copy = gsap.utils.toArray("[data-about-copy]", sectionRef.current);
      if (copy.length > 0) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: copy[0],
              start: "top 88%",
            },
          }
        );
      }

      const factRows = gsap.utils.toArray("[data-fact-row]", sectionRef.current);
      if (factRows.length > 0) {
        gsap.fromTo(
          factRows,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: factsRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-pad relative overflow-hidden border-b border-ash bg-bone"
    >
      <div className="shell grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-ink" />
            <p className="eyebrow text-graphite">01 / Tentang</p>
          </div>

          <LetterReveal
            as="h2"
            className="display mt-6"
            lines={[
              { text: "Warna sebagai" },
              { text: "bahasa.", className: "text-graphite" },
            ]}
          />

          <p
            data-about-copy
            className="mt-8 max-w-[590px] text-[clamp(1.22rem,1.8vw,1.55rem)] leading-[1.45] tracking-[-0.03em] text-ink"
          >
            TANS Studio adalah praktik pasca-produksi independen. Setiap frame
            dieksekusi langsung oleh editor yang Anda ajak bicara.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <p data-about-copy className="body-copy max-w-[440px]">
              Fokus pada color grading, retouching, dan key art. Semua diproses
              di satu meja, dengan komunikasi yang dekat dan keputusan visual
              yang disengaja.
            </p>
            <p data-about-copy className="body-copy max-w-[440px]">
              Dari materi mentah sampai master akhir, warna dan tekstur dijaga
              tetap konsisten di setiap layar.
            </p>
          </div>

          <dl
            ref={factsRef}
            className="mt-10 grid gap-0 border-t border-ash sm:grid-cols-3"
          >
            {facts.map(([label, value]) => (
              <div
                key={label}
                data-fact-row
                className="border-b border-ash py-4 sm:border-b-0 sm:border-r sm:pr-5 sm:last:border-r-0"
              >
                <dt className="eyebrow text-graphite">{label}</dt>
                <dd className="mt-2 text-[16px] font-medium leading-snug text-ink">
                  {value}
                </dd>
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
            <div className="relative mb-8">
              <div
                ref={frameRef}
                className="relative aspect-[4/5] w-full overflow-hidden bg-powder"
              >
                {!photoFailed ? (
                  <div ref={portraitRef} className="absolute -inset-y-[10%] inset-x-0">
                    <Image
                      src="/bg/profile.jpeg"
                      alt="Potret tim TANS Studio"
                      fill
                      sizes="(max-width: 1024px) 100vw, 38vw"
                      onError={() => setPhotoFailed(true)}
                      className="object-cover"
                      style={{ objectPosition: "center 30%" }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="text-7xl font-light leading-none text-ink/20">
                      TS
                    </span>
                    <span className="eyebrow text-ink/40">Photo offline</span>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-6 left-4 flex items-end -space-x-4 sm:left-6 sm:-space-x-5">
                {portraitPills.map((poster, index) => (
                  <div
                    key={poster.id}
                    data-portrait-pill
                    className="relative h-16 w-16 overflow-hidden rounded-full border-[3px] border-bone bg-powder shadow-[0_8px_24px_rgba(0,0,0,0.16)] sm:h-20 sm:w-20"
                    style={{ zIndex: portraitPills.length - index }}
                  >
                    <Image
                      src={poster.src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <RotatingBadge className="absolute right-3 top-4 z-10 h-20 w-20 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:right-4 sm:top-5 sm:h-24 sm:w-24" />
            </div>

            <figcaption className="flex items-center justify-between gap-4 border-t border-ink/20 pt-3">
              <span className="eyebrow text-graphite">Di balik meja / 2026</span>
              <span className="flex gap-1.5" aria-hidden="true">
                {swatches.map((color) => (
                  <span key={color} className={`h-3 w-3 ${color}`} />
                ))}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
