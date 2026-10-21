"use client";

import { ArrowUp } from "lucide-react";

const navLinks = [
  { label: "Arsip Karya", href: "#karya" },
  { label: "Ruang Edit", href: "#workspace" },
  { label: "Layanan", href: "#layanan" },
  { label: "Proses", href: "#proses" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const toolkit = [
  "DaVinci Resolve Studio 19.1",
  "Affinity Suite V2",
  "CapCut Pro",
  "ACEScg 2.2",
];

export default function Footer() {
  const scrollToTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (event, href) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.1 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[#4f0423] bg-black">
      <div className="container-page">
        <div className="border-b border-white/15 pb-8 pt-12 md:pb-10 md:pt-16">
          <p className="label mb-5 text-[#ffc7c6]/45">
            Tans Studio — Post-production
          </p>
          <p
            aria-hidden="true"
            className="flex flex-wrap items-baseline gap-x-4 font-display text-[clamp(3.6rem,15vw,11rem)] leading-[0.73] tracking-[0.035em]"
          >
            <span className="text-[#e10600]">TANS</span>
            <span className="text-[#ffc7c6]">STUDIO</span>
          </p>
        </div>

        <div className="grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-[#ffc7c6]/45">Navigasi</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    className="text-[12px] text-white/70 transition-colors hover:text-[#ffc7c6]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="label text-[#ffc7c6]/45">Toolkit</p>
            <ul className="mt-4 space-y-2.5">
              {toolkit.map((tool) => (
                <li key={tool} className="text-[12px] text-white/60">
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="label text-[#ffc7c6]/45">Kanal</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:hello@tansstudio.com"
                  className="text-[12px] text-white/70 transition-colors hover:text-[#ffc7c6]"
                >
                  hello@tansstudio.com
                </a>
              </li>
              <li className="text-[12px] text-white/60">
                Instagram — @tans.studio
              </li>
              <li className="text-[12px] text-white/60">UTC+7 / Remote</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/15 py-5 sm:flex-row sm:items-center">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#ffc7c6]/40">
            © 2026 TANS STUDIO. Semua hak dilindungi.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="label flex items-center gap-2 text-[#ffc7c6]/60 transition-colors hover:text-white"
          >
            Kembali ke atas
            <ArrowUp size={12} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
