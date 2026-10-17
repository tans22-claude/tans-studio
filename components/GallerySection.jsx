"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PosterStack from "@/components/PosterStack";

gsap.registerPlugin(ScrollTrigger);

// 6 gambar lokal dari public/desaind/
const heroCards = [
  {
    src: "/desaind/perang.webp",
    alt: "Nocturne Chronicles",
    badge1: "16:9 Cinema",
    badge2: "DaVinci Resolve",
    category: "FITUR FILM // COLOR MASTER",
    title: "Nocturne Chronicles",
    desc: "Gradasi warna teatrikal dalam ruang warna ACES 1.3 dengan emulasi 35mm fotokimiawi dan kurva kontras bayangan presisi.",
  },
  {
    src: "/desaind/yeahboy.webp",
    alt: "Komorebi Short Film",
    badge1: "2.39:1 Scope",
    badge2: "CapCut • Resolve",
    category: "NARASI PENDEK // 4K EDITORIAL",
    title: "Komorebi Short Film",
    desc: "Perakitan ritme dinamis di CapCut Pro dipadukan dengan kurva kontras organik dan grain filmik pada DaVinci Resolve.",
  },
];

const productCards = [
  {
    src: "/desaind/putriasing.webp",
    alt: "Solitude Editorial",
    label: "Solitude Editorial",
  },
  {
    src: "/desaind/meee.webp",
    alt: "Vogue Dusk Series",
    label: "Vogue Dusk Series",
  },
  {
    src: "/desaind/uin.webp",
    alt: "Aura Swiss Identity",
    label: "Aura Swiss Identity",
  },
  {
    src: "/desaind/Frame 50.webp",
    alt: "Brutalism Sound Key Art",
    label: "Brutalism Sound Key Art",
  },
];

// Stacking section dengan accent colors (5 posters, urutan: putriasing → coffe → ...)
const carouselItems = [
  {
    id: "putriasing",
    title: "Putri Asing",
    image: "/desaind/putriasing.webp",
    label: "EDITORIAL PORTRAIT • AFFINITY PHOTO",
    accent: "#c8a882", // Warm beige dari tone kulit
  },
  {
    id: "coffe",
    title: "Coffee Noir",
    image: "/desaind/coffe.jpg",
    label: "COMMERCIAL EDITORIAL • PRODUCT STYLING",
    accent: "#6b4423", // Deep brown dari coffee tones
  },
  {
    id: "meee",
    title: "Vogue Dusk",
    image: "/desaind/meee.webp",
    label: "FASHION EDITORIAL • STUDIO LIGHT",
    accent: "#8a7d72", // Neutral brown dari background
  },
  {
    id: "frame50",
    title: "Frame Fifty",
    image: "/desaind/Frame 50.webp",
    label: "KEY ART • GRAPHIC DESIGN",
    accent: "#7a6b5d", // Deep neutral dari concrete
  },
  {
    id: "perang",
    title: "Perang Aesthetic",
    image: "/desaind/perang.webp",
    label: "CINEMATIC GRADING • COLOR MASTER",
    accent: "#94856f", // Warm taupe dari arsitektur
  },
];

export default function GallerySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const heroCardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-in
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
            toggleActions: "play none none none",
          },
        }
      );

      // Hero cards stagger
      gsap.fromTo(
        heroCardsRef.current.children,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: heroCardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="karya"
      ref={sectionRef}
      className="w-full bg-[#ffffff] py-24 px-6 md:px-12 border-b border-[#e5e5e5]"
    >
      <div className="w-full">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#e5e5e5] max-w-7xl mx-auto"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#707072]">
              ARSIP // PEKERJAAN PILIHAN
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#111111] mt-1">
              Artefak Pilihan
            </h2>
          </div>
          <div className="text-[12px] font-medium text-[#707072] tracking-wider uppercase">
            Galeri Pasca-Produksi • Edisi 2025
          </div>
        </div>

        {/* Hero Cards (2-up) */}
        <div ref={heroCardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-7xl mx-auto">
          {heroCards.map((card) => (
            <div
              key={card.title}
              className="relative aspect-[16/10] bg-[#111111] overflow-hidden sharp-tile group cursor-pointer"
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="px-3 py-1 pill-btn bg-[#111111] text-[#ffffff] text-[10px] font-bold uppercase tracking-widest">
                  {card.badge1}
                </span>
                <span className="px-3 py-1 pill-btn bg-[#ffffff] text-[#111111] text-[10px] font-bold uppercase tracking-widest">
                  {card.badge2}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 p-8 space-y-3 z-10">
                <div className="text-[#ffffff]/80 text-[13px] font-medium uppercase tracking-widest">
                  {card.category}
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#ffffff] leading-none">
                  {card.title}
                </h3>
                <p className="text-[#ffffff]/70 text-[14px] max-w-md line-clamp-2 leading-relaxed">
                  {card.desc}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button className="inline-flex items-center justify-center px-6 py-2.5 pill-btn bg-[#ffffff] text-[#111111] text-[12px] font-bold uppercase tracking-wider hover:bg-[#e5e5e5] transition-colors">
                    Tonton Video
                  </button>
                  <button className="inline-flex items-center justify-center px-6 py-2.5 pill-btn border border-[#ffffff] text-[#ffffff] text-[12px] font-bold uppercase tracking-wider hover:bg-[#ffffff] hover:text-[#111111] transition-colors">
                    Detail Proyek
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-header for carousel */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#e5e5e5] max-w-7xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
            KOLEKSI RETOUCHING &amp; DESAIN GRAFIS
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#707072]">
            5 ARTEFAK TERPILIH
          </span>
        </div>

        {/* Stacking posters (semua poster di-preload dulu, baru menumpuk saat scroll) */}
        <PosterStack items={carouselItems} />
      </div>
    </section>
  );
}
