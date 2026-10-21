"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const clamp = (value) => Math.min(98, Math.max(2, value));

export default function WipeInspector() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduce = useReducedMotion();

  const updateFromClientX = useCallback((clientX) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  useEffect(() => {
    if (reduce || !headerRef.current || !stageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 86%" },
        }
      );
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: stageRef.current, start: "top 84%" },
        }
      );

      // Parallax: video stage rises faster than header text
      gsap.to(stageRef.current, {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(headerRef.current, {
        y: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (draggingRef.current) updateFromClientX(event.clientX);
    };
    const stop = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setDragging(false);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [updateFromClientX]);

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((value) => clamp(value - step));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((value) => clamp(value + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(2);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(98);
    }
  };

  return (
    <section
      id="wipe"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-black bg-[#1a0208] py-20 md:py-28"
    >
      <div ref={headerRef} className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Color pipeline — split view</p>
            <h2 className="display-xl text-[#e10600]">
              Lihat
              <br />
              <span className="text-[#ffc7c6]">Bedanya.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[340px] md:text-right">
            Log mentah di satu sisi, hasil grading ACES di sisi lain. Geser
            garis untuk membandingkan.
          </p>
        </div>
      </div>

      <div className="container-page mt-9">
        <div
          ref={stageRef}
          role="slider"
          tabIndex={0}
          aria-label="Perbandingan sebelum dan sesudah color grading"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)} persen log, ${
            100 - Math.round(position)
          } persen graded`}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            event.preventDefault();
            draggingRef.current = true;
            setDragging(true);
            updateFromClientX(event.clientX);
          }}
          onKeyDown={handleKeyDown}
          className={`relative aspect-[4/5] w-full touch-none select-none overflow-hidden rounded-xl border border-black bg-[#4f0423] sm:aspect-[16/10] md:aspect-[21/9] ${
            dragging ? "cursor-grabbing" : "cursor-ew-resize"
          }`}
        >
          {failed ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="font-display text-7xl leading-none text-[#e10600]/40">
                01
              </span>
              <span className="label text-[#ffc7c6]/60">Media offline</span>
            </div>
          ) : (
            <>
              <video
                src="/videos/vidio/1017.mp4"
                autoPlay
                loop
                muted
                playsInline
                onError={() => setFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                <video
                  src="/videos/vidio/1017.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
                />
              </div>
            </>
          )}

          <span className="label absolute left-3 top-3 bg-black px-2.5 py-2 text-[#ffc7c6]">
            Log / Mono
          </span>
          <span className="label absolute right-3 top-3 bg-[#e10600] px-2.5 py-2 text-white">
            Grade / ACES
          </span>

          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[#e10600]"
            style={{ left: `${position}%` }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] border border-black bg-[#e10600] text-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 8H1M15 8h-4M5 5l-3 3 3 3M11 5l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-black bg-black/85 px-3 py-2.5">
            <span className="label text-[#ffc7c6]/70">
              Tarik garis untuk membandingkan
            </span>
            <span className="label tabular-nums text-white/45">
              {String(Math.round(position)).padStart(2, "0")} —{" "}
              {String(100 - Math.round(position)).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="label text-[#ffc7c6]/45">
            DaVinci Resolve Studio — ACES 1.3
          </span>
          <span className="label text-[#ffc7c6]/45">
            Tarik / ← → / Home / End
          </span>
        </div>
      </div>
    </section>
  );
}
