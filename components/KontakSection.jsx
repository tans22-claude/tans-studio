"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const channels = [
  {
    label: "Email Langsung",
    value: "hello@tansstudio.com",
    sub: "Balasan < 24 jam",
  },
  {
    label: "Feed Visual",
    value: "@tans.studio",
    sub: "Arsip di balik layar",
  },
  {
    label: "Zona Waktu / Lokasi",
    value: "UTC+7 / Remote Global",
    sub: "Suite asinkron penuh",
  },
];

export default function KontakSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      e.target.reset();
    }, 2000);
  };

  return (
    <>
      <section
        id="kontak"
        ref={sectionRef}
        className="w-full bg-[#111111] text-[#ffffff] py-24 px-6 md:px-12 border-b border-[#e5e5e5]"
      >
        <div className="w-full text-center">
          <div ref={contentRef} className="space-y-8 max-w-7xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 pill-btn bg-[#222222] text-[11px] font-bold uppercase tracking-widest text-[#ffffff]">
              <span className="w-2 h-2 rounded-full bg-[#ffffff]" />
              MEMBUKA JADWAL KOLABORASI Q2 / Q3
            </div>

            {/* Headline */}
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-[#ffffff] max-w-4xl mx-auto leading-tight">
              Punya visi kreatif?
              <br />
              Mari kita wujudkan bersama.
            </h2>

            {/* Sub */}
            <p className="text-[#707072] text-[15px] sm:text-[16px] max-w-xl mx-auto">
              Tersedia untuk proyek komersial terpilih, film independen,
              pengembangan look, serta kolaborasi retouching editorial di seluruh
              dunia.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@tansstudio.com"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 pill-btn bg-[#ffffff] text-[#111111] text-[13px] font-bold uppercase tracking-wider hover:bg-[#e5e5e5] transition-colors"
              >
                Kirimkan Pertanyaan Email
              </a>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 pill-btn border border-[#e5e5e5] text-[#ffffff] text-[13px] font-bold uppercase tracking-wider hover:border-[#ffffff] transition-colors"
              >
                Mulai Form Proyek
              </button>
            </div>

            {/* Channels */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-16 border-t border-[#262626] text-left">
              {channels.map((ch) => (
                <div
                  key={ch.label}
                  className="p-4 bg-[#181818] sharp-tile border border-[#2a2a2a]"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#707072]">
                    {ch.label}
                  </div>
                  <div className="text-[13px] font-medium text-[#ffffff] mt-1">
                    {ch.value}
                  </div>
                  <div className="text-[11px] text-[#9e9ea0] mt-1">{ch.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="relative w-full max-w-lg bg-[#ffffff] sharp-tile border border-[#111111] p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#707072]">
                  FORM INTAKE
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-[#111111]">
                  Cakupan Proyek
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#111111] hover:bg-[#e5e5e5] transition-colors"
                aria-label="Tutup modal"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#707072]">
                    Nama / Rumah Produksi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda / Studio"
                    className="w-full bg-[#f5f5f5] sharp-tile border border-[#e5e5e5] p-3 text-[13px] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#707072]">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@domain.com"
                    className="w-full bg-[#f5f5f5] sharp-tile border border-[#e5e5e5] p-3 text-[13px] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#707072]">
                    Kategori Kebutuhan
                  </label>
                  <select className="w-full bg-[#f5f5f5] sharp-tile border border-[#e5e5e5] p-3 text-[13px] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors">
                    <option>Penyuntingan Video &amp; Color Grading (DaVinci / CapCut)</option>
                    <option>Editorial &amp; Commercial Photo Retouching</option>
                    <option>Key Art &amp; Desain Grafis Tipografi</option>
                    <option>Paket Lengkap Pasca-Produksi</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#707072]">
                    Detail Proyek &amp; Format Rekaman
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Format kamera (cth: ARRI RAW, Sony S-Log3), durasi, dan target tanggal rilis..."
                    className="w-full bg-[#f5f5f5] sharp-tile border border-[#e5e5e5] p-3 text-[13px] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 pill-btn bg-[#111111] text-[#ffffff] text-[12px] font-bold uppercase tracking-wider hover:bg-[#707072] transition-colors"
                >
                  Kirimkan Spesifikasi
                </button>
              </form>
            ) : (
              <div className="text-center py-8 text-[13px] font-bold uppercase tracking-widest text-[#111111]">
                ✓ Spesifikasi terkirim. Studio akan merespons dalam 24 jam.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
