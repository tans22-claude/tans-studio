"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const toolkit = [
  "DaVinci Resolve Studio 19.1",
  "CapCut Pro Production",
  "Affinity Photo & Designer 2",
  "Ruang Warna ACEScg 2.2",
];

const navLinks = [
  { label: "Arsip Karya", href: "#karya" },
  { label: "Layanan Suite", href: "#layanan" },
  { label: "Proses Kreatif", href: "#proses" },
  { label: "Tentang Kami", href: "#tentang" },
];

const channels = [
  { label: "Vimeo On Demand", href: "#" },
  { label: "Instagram Reel Portfolio", href: "#" },
  { label: "Behance Selected Works", href: "#" },
  { label: "Arsip LUT & Preset Teatrikal", href: "#" },
];

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#ffffff] text-[#111111] border-t border-[#e5e5e5]"
    >
      <div className="w-full px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8 mb-16 pb-12 border-b border-[#e5e5e5] max-w-7xl mx-auto">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-4">
            <div className="font-display text-2xl font-bold uppercase tracking-tight text-[#111111]">
              TANS STUDIO
            </div>
            <p className="text-[#707072] text-[13px] leading-relaxed max-w-sm">
              Suite pasca-produksi berpresisi tinggi untuk sinematografer,
              fotografer editorial, dan kreator independen dengan standar
              kalibrasi ACES internasional.
            </p>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#707072] pt-2">
              STATUS SUITE: MONITOR D65 1000 NITS
            </div>
          </div>

          {/* Toolkit */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              Toolkit Studio
            </div>
            <ul className="space-y-2 text-[12px] font-medium text-[#707072]">
              {toolkit.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Navigasi */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              Navigasi
            </div>
            <ul className="space-y-2 text-[12px] font-medium text-[#707072]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-[#111111] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              Kanal Komunikasi
            </div>
            <ul className="space-y-2 text-[12px] font-medium text-[#707072]">
              {channels.map((ch) => (
                <li key={ch.label}>
                  <a href={ch.href} className="hover:text-[#111111] transition-colors">
                    {ch.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-wider text-[#707072] max-w-7xl mx-auto">
          <div>© 2025 TANS STUDIO INC. HAK CIPTA DILINDUNGI.</div>
          <div className="flex items-center gap-6 flex-wrap">
            <a href="#" className="hover:text-[#111111] transition-colors">
              Kebijakan &amp; Ketentuan
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#111111] transition-colors">
              Lembar Spek Kalibrasi
            </a>
            <span>•</span>
            <span className="text-[#111111]">REF: TANS-NIKE-MONO-2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
