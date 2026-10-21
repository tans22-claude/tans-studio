"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";

const INTRO_EASE = "cubic-bezier(0.25,1,0.5,1)";
const IMAGE_Z_INDEX_DURATION = 0.1;
const IMAGE_Z_INDEX_STAGGER = 0.2;
const STACK_SCALE_STEP = 0.15;
const STACK_Y_PERCENT_STEP = 20;
// Maksimal jarak antar gambar saat spread, relatif terhadap tinggi gambar.
const MAX_SPREAD_STEP_RATIO = 1.1;
// Total tinggi spread tidak boleh melebihi 78% tinggi viewport.
const MAX_SPREAD_VIEWPORT_RATIO = 0.78;
const IMAGE_FADE_STAGGER = 0.08;

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// 5 gambar lokal dari public/desaind (urutan: putriasing paling depan)
const STACK_IMAGE_SOURCES = [
  "/desaind/putriasing.webp",
  "/desaind/coffe.jpg",
  "/desaind/meee.webp",
  "/desaind/perang.webp",
  "/desaind/Frame 50.webp",
];

function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number
) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, numericValue));
}

interface StackToSpreadIntroProps {
  imageSize?: number;
  duration?: number;
  fadeOutDuration?: number;
  backgroundColor?: string;
  onComplete?: () => void;
}

