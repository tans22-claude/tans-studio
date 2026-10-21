"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/ui/infinite-drag-scroll";

gsap.registerPlugin(ScrollTrigger);

// TODO: Replace with your exported poster images in /public/posters/
const posters = [
  {
    id: 1,
    src: "/desaind/perang.webp",
    alt: "Nocturne Chronicles poster",
  },
  {
    id: 2,
    src: "/desaind/putriasing.webp",
    alt: "Putri Asing poster",
  },
  {
    id: 3,
    src: "/desaind/meee.webp",
    alt: "Vogue Dusk poster",
  },
  {
    id: 4,
    src: "/desaind/Frame 50.webp",
    alt: "Frame Fifty poster",
  },
  {
    id: 5,
    src: "/desaind/coffe.jpg",
    alt: "Coffee Noir poster",
  },
  {
    id: 6,
    src: "/desaind/perang.webp",
    alt: "Nocturne alt poster",
  },
  {
    id: 7,
    src: "/desaind/putriasing.webp",
    alt: "Putri Asing alt poster",
  },
  {
    id: 8,
    src: "/desaind/meee.webp",
    alt: "Vogue Dusk alt poster",
  },
  {
    id: 9,
    src: "/desaind/Frame 50.webp",
    alt: "Frame Fifty alt poster",
  },
  {
    id: 10,
    src: "/desaind/coffe.jpg",
    alt: "Coffee Noir alt poster",
  },
  {
    id: 11,
    src: "/desaind/perang.webp",
    alt: "Nocturne third poster",
  },
  {
    id: 12,
    src: "/desaind/putriasing.webp",
    alt: "Putri Asing third poster",
  },
];

export default function PosterSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 86%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="poster"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-black bg-[#1a0208]"
    >
      {/* Header */}
      <div ref={headerRef} className="container-page pt-20 md:pt-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Poster archive — drag to explore</p>
            <h2 className="display-xl text-[#e10600]">
              Galeri
              <br />
              <span className="text-[#ffc7c6]">Poster.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[340px] md:text-right">
            Geser, seret, dan jelajahi kumpulan poster. Drag ke segala arah
            untuk berpindah.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className="label text-[#ffc7c6]/45">
            Drag / Scroll / Explore
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-[#ffc7c6]/15" />
          <span className="label text-[#ffc7c6]/45">
            {posters.length} poster
          </span>
        </div>
      </div>

      {/* Draggable poster grid */}
      <div className="mt-8 select-none" aria-hidden="false">
        <DraggableContainer variant="masonry" className="!bg-transparent">
          <GridBody>
            {posters.map((poster) => (
              <GridItem
                key={poster.id}
                className="relative h-54 w-36 md:h-96 md:w-64"
              >
                <img
                  src={poster.src}
                  alt={poster.alt}
                  className="pointer-events-none absolute h-full w-full object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 border border-black/60" />
              </GridItem>
            ))}
          </GridBody>
        </DraggableContainer>
      </div>

      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#1a0208] to-transparent"
      />
    </section>
  );
}
