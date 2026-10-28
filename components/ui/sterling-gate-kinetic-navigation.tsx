"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Personal Project", href: "#karya" },
  { label: "Video Projects", href: "#video" },
  { label: "Layanan", href: "#layanan" },
  { label: "Proses", href: "#proses" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const META = [
  ["Color", "Retouch"],
  ["Key art", "Motion"],
];

export function Component() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#karya");
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector<HTMLElement>(link.href)
    ).filter((section): section is HTMLElement => Boolean(section));

    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const marker = window.scrollY + window.innerHeight * 0.3;
      let current = "";
      sections.forEach((section) => {
        if (section.offsetTop <= marker) current = `#${section.id}`;
      });
      setActiveHref(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 80);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      document.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;

    window.setTimeout(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(target as HTMLElement, { duration: 1.15 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 40);
  };

  const handleTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.15 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 40);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-ink px-5 py-3 text-sm text-bone focus:not-sr-only focus:fixed focus:left-5 focus:top-5"
      >
        Lewati ke konten
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "border-b border-ash/60 bg-bone/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <a
            href="#top"
            onClick={handleTop}
            className="group flex items-center gap-3"
            aria-label="TANS Studio, kembali ke atas"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-normal tracking-[0.02em] text-bone transition-colors duration-300 group-hover:bg-magenta">
              T
            </span>
            <span className="hidden text-[9px] uppercase leading-[1.5] tracking-[0.14em] text-graphite sm:block">
              TANS Studio
              <br />
              Color / Retouch
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            <span aria-hidden="true" className="h-px w-10 bg-ash" />
            <span className="text-[9px] uppercase leading-[1.5] tracking-[0.14em] text-graphite">
              Independent post
              <br />
              Yogyakarta — ID
            </span>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="pill min-h-[40px] gap-2 px-5 py-2.5"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                menuOpen ? "bg-signal" : "bg-mint"
              }`}
            />
            {menuOpen ? "Tutup" : "Menu"}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="site-menu"
          ref={menuRef}
          className="menu-overlay fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bone pt-[88px]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="shell flex flex-1 flex-col pb-10">
            <div className="mt-4 flex items-center justify-between border-b border-ash pb-4">
              <span className="eyebrow text-graphite">Index — 2026</span>
              <span className="eyebrow text-graphite">Scroll / Select</span>
            </div>

            <nav className="flex flex-1 flex-col justify-center py-8">
              {NAV_LINKS.map((link, index) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`menu-link group flex items-baseline gap-4 border-b border-ink/10 py-2.5 transition-colors duration-200 md:gap-6 md:py-3 ${
                      isActive ? "text-magenta" : "text-ink hover:text-magenta"
                    }`}
                    style={{ animationDelay: `${80 + index * 45}ms` }}
                  >
                    <span className="w-8 shrink-0 text-[10px] tracking-[0.06em] text-graphite">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="heading leading-none">{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="ml-auto translate-y-[-0.15em] text-xl transition-transform duration-300 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="grid gap-6 border-t border-ash pt-6 md:grid-cols-3">
              <div>
                <p className="eyebrow text-graphite">Studio</p>
                <p className="mt-2 text-[15px] leading-relaxed">
                  Yogyakarta, Indonesia
                  <br />
                  Tersedia untuk proyek 2026
                </p>
              </div>
              <div>
                <p className="eyebrow text-graphite">Mulai</p>
                <a
                  href="mailto:sultan242600@gmail.com"
                  className="mt-2 inline-block text-[15px] underline decoration-ash underline-offset-4 transition-colors hover:text-magenta"
                >
                  sultan242600@gmail.com
                </a>
              </div>
              <div className="flex flex-wrap items-start gap-2 md:justify-end">
                {META.flat().map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