const StackToSpreadIntro = forwardRef<HTMLElement, StackToSpreadIntroProps>(
  function StackToSpreadIntro(
    {
      imageSize = 1,
      duration = 1,
      fadeOutDuration = 0.8,
      backgroundColor = "#260212",
      onComplete,
    },
    ref
  ) {
    const uid = useId().replace(/:/g, "");
    const loaderWrapperId = `loader-wrapper-${uid}`;
    const imgsWrapperId = `imgs-wrapper-${uid}`;
    const rootRef = useRef<HTMLElement | null>(null);
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
    const progressLayerRef = useRef<HTMLDivElement | null>(null);
    const progressBarRef = useRef<SVGCircleElement | null>(null);
    const progressTextRef = useRef<HTMLSpanElement | null>(null);
    const onCompleteRef = useRef(onComplete);

    const safeImageSize = clampNumber(imageSize, 0.5, 2.5, 1);
    const safeDuration = clampNumber(duration, 0.25, 3, 1);
    const safeFadeOutDuration = clampNumber(fadeOutDuration, 0.1, 3, 0.8);

    useEffect(() => {
      onCompleteRef.current = onComplete;
    }, [onComplete]);

    useLayoutEffect(() => {
      const reduceMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false;

      const ctx = gsap.context(() => {
        const imageElements = imagesRef.current.filter(Boolean);
        const totalImages = imageElements.length;

        // Hormati preferensi reduced-motion: tanpa animasi panjang.
        if (reduceMotion) {
          gsap.set(progressLayerRef.current, { display: "none" });
          gsap.set(`#${imgsWrapperId}`, { opacity: 1, yPercent: 0 });
          if (progressTextRef.current) {
            progressTextRef.current.textContent = "100";
          }
          imageElements.forEach((imageElement, index) => {
            gsap.set(imageElement, {
              opacity: 1,
              scale: 1,
              zIndex: index,
              yPercent:
                totalImages === 1 ? 0 : -40 + index * 20,
            });
          });
          gsap.to(
            [
              imageElements,
              ...imageElements.map((imageElement) => imageElement.firstElementChild),
            ],
            {
              opacity: 0,
              duration: safeFadeOutDuration,
              delay: 0.4,
              stagger: 0.03,
              onComplete: () => {
                gsap.set(rootRef.current, { display: "none" });
                onCompleteRef.current?.();
              },
            }
          );
          return;
        }

        if (totalImages === 0) {
          gsap.set(rootRef.current, { display: "none" });
          onCompleteRef.current?.();
          return;
        }

        // Hitung spread agar seluruh deretan gambar tetap di dalam viewport
        // dan simetris terhadap titik tengah layar.
        const imageHeight =
          imageElements[0].getBoundingClientRect().height || 1;
        const viewportHeight =
          rootRef.current?.getBoundingClientRect().height ||
          window.innerHeight ||
          1;
        const maxExtent = viewportHeight * MAX_SPREAD_VIEWPORT_RATIO;
        const maxStepPx =
          totalImages > 1
            ? Math.max(0, (maxExtent - imageHeight) / (totalImages - 1))
            : 0;
        const stepPx = Math.min(
          imageHeight * MAX_SPREAD_STEP_RATIO,
          maxStepPx
        );
        const spreadStepPercent = (stepPx / imageHeight) * 100;
        const totalSpreadPercent = spreadStepPercent * (totalImages - 1);

        const spreadPosition = (index: number) =>
          totalImages === 1
            ? 0
            : -totalSpreadPercent / 2 + index * spreadStepPercent;

        // Kondisi awal: semua tersembunyi kecuali progress ring.
        gsap.set(imageElements, { opacity: 0 });
        gsap.set(`#${imgsWrapperId}`, { opacity: 0, yPercent: 500 });
        gsap.set(progressLayerRef.current, { opacity: 1, scale: 1 });
        progressBarRef.current?.setAttribute(
          "stroke-dashoffset",
          String(RING_CIRCUMFERENCE)
        );
        if (progressTextRef.current) {
          progressTextRef.current.textContent = "0";
        }
        const progressState = { value: 0 };

        const tl = gsap.timeline({
          defaults: { ease: INTRO_EASE },
        });
        tl.timeScale(1 / safeDuration);

        // ---- STAGE 1: progress ring 0 → 100% ----
        tl.to(
          progressState,
          {
            value: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              const progress = Math.round(progressState.value);
              progressBarRef.current?.setAttribute(
                "stroke-dashoffset",
                String(RING_CIRCUMFERENCE * (1 - progressState.value / 100))
              );
              if (progressTextRef.current) {
                progressTextRef.current.textContent = `${progress}`;
              }
            },
          },
          0
        );

        // Tahan sebentar di 100% sebelum menghilang.
        tl.to({}, { duration: 0.35 });

        // ---- STAGE 2: ring fade out ----
        tl.to(progressLayerRef.current, {
          opacity: 0,
          scale: 0.92,
          duration: 0.45,
          ease: INTRO_EASE,
          onComplete: () => {
            gsap.set(progressLayerRef.current, { display: "none" });
          },
        });

        // Jeda kecil sebelum animasi gambar masuk.
        tl.to({}, { duration: 0.15 });

        // ---- STAGE 3: image stack masuk dari bawah ----
        tl.fromTo(
          `#${imgsWrapperId}`,
          { yPercent: 500, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: INTRO_EASE }
        );

        tl.to(
          imageElements,
          { opacity: 1, duration: 0.5, ease: INTRO_EASE },
          "<"
        );

        // Urutan tumpukan gambar.
        imageElements.forEach((imageElement, index) => {
          tl.to(
            imageElement,
            {
              zIndex: index,
              duration: IMAGE_Z_INDEX_DURATION,
              ease: INTRO_EASE,
            },
            `<${index * IMAGE_Z_INDEX_STAGGER}`
          );
        });

        // ---- STAGE 4: stack ----
        tl.to(
          imageElements,
          {
            scale: (index: number) => 1 + index * STACK_SCALE_STEP,
            yPercent: (index: number) => -(index * STACK_Y_PERCENT_STEP),
            duration: 1,
            stagger: { each: 0.01, from: "end" },
            ease: "power3.inOut",
          },
          "<"
        );

        // ---- STAGE 5: spread, simetris di tengah viewport ----
        tl.to(
          imageElements,
          {
            scale: 1,
            yPercent: (index: number) => spreadPosition(index),
            duration: 1,
            stagger: { each: 0.01, from: "end" },
            ease: "power3.inOut",
          },
          "+=0.2"
        );

        tl.to({}, { duration: 0.35 });

        // ---- STAGE 6: fade out lalu reveal konten ----
        tl.to(
          imageElements,
          {
            opacity: 0,
            duration: safeFadeOutDuration,
            stagger: { each: IMAGE_FADE_STAGGER, from: "end" },
            ease: "power2.inOut",
          },
          "<"
        );

        tl.to(
          rootRef.current,
          {
            opacity: 0,
            duration: safeFadeOutDuration,
            ease: INTRO_EASE,
            onComplete: () => {
              gsap.set(rootRef.current, { display: "none" });
              onCompleteRef.current?.();
            },
          },
          "-=0.15"
        );
      }, rootRef);

      return () => ctx.revert();
    }, [imgsWrapperId, safeDuration, safeFadeOutDuration]);

    return (
      <section
        ref={(element) => {
          rootRef.current = element;
          if (typeof ref === "function") {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
        id={loaderWrapperId}
        className="fixed inset-0 z-50 overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* STAGE 1 — progress ring, benar-benar center viewport */}
        <div
          ref={progressLayerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg
              className="absolute inset-0 h-32 w-32 -rotate-90"
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r={RING_RADIUS}
                stroke="#4f0423"
                strokeWidth="1"
                fill="none"
              />
              <circle
                ref={progressBarRef}
                cx="60"
                cy="60"
                r={RING_RADIUS}
                stroke="#e10600"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE}
              />
              <circle cx="60" cy="6" r="2" fill="#ffc7c6" opacity="0.35" />
              <circle cx="114" cy="60" r="2" fill="#ffc7c6" opacity="0.35" />
              <circle cx="60" cy="114" r="2" fill="#ffc7c6" opacity="0.35" />
              <circle cx="6" cy="60" r="2" fill="#ffc7c6" opacity="0.35" />
            </svg>
            <div className="relative z-10 flex flex-col items-center">
              <span
                ref={progressTextRef}
                className="font-display text-4xl font-bold tracking-tight text-white tabular-nums"
              >
                0
              </span>
              <span className="mt-1 font-display text-[10px] font-medium uppercase tracking-[0.3em] text-[#ffc7c6]">
                Studio
              </span>
            </div>
          </div>
        </div>

        {/* STAGE 2 — image stack, juga center viewport */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            id={imgsWrapperId}
            className="relative opacity-0"
            style={{
              width: `clamp(6rem, min(${11 * safeImageSize}vw, ${
                16 * safeImageSize
              }vh), 20rem)`,
              height: `clamp(6rem, min(${11 * safeImageSize}vw, ${
                16 * safeImageSize
              }vh), 20rem)`,
            }}
          >
            {STACK_IMAGE_SOURCES.map((src, index) => (
              <div
                key={`${src}-${index}`}
                ref={(element) => {
                  imagesRef.current[index] = element;
                }}
                className="sharp-tile absolute top-0 left-0 size-full overflow-hidden opacity-0"
              >
                <img
                  src={src}
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover"
                  alt={`TANS Studio portfolio ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

interface StackLoaderProps {
  children?: ReactNode;
  onComplete?: () => void;
  imageSize?: number;
  duration?: number;
  fadeOutDuration?: number;
  backgroundColor?: string;
}

export default function StackLoader({
  children,
  onComplete,
  imageSize = 1.2,
  duration = 1.2,
  fadeOutDuration = 0.8,
  backgroundColor = "#260212",
}: StackLoaderProps) {
  const uid = useId().replace(/:/g, "");
  const demoUiId = `demo-ui-${uid}`;
  const stackToSpreadIntroRef = useRef<HTMLElement | null>(null);

  const handleLoaderComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <div id={demoUiId} className="relative">
      {children}
      <StackToSpreadIntro
        ref={stackToSpreadIntroRef}
        imageSize={imageSize}
        duration={duration}
        fadeOutDuration={fadeOutDuration}
        backgroundColor={backgroundColor}
        onComplete={handleLoaderComplete}
      />
    </div>
  );
}
