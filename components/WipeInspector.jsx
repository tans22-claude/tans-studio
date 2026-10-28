"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import LetterReveal from "@/components/ui/letter-reveal";

gsap.registerPlugin(ScrollTrigger);

const clamp = (value) => Math.min(98, Math.max(2, value));

export default function WipeInspector() {
  const sectionRef = useRef(null);
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
    if (reduce || !stageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: stageRef.current, start: "top 86%" },
        }
      );
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
      className="section-pad relative w-full overflow-hidden border-y border-ash bg-bone"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-graphite">
              Color pipeline — split view
            </p>
            <LetterReveal
              as="h2"
              className="display mt-5"
              lines={[
                { text: "Lihat" },
                { text: "bedanya.", className: "text-graphite" },
              ]}
            />
          </div>
          <p className="body-copy max-w-[380px] md:pb-2 md:text-right">
            Log mentah di satu sisi, hasil grading ACES di sisi lain. Geser
            garis untuk membandingkan.
          </p>
        </div>
      </div>

      <div className="shell mt-12">
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
          className={`relative aspect-[4/5] w-full touch-none select-none overflow-hidden bg-navy sm:aspect-[16/10] md:aspect-[21/9] ${
            dragging ? "cursor-grabbing" : "cursor-ew-resize"
          }`}
        >
          {failed ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-charcoal">
              <span className="text-7xl font-light leading-none text-bone/20">
                01
              </span>
              <span className="eyebrow text-bone/50">Media offline</span>
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

          <span className="tag absolute left-3 top-3 border-0 bg-bone text-ink">
            Log / Mono
          </span>
          <span className="tag tag--accent absolute right-3 top-3">
            Grade / ACES
          </span>

          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-magenta"
            style={{ left: `${position}%` }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink bg-bone text-ink">
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

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-bone/15 bg-navy/85 px-3 py-2.5">
            <span className="eyebrow text-bone/60">
              Tarik garis untuk membandingkan
            </span>
            <span className="eyebrow tabular-nums text-bone/45">
              {String(Math.round(position)).padStart(2, "0")} —{" "}
              {String(100 - Math.round(position)).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="eyebrow text-graphite">
            DaVinci Resolve Studio — ACES 1.3
          </span>
          <span className="eyebrow text-graphite">Tarik / ← → / Home / End</span>
        </div>
      </div>
    </section>
  );
}
