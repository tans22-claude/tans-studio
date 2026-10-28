"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import LetterReveal from "@/components/ui/letter-reveal";
import { FEATURED_POSTERS } from "@/lib/posters";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX = [-6, -14, -4, -10, -16, -8];

export default function PersonalProjectSection() {
  const sectionRef = useRef(null);
  const collageRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const collage = collageRef.current;
    if (!collage || reduce) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const figures = gsap.utils.toArray("[data-poster-col]", collage);

      figures.forEach((figure) => {
        const frame = figure.querySelector("[data-poster-frame]");
        const image = figure.querySelector("[data-poster-image]");
        if (!frame || !image) return;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: figure,
              start: "top 88%",
              once: true,
            },
          })
          .fromTo(
            frame,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.05,
              ease: "power3.inOut",
            }
          )
          .fromTo(
            image,
            { scale: 1.1 },
            { scale: 1, duration: 1.2, ease: "power3.out" },
            0
          );
      });
    });

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const columns = gsap.utils.toArray("[data-poster-col]", collage);

        columns.forEach((column, index) => {
          gsap.fromTo(
            column,
            { yPercent: 0 },
            {
              yPercent: PARALLAX[index] ?? -8,
              ease: "none",
              scrollTrigger: {
                trigger: collage,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }
    );

    return () => mm.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="karya"
      aria-labelledby="karya-title"
      className="section-pad relative overflow-hidden bg-bone"
    >
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-graphite">Arsip personal / 2024—2026</p>
            <LetterReveal
              as="h2"
              id="karya-title"
              className="display mt-5"
              lines={[{ text: "My Personal" }, { text: "Project." }]}
            />
          </div>
          <p className="body-copy max-w-[380px] md:pb-2 md:text-right">
            Enam poster pilihan dari arsip key art, editorial, dan eksperimen
            visual. Dikerjakan dengan rasa ingin tahu yang sama seperti proyek
            film.
          </p>
        </div>
      </div>

      <div className="shell mt-14 md:mt-20">
        <div ref={collageRef} className="poster-collage">
          {FEATURED_POSTERS.map((poster, index) => (
            <figure
              key={poster.id}
              data-poster-col
              className="poster-col"
              style={{ "--poster-index": index }}
            >
              <div data-poster-frame className="poster-frame">
                <div
                  data-poster-image
                  className="absolute inset-0 overflow-hidden"
                >
                  <Image
                    src={poster.src}
                    alt={poster.alt}
                    fill
                    sizes="(max-width: 767px) 46vw, 16vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="poster-caption">
                <span className="text-ink">{poster.title}</span>
                <span className="text-right text-graphite">
                  {poster.kicker} / {poster.year}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="shell mt-20 md:mt-28">
        <div className="section-line flex flex-col gap-8 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-graphite">Selanjutnya</p>
            <LetterReveal
              as="p"
              className="heading mt-4"
              lines={[{ text: "Let’s make" }, { text: "things happen." }]}
            />
          </div>
          <a href="#kontak" className="pill w-fit gap-3 px-6">
            Mulai proyek
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
