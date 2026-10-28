"use client";

import { ArrowUp } from "lucide-react";

const navLinks = [
  { label: "Personal Project", href: "#karya" },
  { label: "Video Projects", href: "#video" },
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

const swatches = ["bg-powder", "bg-mint", "bg-candy", "bg-signal", "bg-navy"];

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
    <footer className="w-full border-t border-ash bg-bone">
      <div className="shell">
        <div className="flex flex-col gap-8 border-b border-ash pb-8 pt-12 md:flex-row md:items-end md:justify-between md:pb-10 md:pt-16">
          <div>
            <p className="eyebrow text-graphite">
              Tans Studio â€” Post-production
            </p>
            <p
              aria-hidden="true"
              className="mt-5 flex flex-wrap items-baseline gap-x-3 text-[clamp(3.6rem,14vw,11rem)] font-light leading-[0.72] tracking-[-0.05em]"
            >
              <span>TANS</span>
              <span className="text-graphite">STUDIO</span>
              <span className="text-magenta">.</span>
            </p>
          </div>
          <a href="#kontak" className="pill w-fit gap-2">
            Mulai proyek
            <span aria-hidden="true">â†—</span>
          </a>
        </div>

        <div className="grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-graphite">Navigasi</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    className="text-[14px] text-ink/70 transition-colors hover:text-magenta"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow text-graphite">Toolkit</p>
            <ul className="mt-4 space-y-2.5">
              {toolkit.map((tool) => (
                <li key={tool} className="text-[14px] text-ink/60">
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow text-graphite">Kanal</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:sultan242600@gmail.com"
                  className="text-[14px] text-ink/70 transition-colors hover:text-magenta"
                >
                  sultan242600@gmail.com
                </a>
              </li>
              <li className="text-[14px] text-ink/60">
                Instagram â€” @tans.studio
              </li>
              <li className="text-[14px] text-ink/60">UTC+7 / Remote</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-ash py-5 sm:flex-row sm:items-center">
          <p className="text-[11px] uppercase tracking-[0.12em] text-graphite">
            Â© 2026 TANS STUDIO. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-5">
            <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
              {swatches.map((color) => (
                <span key={color} className={`h-2.5 w-2.5 ${color}`} />
              ))}
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="eyebrow flex items-center gap-2 text-graphite transition-colors hover:text-ink"
            >
              Kembali ke atas
              <ArrowUp size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

