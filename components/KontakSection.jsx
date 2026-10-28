"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "sultan242600@gmail.com";

const channels = [
  {
    label: "Email",
    value: EMAIL,
    sub: "Balasan < 24 jam",
    href: `mailto:${EMAIL}`,
  },
  {
    label: "Instagram",
    value: "@tans.studio",
    sub: "Arsip di balik layar",
  },
  {
    label: "Lokasi",
    value: "UTC+7 / Remote",
    sub: "Kolaborasi global",
  },
];

export default function KontakSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const formRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          "a[href], button:not([disabled]), input, select, textarea"
        )
      ).filter((element) => element.offsetParent !== null);
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      triggerRef.current?.focus?.({ preventScroll: true });
    };
  }, [modalOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("type") || "");
    const detail = String(data.get("detail") || "").trim();

    const subject = encodeURIComponent(`Proyek baru — ${name || "TANS Studio"}`);
    const body = encodeURIComponent(
      `Nama / Rumah Produksi: ${name}\nEmail: ${email}\nKategori: ${type}\n\nDetail proyek:\n${detail}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    window.setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      formRef.current?.reset();
    }, 1600);
  };

  const openModal = (event) => {
    triggerRef.current = event.currentTarget;
    setModalOpen(true);
  };

  return (
    <>
      <section
        id="kontak"
        ref={sectionRef}
        className="section-pad w-full border-t border-ash bg-bone"
      >
        <div ref={contentRef} className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-graphite">Kontak — buka sesi</p>
              <h2 className="display mt-5">
                Punya
                <br />
                <span className="text-graphite">visi?</span>
              </h2>
            </div>

            <div className="flex flex-col justify-end lg:col-span-5">
              <span className="inline-flex w-fit items-center gap-2 text-[11px]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-mint"
                />
                Tersedia untuk proyek 2026
              </span>
              <p className="body-copy mt-4 max-w-[440px]">
                Tersedia untuk proyek komersial, film independen, dan kolaborasi
                retouching editorial. Ceritakan format, durasi, dan target
                rilis.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={`mailto:${EMAIL}`} className="pill gap-2">
                  Kirim email
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={openModal}
                  className="pill pill-outline"
                >
                  Form proyek
                </button>
              </div>
            </div>
          </div>

          <a
            href={`mailto:${EMAIL}`}
            className="group mt-16 flex items-center justify-between gap-4 border-y border-ash py-6 transition-colors hover:text-magenta md:mt-20"
          >
            <span className="text-[clamp(1.2rem,3vw,2.35rem)] font-light tracking-[-0.035em]">
              {EMAIL}
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink transition-colors duration-300 group-hover:border-magenta group-hover:bg-magenta group-hover:text-bone">
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </a>

          <div className="mt-12 grid gap-8 border-t border-ash pt-8 sm:grid-cols-3">
            {channels.map((channel) => (
              <div key={channel.label}>
                <p className="eyebrow text-graphite">{channel.label}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="mt-2 inline-block text-[15px] transition-colors hover:text-magenta"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="mt-2 text-[15px]">{channel.value}</p>
                )}
                <p className="mt-1.5 text-[11px] text-graphite">
                  {channel.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-ink/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-title"
              className="relative w-full max-w-lg border border-ink bg-bone p-5 text-ink sm:p-7"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-graphite">Brief awal</p>
                  <h3 id="contact-title" className="heading-sm mt-2">
                    Cakupan proyek
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Tutup form proyek"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ash text-ink/70 transition-colors hover:border-ink hover:bg-ink hover:text-bone"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              {!submitted ? (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="cf-name"
                      className="eyebrow mb-1.5 block text-graphite"
                    >
                      Nama / Rumah Produksi
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Nama Anda"
                      className="w-full border-0 border-b border-ash bg-transparent py-2.5 text-sm placeholder:text-ink/25 focus:border-magenta focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cf-email"
                      className="eyebrow mb-1.5 block text-graphite"
                    >
                      Email
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      placeholder="nama@domain.com"
                      className="w-full border-0 border-b border-ash bg-transparent py-2.5 text-sm placeholder:text-ink/25 focus:border-magenta focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cf-type"
                      className="eyebrow mb-1.5 block text-graphite"
                    >
                      Kategori
                    </label>
                    <select
                      id="cf-type"
                      name="type"
                      className="w-full border-0 border-b border-ash bg-transparent py-2.5 text-sm focus:border-magenta focus:outline-none"
                    >
                      <option>Video & Color Grading</option>
                      <option>Photo Retouching</option>
                      <option>Key Art & Desain</option>
                      <option>Paket Lengkap</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="cf-detail"
                      className="eyebrow mb-1.5 block text-graphite"
                    >
                      Detail Proyek
                    </label>
                    <textarea
                      id="cf-detail"
                      name="detail"
                      rows={3}
                      placeholder="Format kamera, durasi, target rilis..."
                      className="w-full resize-none border-0 border-b border-ash bg-transparent py-3 text-sm placeholder:text-ink/25 focus:border-magenta focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="pill w-full">
                    Siapkan draft email
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                  <p className="text-center text-[10px] leading-relaxed text-graphite">
                    Tombol ini membuka aplikasi email Anda dengan brief yang
                    sudah terisi. Tidak ada data yang dikirim ke server.
                  </p>
                </form>
              ) : (
                <div
                  className="flex flex-col items-center gap-3 py-12 text-center"
                  aria-live="polite"
                >
                  <span className="h-2 w-2 bg-magenta" aria-hidden="true" />
                  <p className="heading-sm">Draft disiapkan.</p>
                  <p className="max-w-[280px] text-sm leading-relaxed text-graphite">
                    Selesaikan pengiriman dari aplikasi email Anda. Studio akan
                    membalas dalam 24 jam.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
