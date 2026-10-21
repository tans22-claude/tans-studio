"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const channels = [
  {
    label: "Email",
    value: "hello@tansstudio.com",
    sub: "Balasan < 24 jam",
    href: "mailto:hello@tansstudio.com",
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
          'a[href], button:not([disabled]), input, select, textarea'
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
    window.location.href = `mailto:hello@tansstudio.com?subject=${subject}&body=${body}`;

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
        className="section-pad w-full border-t border-[#4f0423] bg-black"
      >
        <div ref={contentRef} className="container-page text-center">
          <p className="eyebrow mb-5 justify-center">Kontak — buka sesi</p>
          <h2 className="display-hero mx-auto max-w-[1000px] text-[#e10600]">
            Punya
            <br />
            <span className="text-[#ffc7c6]">visi?</span>
          </h2>
          <p className="body-copy mx-auto mt-7 max-w-[440px]">
            Tersedia untuk proyek komersial, film independen, dan kolaborasi
            retouching editorial.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:hello@tansstudio.com"
              className="btn-primary w-full sm:w-auto"
            >
              Kirim Email
            </a>
            <button
              type="button"
              onClick={openModal}
              className="btn-ghost w-full sm:w-auto"
            >
              Form Proyek
            </button>
          </div>

          <div className="mt-16 grid gap-8 border-t border-white/15 pt-8 text-left sm:grid-cols-3">
            {channels.map((channel) => (
              <div key={channel.label}>
                <p className="label text-[#ffc7c6]/45">{channel.label}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="mt-2 inline-block text-[15px] text-white transition-colors hover:text-[#ffc7c6]"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="mt-2 text-[15px] text-white">{channel.value}</p>
                )}
                <p className="mt-1.5 text-[11px] text-[#ffc7c6]/45">
                  {channel.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 p-3 sm:p-6"
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
              className="ws-dialog-in relative w-full max-w-lg rounded-xl border border-black bg-[#260212] p-5 sm:p-7"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label text-[#e10600]">Brief awal</p>
                  <h3
                    id="contact-title"
                    className="mt-2 font-display text-[32px] leading-none tracking-[0.015em] text-white"
                  >
                    Cakupan Proyek
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Tutup form proyek"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-white/20 text-white/70 transition-colors hover:border-[#e10600] hover:bg-[#e10600] hover:text-white"
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
                      className="label mb-1.5 block text-[#ffc7c6]/55"
                    >
                      Nama / Rumah Produksi
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Nama Anda"
                      className="w-full rounded-[8px] border border-white/20 bg-black px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:border-[#e10600] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cf-email"
                      className="label mb-1.5 block text-[#ffc7c6]/55"
                    >
                      Email
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      placeholder="nama@domain.com"
                      className="w-full rounded-[8px] border border-white/20 bg-black px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:border-[#e10600] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cf-type"
                      className="label mb-1.5 block text-[#ffc7c6]/55"
                    >
                      Kategori
                    </label>
                    <select
                      id="cf-type"
                      name="type"
                      className="w-full rounded-[8px] border border-white/20 bg-black px-3.5 py-2.5 text-[13px] text-white focus:border-[#e10600] focus:outline-none"
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
                      className="label mb-1.5 block text-[#ffc7c6]/55"
                    >
                      Detail Proyek
                    </label>
                    <textarea
                      id="cf-detail"
                      name="detail"
                      rows={3}
                      placeholder="Format kamera, durasi, target rilis..."
                      className="w-full resize-none rounded-[8px] border border-white/20 bg-black px-3.5 py-3 text-[13px] text-white placeholder:text-white/25 focus:border-[#e10600] focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Siapkan Draft Email
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                  <p className="text-center text-[10px] leading-relaxed text-[#ffc7c6]/40">
                    Tombol ini membuka aplikasi email Anda dengan brief yang
                    sudah terisi. Tidak ada data yang dikirim ke server.
                  </p>
                </form>
              ) : (
                <div
                  className="flex flex-col items-center gap-3 py-12 text-center"
                  aria-live="polite"
                >
                  <span className="h-2 w-2 bg-[#e10600]" aria-hidden="true" />
                  <p className="font-display text-[26px] leading-none text-white">
                    Draft disiapkan.
                  </p>
                  <p className="max-w-[280px] text-[12px] leading-relaxed text-[#ffc7c6]/60">
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
