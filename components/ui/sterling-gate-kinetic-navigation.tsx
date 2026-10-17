"use client";

// Kinetic fullscreen navigation untuk TANS STUDIO.
// Header minimal (logo + tombol Menu) dan overlay menu layar penuh dengan
// backdrop berlapis, tautan besar, serta bentuk ambient yang muncul saat hover.

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

type MenuLink = { label: string; href: string };

const MENU_LINKS: MenuLink[] = [
  { label: "Karya", href: "#karya" },
  { label: "Layanan", href: "#layanan" },
  { label: "Proses Kreatif", href: "#proses" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Easing "main" dipakai hanya oleh timeline menu ini (bukan gsap.defaults
  // global, supaya section lain tetap memakai easing-nya sendiri).
  useEffect(() => {
    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
      }
    } catch (error) {
      console.warn("CustomEase gagal dimuat, memakai power3.inOut.", error);
    }
  }, []);

  // Bentuk ambient mengikuti item menu yang sedang di-hover.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanupHover: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll<HTMLElement>(
        ".menu-list-item[data-shape]"
      );
      const shapesContainer = container.querySelector(
        ".ambient-background-shapes"
      );

      items.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(
          `.bg-shape-${shapeIndex}`
        );
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          gsap.fromTo(
            shapeEls,
            { scale: 0.6, opacity: 0, rotation: -8 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.07,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.85,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        item.addEventListener("focusin", onEnter);
        item.addEventListener("focusout", onLeave);

        cleanupHover.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
          item.removeEventListener("focusin", onEnter);
          item.removeEventListener("focusout", onLeave);
        });
      });
    }, container);

    return () => {
      cleanupHover.forEach((run) => run());
      ctx.revert();
    };
  }, []);

  // Animasi buka/tutup menu.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const navWrap = container.querySelector(".nav-overlay-wrapper");
      const menu = container.querySelector(".menu-content");
      const overlay = container.querySelector(".overlay");
      const bgPanels = container.querySelectorAll(".backdrop-layer");
      const menuLinks = container.querySelectorAll(".nav-link");
      const fadeTargets =
        container.querySelectorAll<HTMLElement>("[data-menu-fade]");
      const menuButton = container.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll("p");
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

      const tl = gsap.timeline({
        defaults: { ease: "main", duration: 0.7 },
      });

      if (isMenuOpen) {
        navWrap?.setAttribute("data-nav", "open");

        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(
            menuButtonTexts,
            { yPercent: 0 },
            { yPercent: -100, stagger: 0.2 }
          )
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(
            bgPanels,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.11, duration: 0.6 },
            "<"
          )
          .fromTo(
            menuLinks,
            { yPercent: 140, rotate: 8 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.32"
          );

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 40 },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.04,
              clearProps: "all",
            },
            "<+=0.15"
          );
        }
      } else {
        navWrap?.setAttribute("data-nav", "closed");

        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .to(menuButtonTexts, { yPercent: 0 }, "<")
          .to(menuButtonIcon, { rotate: 0 }, "<")
          .set(navWrap, { display: "none" });
      }
    }, container);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Kunci scroll (Lenis + fallback native) selama menu terbuka.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;

    if (isMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Escape menutup menu.
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();
      setIsMenuOpen(false);

      window.setTimeout(() => {
        const lenis = (
          window as unknown as {
            __lenis?: {
              scrollTo: (
                target: HTMLElement | number,
                options?: { duration?: number; offset?: number }
              ) => void;
            };
          }
        ).__lenis;

        const target = href === "#top" ? null : document.querySelector(href);

        if (lenis) {
          lenis.scrollTo((target as HTMLElement | null) ?? 0, {
            duration: 1.2,
          });
          return;
        }

        if (target) target.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 320);
    },
    []
  );

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="sg-nav">
      {/* ── Header minimal ── */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] px-5 pt-5 md:px-10 md:pt-6">
        <div className="flex items-start justify-between gap-4">
          <a
            href="#top"
            onClick={(event) => handleNavClick(event, "#top")}
            aria-label="TANS STUDIO — kembali ke atas"
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[#e5e5e5] bg-[#ffffff] px-4 py-2 shadow-[0_18px_40px_-30px_rgba(17,17,17,0.9)] transition-colors duration-300 hover:bg-[#f5f5f5] md:px-5 md:py-2.5"
          >
            <span className="font-display text-base leading-none font-bold tracking-tight uppercase md:text-lg">
              TANS STUDIO
            </span>
            <span className="hidden text-[9px] font-bold tracking-[0.25em] text-[#707072] uppercase sm:inline">
              / Suite 01
            </span>
          </a>

          <button
            type="button"
            className="nav-close-btn pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[#e5e5e5] bg-[#ffffff] px-4 py-2 shadow-[0_18px_40px_-30px_rgba(17,17,17,0.9)] transition-colors duration-300 hover:bg-[#f5f5f5] md:px-5 md:py-2.5"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            <span className="menu-button-text relative block h-[1.05em] w-[4.6em] overflow-hidden text-[10px] leading-[1.05em] font-bold tracking-[0.22em] uppercase md:text-[11px]">
              <p className="p-large block whitespace-nowrap">Menu</p>
              <p className="p-large absolute top-full left-0 block whitespace-nowrap">
                Close
              </p>
            </span>
            <span className="icon-wrap block h-3.5 w-3.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 16 16"
                fill="none"
                className="menu-button-icon origin-center"
              >
                <path
                  d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                  fill="currentColor"
                />
                <path
                  d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                  fill="currentColor"
                />
                <path
                  d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                  fill="currentColor"
                />
                <path
                  d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                  fill="currentColor"
                />
                <path
                  d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                  fill="currentColor"
                />
                <path
                  d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {/* ── Overlay menu ── */}
      <section className="fullscreen-menu-container">
        <div
          id="site-menu"
          data-nav="closed"
          className="nav-overlay-wrapper fixed inset-0 z-[60] hidden"
        >
          <div
            className="overlay absolute inset-0 bg-[#111111]/70"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <nav className="menu-content absolute inset-0 overflow-hidden text-[#ffffff]">
            <div className="menu-bg absolute inset-0">
              <div className="backdrop-layer absolute inset-0 bg-[#1c1c1c]" />
              <div className="backdrop-layer absolute inset-0 bg-[#141414]" />
              <div className="backdrop-layer absolute inset-0 bg-[#0d0d0d]" />

              <div className="ambient-background-shapes pointer-events-none absolute inset-y-0 right-0 h-full w-full opacity-70 md:w-[58%]">
                {/* 1 — lingkaran mengambang */}
                <svg
                  className="bg-shape bg-shape-1 absolute inset-0 h-full w-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <circle className="shape-element opacity-0" cx="80" cy="120" r="40" fill="rgba(255,255,255,0.10)" />
                  <circle className="shape-element opacity-0" cx="300" cy="80" r="60" fill="rgba(255,255,255,0.08)" />
                  <circle className="shape-element opacity-0" cx="200" cy="300" r="80" fill="rgba(255,255,255,0.06)" />
                  <circle className="shape-element opacity-0" cx="350" cy="280" r="30" fill="rgba(255,255,255,0.12)" />
                </svg>

                {/* 2 — gelombang */}
                <svg
                  className="bg-shape bg-shape-2 absolute inset-0 h-full w-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <path className="shape-element opacity-0" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(255,255,255,0.12)" strokeWidth="48" fill="none" />
                  <path className="shape-element opacity-0" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(255,255,255,0.08)" strokeWidth="32" fill="none" />
                </svg>

                {/* 3 — grid titik */}
                <svg
                  className="bg-shape bg-shape-3 absolute inset-0 h-full w-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <circle className="shape-element opacity-0" cx="50" cy="50" r="7" fill="rgba(255,255,255,0.28)" />
                  <circle className="shape-element opacity-0" cx="150" cy="50" r="7" fill="rgba(255,255,255,0.22)" />
                  <circle className="shape-element opacity-0" cx="250" cy="50" r="7" fill="rgba(255,255,255,0.18)" />
                  <circle className="shape-element opacity-0" cx="350" cy="50" r="7" fill="rgba(255,255,255,0.14)" />
                  <circle className="shape-element opacity-0" cx="100" cy="150" r="10" fill="rgba(255,255,255,0.20)" />
                  <circle className="shape-element opacity-0" cx="200" cy="150" r="10" fill="rgba(255,255,255,0.16)" />
                  <circle className="shape-element opacity-0" cx="300" cy="150" r="10" fill="rgba(255,255,255,0.12)" />
                  <circle className="shape-element opacity-0" cx="50" cy="250" r="9" fill="rgba(255,255,255,0.16)" />
                  <circle className="shape-element opacity-0" cx="150" cy="250" r="9" fill="rgba(255,255,255,0.14)" />
                  <circle className="shape-element opacity-0" cx="250" cy="250" r="9" fill="rgba(255,255,255,0.12)" />
                  <circle className="shape-element opacity-0" cx="350" cy="250" r="9" fill="rgba(255,255,255,0.10)" />
                  <circle className="shape-element opacity-0" cx="100" cy="350" r="5" fill="rgba(255,255,255,0.14)" />
                  <circle className="shape-element opacity-0" cx="200" cy="350" r="5" fill="rgba(255,255,255,0.12)" />
                  <circle className="shape-element opacity-0" cx="300" cy="350" r="5" fill="rgba(255,255,255,0.10)" />
                </svg>

                {/* 4 — gumpalan organik */}
                <svg
                  className="bg-shape bg-shape-4 absolute inset-0 h-full w-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <path className="shape-element opacity-0" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(255,255,255,0.08)" />
                  <path className="shape-element opacity-0" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(255,255,255,0.06)" />
                </svg>

                {/* 5 — garis diagonal */}
                <svg
                  className="bg-shape bg-shape-5 absolute inset-0 h-full w-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <line className="shape-element opacity-0" x1="0" y1="100" x2="300" y2="400" stroke="rgba(255,255,255,0.10)" strokeWidth="26" />
                  <line className="shape-element opacity-0" x1="100" y1="0" x2="400" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="20" />
                  <line className="shape-element opacity-0" x1="200" y1="0" x2="400" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper relative z-10 flex h-full flex-col justify-between px-6 pt-28 pb-8 md:px-12 md:pt-32 md:pb-10">
              <ul className="menu-list flex flex-col gap-1 md:gap-2">
                {MENU_LINKS.map((link, index) => (
                  <li
                    key={link.href}
                    className="menu-list-item group"
                    data-shape={index + 1}
                  >
                    <a
                      href={link.href}
                      className="nav-link flex w-fit items-baseline gap-4 md:gap-7"
                      onClick={(event) => handleNavClick(event, link.href)}
                    >
                      <span
                        className="inline-block text-[10px] font-bold tracking-[0.3em] text-[#ffffff]/35 tabular-nums md:text-[11px]"
                        data-menu-fade
                      >
                        0{index + 1}
                      </span>
                      <span className="nav-link-text relative font-display text-[clamp(1.9rem,min(5.6vw,7vh),4.6rem)] leading-[1.05] font-bold tracking-tight text-[#ffffff]/80 uppercase transition-[transform,color] duration-500 ease-out group-hover:translate-x-2 group-hover:text-[#ffffff] group-focus-visible:translate-x-2 group-focus-visible:text-[#ffffff]">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t border-[#ffffff]/10 pt-5 text-[9px] font-bold tracking-[0.22em] text-[#ffffff]/40 uppercase md:text-[10px]">
                <span className="inline-block" data-menu-fade>
                  Jakarta — Indonesia
                </span>
                <a
                  href="mailto:hello@tansstudio.com"
                  onClick={closeMenu}
                  className="inline-block transition-colors duration-300 hover:text-[#ffffff]"
                  data-menu-fade
                >
                  hello@tansstudio.com
                </a>
                <a
                  href="https://instagram.com/tans.studio"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="inline-block transition-colors duration-300 hover:text-[#ffffff]"
                  data-menu-fade
                >
                  @tans.studio
                </a>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
