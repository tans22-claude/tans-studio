"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMeSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [bgFailed, setBgFailed] = useState(false);
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

      // Parallax: bg drifts slower than content
      gsap.to("[data-about-bg]", {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // Photo drifts up slightly faster
      gsap.to("[data-about-photo]", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-black"
    >
      {/* Cyberpunk bg — dimmed so text stays readable */}
      <div className="absolute inset-0 z-0">
        {!bgFailed ? (
          <Image
            src="/bg/Perenungan di Kota Neon Bergaya Van Gogh.png"
            alt=""
            fill
            sizes="100vw"
            onError={() => setBgFailed(true)}
            data-about-bg
            className="object-cover opacity-30"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a0208]" />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#260212]/90 via-[#260212]/70 to-[#260212]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#260212] via-transparent to-[#260212]/60" />
      </div>

      <div className="container-page relative z-10 py-24 md:py-32">
        <div
          ref={contentRef}
          className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
        >
          {/* Left: text */}
          <div>
            <p className="eyebrow mb-5">Behind the visuals</p>
            <h2 className="display-lg text-[#e10600]">
              Crafting
              <br />
              Visuals.
              <br />
              <span className="text-[#ffc7c6]">Shaping Emotions.</span>
            </h2>

            <div className="mt-7 max-w-[480px] space-y-4">
              <p className="body-copy">
                I'm a visual creative with a growing passion for color grading
                and graphic design. I explore how color, contrast, composition,
                and typography can transform an ordinary image into something
                that tells a story.
              </p>
              <p className="text-[14px] leading-relaxed text-[#ffc7c6]/75">
                For me, visual design is more than aesthetics. It's about
                creating a mood, communicating an idea, and making every visual
                element feel intentional.
              </p>
              <p className="text-[14px] leading-relaxed text-[#ffc7c6]/55">
                I'm constantly experimenting, learning, and refining my
                approach — one visual at a time.
              </p>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-[#e10600]" />
              <a
                href="https://coloracci.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="label text-[#ffc7c6] transition-colors hover:text-[#e10600]"
              >
                coloracci.ai
              </a>
            </div>
          </div>

          {/* Right: photo */}
          <div
            data-about-photo
            className="relative mx-auto w-full max-w-[380px] lg:max-w-[420px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-black bg-[#4f0423]">
              {!photoFailed ? (
                <Image
                  src="/desaind/meee.webp"
                  alt="Portrait"
                  fill
                  sizes="(max-width: 1024px) 80vw, 420px"
                  onError={() => setPhotoFailed(true)}
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="font-display text-7xl leading-none text-[#e10600]/40">
                    TS
                  </span>
                  <span className="label text-[#ffc7c6]/50">Photo offline</span>
                </div>
              )}
            </div>

            {/* Floating label */}
            <div className="absolute -bottom-3 -left-3 rounded-[8px] border border-black bg-[#e10600] px-4 py-2.5">
              <span className="label text-white">Visual Creative</span>
            </div>
            <div className="absolute -top-3 -right-3 rounded-[8px] border border-black bg-black px-4 py-2.5">
              <span className="label text-[#ffc7c6]">UTC+7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
