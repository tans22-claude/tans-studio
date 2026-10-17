"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WipeInspector() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const wipeLayerRef = useRef(null);
  const wipeBarRef = useRef(null);
  const isDragging = useRef(false);

  const updateWipe = useCallback((clientX) => {
    if (!stageRef.current || !wipeLayerRef.current || !wipeBarRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    let posX = clientX - rect.left;
    posX = Math.max(0, Math.min(posX, rect.width));
    const pct = (posX / rect.width) * 100;
    wipeLayerRef.current.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
    wipeBarRef.current.style.left = `${pct}%`;
  }, []);

  useEffect(() => {
    // Scroll entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    // Mouse events
    const stage = stageRef.current;

    const onMouseDown = (e) => {
      isDragging.current = true;
      updateWipe(e.clientX);
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      updateWipe(e.clientX);
    };
    const onMouseUp = () => { isDragging.current = false; };

    const onTouchStart = (e) => {
      isDragging.current = true;
      updateWipe(e.touches[0].clientX);
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      updateWipe(e.touches[0].clientX);
    };
    const onTouchEnd = () => { isDragging.current = false; };

    stage.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      ctx.revert();
      stage.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      stage.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [updateWipe]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#111111] text-[#ffffff] py-24 px-6 md:px-12 border-b border-[#e5e5e5]"
    >
      <div className="w-full">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#262626] max-w-7xl mx-auto"
        >
          <div>
            <div className="inline-block px-3 py-1 pill-btn bg-[#222222] text-[11px] font-bold uppercase tracking-widest text-[#9e9ea0] mb-2">
              LAB INSPEKSI LIVE
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#ffffff]">
              Inspeksi Gradasi Interaktif
            </h3>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#9e9ea0]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#707072]" />
              MONOCHROME GRADE
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffffff]" />
              COLOR GRADED
            </span>
          </div>
        </div>

        {/* Wipe Stage */}
        <div
          ref={stageRef}
          className="relative w-full aspect-video md:aspect-[21/9] sharp-tile overflow-hidden select-none cursor-ew-resize border border-[#333333] bg-black max-w-7xl mx-auto"
        >
          {/* Base video: Graded color (kanan) */}
          <video
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src="/videos/vidio/1017.mp4"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Overlay video: Grayscale (kiri, clipped) */}
          <div
            ref={wipeLayerRef}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-110"
              src="/videos/vidio/1017.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute top-4 left-4 px-3 py-1 pill-btn bg-black/80 text-[#ffffff] text-[10px] font-bold uppercase tracking-widest border border-[#707072]">
              RAW: MONOCHROME GRADE
            </div>
          </div>

          {/* Graded label */}
          <div className="absolute top-4 right-4 px-3 py-1 pill-btn bg-[#ffffff] text-[#111111] text-[10px] font-bold uppercase tracking-widest">
            MASTER: COLOR GRADED
          </div>

          {/* Divider handle */}
          <div
            ref={wipeBarRef}
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#ffffff] pointer-events-none flex items-center justify-center"
          >
            <div className="w-9 h-9 rounded-full bg-[#ffffff] text-[#111111] flex items-center justify-center shadow-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#111111]"
              >
                <path
                  d="M5 8H1M15 8h-4M5 5l-3 3 3 3M11 5l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-[11px] font-bold uppercase tracking-widest text-[#9e9ea0] max-w-7xl mx-auto">
          Geser kursor horizontal untuk membandingkan fidelitas piksel &amp; kalibrasi bayangan
        </div>
      </div>
    </section>
  );
}
