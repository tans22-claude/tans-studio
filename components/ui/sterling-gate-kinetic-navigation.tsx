"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Karya", href: "#karya" },
  { label: "Ruang Edit", href: "#workspace" },
  { label: "Layanan", href: "#layanan" },
  { label: "Proses", href: "#proses" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

export function Component() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#karya");
  const navRef = useRef(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector<HTMLElement>(link.href)
    ).filter((section): section is HTMLElement => Boolean(section));

    const onScroll = () => {
      const marker = window.scrollY + 140;
      let current = "";
      sections.forEach((section) => {
        if (section.offsetTop <= marker) current = `#${section.id}`;
      });
      if (current) setActiveHref(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleNavClick = (event, href) => {
    event.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    window.setTimeout(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 40);
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Navigasi utama"
        className="fixed inset-x-0 top-0 z-50 bg-black"
      >
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-display text-[17px] leading-none tracking-[0.08em] text-[#e10600]"
            aria-label="TANS Studio, kembali ke atas"
          >
            TANS<span className="text-[#ffc7c6]">®</span>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative py-2 font-display text-[11px] font-medium uppercase leading-none tracking-[0.16em] transition-colors duration-200 ${
                    isActive
                      ? "text-[#ffc7c6]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px bg-[#e10600] transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <a
            href="#kontak"
            onClick={(event) => handleNavClick(event, "#kontak")}
            className="btn-primary hidden !min-h-8 !px-3.5 !py-2 !text-[11px] md:inline-flex"
          >
            Mulai Proyek
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition-colors hover:border-[#e10600] hover:text-[#ffc7c6] md:hidden"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5h14M2 9h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col bg-[#260212] px-5 pb-8 pt-20 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="flex flex-1 flex-col justify-center">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="flex items-baseline gap-4 border-b border-black/60 py-3 font-display text-[38px] leading-none tracking-[0.02em] text-white transition-colors hover:text-[#e10600]"
              >
                <span className="label w-7 shrink-0 text-[#e10600]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#kontak"
            onClick={(event) => handleNavClick(event, "#kontak")}
            className="btn-primary mt-6 w-full"
          >
            Mulai Proyek
          </a>
          <a
            href="mailto:hello@tansstudio.com"
            className="mt-4 text-center text-[12px] tracking-[0.02em] text-[#ffc7c6]"
          >
            hello@tansstudio.com
          </a>
        </div>
      )}
    </>
  );
}
