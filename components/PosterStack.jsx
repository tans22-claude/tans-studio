"use client";

// Stacking poster section: semua poster di-preload dulu, baru section di-pin
// dan poster menumpuk satu per satu mengikuti scroll (efek kartu/deck).

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Jarak scroll per poster saat menumpuk (dalam % tinggi viewport).
const STACK_SCROLL_STEP = 90;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

// Vignette halus supaya latar tidak terlihat seperti foto rata.
const BACKGROUND_VIGNETTE =
  "radial-gradient(circle at 50% 45%, rgba(17,17,17,0) 35%, rgba(17,17,17,0.32) 100%)";

// Poster dipakai sebagai latar full-viewport, diburamkan. Blur dikerjakan pada
// kotak 1/4 ukuran lalu di-scale 4x: hasil visual sama, raster 16x lebih ringan.
// Nilai blur relatif terhadap viewport (0.6vw) supaya di layar kecil latarnya
// tidak jadi rata total; angka di sini 1/4 dari blur visual di layar.
const BACKDROP_BLUR = "blur(clamp(2.5px, 0.6vw, 6px)) saturate(1.08)";
const BACKDROP_SCALE = 4;
const ACCENT_TINT = 0.26; // aksen poster ditumpuk tipis di atas blur

const toLinear = (value) => {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = ([r, g, b]) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

function parseHexColor(value) {
  const hex = typeof value === "string" ? value.replace("#", "") : "";
  if (hex.length !== 6) return null;
  const int = parseInt(hex, 16);
  if (Number.isNaN(int)) return null;
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

// Warna teks dipilih dari kontras terbaik terhadap latar (hitam vs putih).
function readableTextColor(rgb) {
  const luminance = relativeLuminance(rgb);
  const withBlack = (luminance + 0.05) / 0.05;
  const withWhite = 1.05 / (luminance + 0.05);
  return withBlack >= withWhite ? "#111111" : "#ffffff";
}

// Rata-rata warna poster (dibaca dari piksel) untuk menaksir terang latar.
function sampleAverageColor(img, size = 12) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 8) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count += 1;
    }
    if (count === 0) return null;
    return [r / count, g / count, b / count];
  } catch {
    return null;
  }
}

