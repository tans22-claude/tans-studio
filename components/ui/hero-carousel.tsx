"use client";

// Adapted for TANS STUDIO: monochrome filmstrip carousel for editorial retouching showcase.
// 4:5 portrait cards, manual drag, no autoplay, white background.

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface HeroCarouselItem {
  id?: string | number;
  title: string;
  image: string;
  label?: string;
  accent?: string; // Background accent color
}

export interface HeroCarouselProps {
  items: HeroCarouselItem[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

const CARD_H = 0.42; // card height ÷ stage height (taller for 4:5 portrait)
const CARD_AR = 0.8; // 4:5 aspect ratio
const GAP = 0.025;
const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 420;

// Film grain SVG for editorial texture
const GRAIN =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.82\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex);
  const [dragging, setDragging] = React.useState(false);
  const reduced = useReducedMotion();

  const last = items.length - 1;
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last));

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last));
      if (controlled === undefined) setUncontrolled(clamped);
      if (clamped !== index) onIndexChange?.(clamped);
    },
    [controlled, index, last, onIndexChange]
  );

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const fullH = clamp(box.h * CARD_H, 240, 480);
  const halfH = fullH * 0.6;
  const cardW = fullH * CARD_AR;
  const gap = Math.max(8, Math.round(cardW * GAP));
  const step = cardW + gap;

  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW]
  );

  const x = useMotionValue(0);
  const target = xFor(index);

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 280, damping: 36, mass: 0.8 };

  React.useEffect(() => {
    if (dragging) return;
    const run = animate(x, target, spring);
    return () => run.stop();
  }, [target, dragging, reduced, x]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let acc = 0;
    let until = 0;
    const onWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const stuck =
        (delta > 0 && index === last) || (delta < 0 && index === 0);
      if (stuck) {
        acc = 0;
        return;
      }
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      acc += delta;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      go(index + Math.sign(acc));
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [go, index, last]);

  const active = items[index];
  if (!active) return null;

  const accent = active.accent ?? "#8a8a8a";

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Editorial retouching showcase"
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        go(keys[e.key]!);
      }}
      className={cn(
        "relative h-full min-h-[28rem] w-full overflow-hidden bg-black text-[#111111] select-none",
        "outline-none focus-visible:ring-1 focus-visible:ring-[#111111]/20 focus-visible:ring-inset",
        className
      )}
    >
      {/* ── Background: the active poster blown up and graded to its accent ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.img
            src={active.image}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: reduced ? 1.18 : 1.32 }}
            animate={{ scale: 1.18 }}
            transition={reduced ? { duration: 0 } : { duration: 5, ease: "linear" }}
          />
          {/* Color grading: keep luminance, take accent's hue */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: accent, mixBlendMode: "color" }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundColor: accent, mixBlendMode: "multiply" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility wash + grain, above the swap so they never flicker */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/65" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />
      {/* Current title (animated swap) */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#111111]"
          >
            {active.title}
          </motion.div>
        </AnimatePresence>
        {active.label && (
          <motion.div
            key={`label-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-[#707072]"
          >
            {active.label}
          </motion.div>
        )}
      </div>

      {/* Filmstrip */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex items-center"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.06}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            const thrown = x.get() + info.velocity.x * 0.1;
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step));
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={item.title}
              aria-current={i === index}
              onClick={() => go(i)}
              className="relative shrink-0 overflow-hidden sharp-tile bg-[#f5f5f5] border-2"
              style={{ width: cardW }}
              animate={{
                height: i === index ? fullH : halfH,
                borderColor: i === index ? "#111111" : "#e5e5e5",
              }}
              transition={spring}
            >
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="h-full w-full object-cover transition-all duration-500"
                style={{ objectPosition: "50% 30%" }}
              />
              {/* Overlay for unfocused */}
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-white"
                animate={{ opacity: i === index ? 0 : 0.3 }}
                transition={spring}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Position indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <span className="font-mono text-[11px] font-bold tracking-widest text-[#111111]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative w-20 h-[2px] bg-[#e5e5e5]">
          <motion.div
            className="absolute inset-y-0 bg-[#111111]"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
        <span className="font-mono text-[11px] font-bold tracking-widest text-[#707072]">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
