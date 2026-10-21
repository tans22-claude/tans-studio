"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Deepening wine → black journey
const SECTION_BG = [
  { selector: "#about", color: "#1f0210" },
  { selector: "#karya", color: "#260212" },
  { selector: "#workspace", color: "#1a0208" },
  { selector: "#wipe", color: "#12010a" },
  { selector: "#layanan", color: "#0d0107" },
  { selector: "#proses", color: "#090105" },
  { selector: "#tentang", color: "#050103" },
  { selector: "#kontak", color: "#000000" },
];

export default function SectionTransition() {
  const mainRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const main = document.querySelector("main");
    if (!main) return;

    const ctx = gsap.context(() => {
      SECTION_BG.forEach((section, i) => {
        const el = document.querySelector(section.selector);
        if (!el) return;

        gsap.to(main, {
          backgroundColor: section.color,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "top 20%",
            scrub: 1.5,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [reduce]);

  return null;
}