export default function PosterStack({ items = [] }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const counterRef = useRef(null);
  const cardsRef = useRef([]);
  const bgLayerRefs = useRef([]);
  const sampledColorsRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  const total = items.length;

  // ── 1. Preload semua poster sebelum animasi apa pun dijalankan ──
  useEffect(() => {
    if (total === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const pending = new Set(items.map((item) => item.image));

    items.forEach((item, index) => {
      const img = new window.Image();
      let settled = false;

      const finish = () => {
        if (settled || cancelled) return;
        settled = true;
        // Simpan warna rata-rata poster: dipakai memilih warna latar & teks.
        if (img.naturalWidth > 0) {
          sampledColorsRef.current[index] = sampleAverageColor(img);
        }
        pending.delete(item.image);
        setLoadedCount(total - pending.size);
        if (pending.size === 0) setReady(true);
      };

      img.onload = finish;
      img.onerror = finish;
      img.src = item.image;
      if (img.complete) finish();
    });

    return () => {
      cancelled = true;
    };
  }, [items, total]);

  // ── 2. Setelah semua poster siap: pin section + animasi menumpuk ──
  useEffect(() => {
    if (!ready || total === 0) return;

    const mm = gsap.matchMedia();

    mm.add(
      { reduceMotion: REDUCED_MOTION_QUERY, motionOk: MOTION_QUERY },
      (context) => {
        const reduceMotion = context.conditions?.reduceMotion;
        const cards = cardsRef.current.filter(Boolean);
        const bgLayers = bgLayerRefs.current.filter(Boolean);
        if (cards.length === 0) return;

        const n = cards.length;
        const accentOf = (index) =>
          parseHexColor(items[index]?.accent) ?? [255, 255, 255];

        // Taksiran warna latar: piksel poster yang diburamkan + tint aksen.
        const backdropOf = (index) => {
          const accent = accentOf(index);
          const sampled = sampledColorsRef.current[index];
          if (!sampled) return accent;
          return sampled.map(
            (channel, i) => channel * (1 - ACCENT_TINT) + accent[i] * ACCENT_TINT
          );
        };

        // Warna teks strip mengikuti terang latar poster yang sedang tampil.
        gsap.set(stageRef.current, {
          color: readableTextColor(backdropOf(0)),
        });

        gsap.set(cards[0], {
          yPercent: 0,
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          zIndex: 0,
        });

        if (reduceMotion || n === 1) {
          // Tanpa motion: tumpukan ditampilkan statis sebagai satu deck.
          if (bgLayers[0]) {
            gsap.set(bgLayers[0], { autoAlpha: 1 });
          }
          cards.slice(1).forEach((card, index) => {
            gsap.set(card, {
              yPercent: (index + 1) * 1.6,
              rotation: (index % 2 === 0 ? 1 : -1) * (2 + index),
              scale: 1 - (index + 1) * 0.02,
              autoAlpha: 1,
              zIndex: n - index,
            });
          });
          if (counterRef.current) {
            counterRef.current.textContent = String(n).padStart(2, "0");
          }
          return;
        }

        cards.slice(1).forEach((card, index) => {
          gsap.set(card, {
            yPercent: 118,
            rotation: index % 2 === 0 ? 7 : -7,
            scale: 0.9,
            autoAlpha: 0,
            zIndex: index + 1,
          });
        });

        // Latar mulai dari warna poster pertama, memudar masuk.
        if (bgLayers[0]) {
          gsap.fromTo(
            bgLayers[0],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.8, ease: "power2.out" }
          );
        }

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.out" },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: `+=${(n - 1) * STACK_SCROLL_STEP}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(
                n - 1,
                Math.round(self.progress * (n - 1))
              );
              if (counterRef.current) {
                counterRef.current.textContent = String(active + 1).padStart(
                  2,
                  "0"
                );
              }
            },
          },
        });

        for (let i = 1; i < n; i++) {
          const at = i - 1;

          // Poster baru naik ke depan.
          tl.to(
            cards[i],
            { yPercent: 0, rotation: 0, scale: 1, autoAlpha: 1 },
            at
          );

          // Poster di belakangnya mundur sedikit (efek deck).
          tl.to(
            cards.slice(0, i),
            {
              yPercent: (index) => -5 - (i - 1 - index) * 4.5,
              scale: (index) => 0.965 ** (i - index),
            },
            at
          );

          // Latar + warna teks ikut berganti ke poster yang sedang tampil.
          if (bgLayers[i]) {
            tl.to(bgLayers[i], { autoAlpha: 1, duration: 1 }, at);
            // Poster baru sudah menutup penuh lapisan di bawahnya: sembunyikan
            // supaya tidak ikut dikomposit tiap frame (hemat GPU/CPU).
            if (i > 1) {
              tl.set(
                bgLayers.slice(0, i),
                { autoAlpha: 0, immediateRender: false },
                at + 1
              );
            }
          }
          tl.to(
            stageRef.current,
            { color: readableTextColor(backdropOf(i)), duration: 1 },
            at
          );
        }

        // Ekor kecil: beri ruang agar scrub selesai sebelum pin dilepas,
        // jadi tumpukan sudah rapi saat section lanjut.
        tl.to({}, { duration: 0.5 });

        return () => {
          gsap.set(cards, { clearProps: "all" });
          gsap.set(bgLayers, { clearProps: "opacity,visibility" });
        };
      },
      sectionRef
    );

    ScrollTrigger.refresh();

    return () => mm.revert();
  }, [ready, total]);

  return (
    // Section dibuat full-bleed: keluar dari padding horizontal induknya
    // supaya latar poster menutup seluruh lebar viewport saat di-pin.
    <section ref={sectionRef} className="relative -mx-6 w-auto bg-[#ffffff] md:-mx-12">
      <div
        ref={stageRef}
        className="relative flex h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#ffffff] px-6 md:px-12"
      >
        {/* Latar: poster yang sedang tampil, full viewport dan diburamkan */}
        {items.map((item, index) => (
          <div
            key={`bg-${item.id ?? item.image}`}
            ref={(element) => {
              bgLayerRefs.current[index] = element;
            }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#111111] opacity-0 will-change-[opacity]"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-1/4 w-1/4 origin-top-left"
                style={{
                  filter: BACKDROP_BLUR,
                  transform: `scale(${BACKDROP_SCALE})`,
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: item.accent ?? "#ffffff",
                opacity: ACCENT_TINT,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundImage: BACKGROUND_VIGNETTE }}
            />
          </div>
        ))}

        {/* Status strip */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-70">
            Poster
          </span>
          <span
            ref={counterRef}
            className="font-display text-sm font-bold tabular-nums"
          >
            01
          </span>
          <span className="h-[1px] w-8 bg-current opacity-30" />
          <span className="font-display text-sm font-bold tabular-nums opacity-60">
            {String(total).padStart(2, "0")}
          </span>
          {!ready && (
            <span className="ml-2 pill-btn bg-[#111111] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ffffff]">
              Memuat {loadedCount}/{total}
            </span>
          )}
        </div>

        {/* Deck */}
        <div className="relative z-10 w-[min(78vw,42vh)] aspect-[4/5]">
          {!ready && (
            <div className="sharp-tile absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#f5f5f5]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#707072]">
                Menyiapkan poster
              </span>
              <div className="h-[2px] w-40 overflow-hidden bg-[#e5e5e5]">
                <div
                  className="h-full bg-[#111111] transition-[width] duration-300 ease-out"
                  style={{
                    width: `${
                      total === 0 ? 100 : (loadedCount / total) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {items.map((item, index) => (
            <div
              key={item.id ?? item.image}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
              className="sharp-tile absolute inset-0 overflow-hidden bg-[#111111] opacity-0 shadow-[0_36px_70px_-32px_rgba(17,17,17,0.55)]"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 z-10 space-y-2 p-6">
                <span className="block text-[11px] font-medium uppercase tracking-widest text-[#ffffff]/75">
                  {item.label}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight leading-none text-[#ffffff] md:text-3xl">
                  {item.title}
                </h3>
                <span
                  className="mt-3 block h-[3px] w-14"
                  style={{ backgroundColor: item.accent ?? "#ffffff" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <span className="h-[1px] w-8 bg-current opacity-30" />
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-70">
            {ready ? "Gulir Untuk Menumpuk" : "Menunggu Aset"}
          </span>
          <span className="h-[1px] w-8 bg-current opacity-30" />
        </div>
      </div>
    </section>
  );
}
