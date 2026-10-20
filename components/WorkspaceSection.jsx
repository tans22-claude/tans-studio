"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  FolderOpen,
  Layers,
  Pause,
  Play,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WORKSPACE_FPS as FPS,
  WORKSPACE_PROJECTS as PROJECTS,
  WORKSPACE_TOTAL_DURATION as TOTAL,
} from "@/lib/workspace-projects";

gsap.registerPlugin(ScrollTrigger);

const MICRO =
  "text-[10px] font-semibold uppercase tracking-[0.16em] leading-none";
const TRACKS = [
  { id: "V2", label: "TITLE", height: 28 },
  { id: "V1", label: "VIDEO", height: 64 },
];
const RULER_TICKS = Array.from(
  { length: TOTAL / 2 + 1 },
  (_, index) => index * 2
);
const TRACK_GRID = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: `${(4 / TOTAL) * 100}% 100%`,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pad = (value) => String(value).padStart(2, "0");

function formatTimecode(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const totalFrames = Math.floor(safe * FPS);
  const frames = totalFrames % FPS;
  const totalSeconds = Math.floor(totalFrames / FPS);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}

const formatRulerTime = (seconds) => `00:${pad(Math.round(seconds))}`;
const formatClipLength = (seconds) => `00:${pad(Math.round(seconds))}`;

function withAlpha(hex, alpha) {
  const clean = typeof hex === "string" ? hex.replace("#", "") : "";
  const value = parseInt(clean, 16);
  if (Number.isNaN(value) || clean.length !== 6) {
    return `rgba(167, 139, 250, ${alpha})`;
  }
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function PanelBar({ icon: Icon, label, right }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-white/[0.08] bg-[#14141e] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          size={13}
          strokeWidth={1.75}
          className="shrink-0 text-[#a78bfa]"
          aria-hidden="true"
        />
        <span className={`${MICRO} truncate text-white/60`}>{label}</span>
      </div>
      {right ? (
        <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          {right}
        </div>
      ) : null}
    </div>
  );
}

function ProjectThumb({
  project,
  failed,
  onError,
  className = "",
  sizes = "80px",
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-[#181824] ${className}`}
    >
      {failed ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#1c1c2c,#101018)] font-mono text-[11px] text-white/35">
          {project.index}
        </span>
      ) : (
        <Image
          src={project.image}
          alt=""
          fill
          sizes={sizes}
          onError={onError}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          style={{ objectPosition: project.focal }}
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 border border-white/10"
      />
    </span>
  );
}

function CaseStudyDossier({
  project,
  mediaFailed,
  onMediaError,
  onClose,
  onContact,
  closeButtonRef,
}) {
  const { caseStudy } = project;
  const sections = [
    ["BRIEF", caseStudy.brief],
    ["APPROACH", caseStudy.approach],
    ["OUTCOME", caseStudy.outcome],
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#030308]/92">
      <div
        className="flex min-h-full items-center justify-center p-3 sm:p-6 md:p-10"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-title"
          aria-describedby="dossier-summary"
          className="ws-dossier-in relative w-full max-w-5xl overflow-hidden border border-white/[0.14] bg-[#101018] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup dossier proyek"
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center border border-white/20 bg-[#0a0a12]/90 text-white/75 transition-colors duration-200 hover:border-white/50 hover:text-white"
          >
            <X size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>

          <div className="grid md:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[230px] overflow-hidden bg-[#0a0a12] md:min-h-[560px]">
              {mediaFailed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,#1c1c2c,#0a0a12_70%)]">
                  <span className="font-display text-6xl font-bold text-white/10">
                    {project.index}
                  </span>
                  <span className={`${MICRO} text-white/35`}>MEDIA OFFLINE</span>
                </div>
              ) : (
                <Image
                  src={project.image}
                  alt={`${project.title}, studi kasus`}
                  fill
                  sizes="(min-width: 768px) 44vw, 100vw"
                  onError={onMediaError}
                  className="object-cover"
                  style={{ objectPosition: project.focal }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/10 to-[#0a0a12]/45" />
              <div className="absolute inset-x-4 bottom-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {project.category} · {project.year}
                </div>
                <div
                  className="mt-2 h-[2px] w-12"
                  style={{ backgroundColor: project.accent }}
                />
              </div>
            </div>

            <div className="ws-dossier-scroll p-5 sm:p-7 md:max-h-[80vh] md:overflow-y-auto md:p-8">
              <div className="mt-2 flex items-start justify-between gap-3 pr-9 md:pr-0">
                <h3
                  id="dossier-title"
                  className="font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-4xl"
                >
                  {project.title}
                </h3>
                <span className="mt-1 shrink-0 font-mono text-[11px] text-white/30">
                  #{project.index}
                </span>
              </div>
              <p
                id="dossier-summary"
                className="mt-4 text-[12px] leading-relaxed text-white/60"
              >
                {caseStudy.summary}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-white/[0.08] py-4">
                {[
                  ["CLIENT", project.client],
                  ["YEAR", project.year],
                  ["ROLE", project.role],
                  ["FORMAT", project.format],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <div className={`${MICRO} text-white/45`}>{label}</div>
                    <div
                      className="mt-1.5 truncate text-[11px] font-medium text-white/75"
                      title={value}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-5">
                {sections.map(([label, body]) => (
                  <div key={label}>
                    <div className={`${MICRO} text-white/45`}>{label}</div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">
                      {body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className={`${MICRO} text-white/45`}>DELIVERABLES</div>
                <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {caseStudy.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[11px] leading-relaxed text-white/65"
                    >
                      <span
                        className="mt-[5px] h-1 w-1 shrink-0"
                        style={{ backgroundColor: project.accent }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <div className={`${MICRO} text-white/45`}>TOOLKIT</div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="border border-white/[0.1] bg-white/[0.03] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white/60"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 border-t border-white/[0.08] pt-5 sm:flex-row">
                <a
                  href="#kontak"
                  onClick={onContact}
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111] transition-colors duration-200 hover:bg-[#e5e5e5]"
                >
                  Diskusikan Proyek
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center border border-white/15 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors duration-200 hover:border-white/40 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const libraryRef = useRef(null);
  const previewRef = useRef(null);
  const inspectorRef = useRef(null);
  const timelineRef = useRef(null);

  const timelineScrollRef = useRef(null);
  const timelineContentRef = useRef(null);
  const clipRefs = useRef({});
  const scrubbingRef = useRef(false);
  const videoRef = useRef(null);
  const closeButtonRef = useRef(null);
  const caseStudyTriggerRef = useRef(null);

  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const [playhead, setPlayhead] = useState(1.2);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [caseStudyId, setCaseStudyId] = useState(null);
  const [reelVisible, setReelVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState("");
  const [failedMedia, setFailedMedia] = useState({});

  const selected =
    PROJECTS.find((project) => project.id === selectedId) ?? PROJECTS[0];
  const caseStudyProject =
    PROJECTS.find((project) => project.id === caseStudyId) ?? null;
  const playheadPercent = (playhead / TOTAL) * 100;

  const markMediaFailed = useCallback((id) => {
    setFailedMedia((current) =>
      current[id] ? current : { ...current, [id]: true }
    );
  }, []);

  const selectProject = useCallback((id) => {
    const project = PROJECTS.find((item) => item.id === id);
    if (!project) return;
    setSelectedId(project.id);
    setReelVisible(false);
    setIsPlaying(false);
    setPlaybackError("");
    setVideoTime(0);
    setVideoDuration(0);
    setPlayhead(project.timeline.start + 0.9);
  }, []);

  const selectRelativeProject = (direction) => {
    const currentIndex = PROJECTS.findIndex(
      (project) => project.id === selected.id
    );
    const nextIndex =
      (currentIndex + direction + PROJECTS.length) % PROJECTS.length;
    selectProject(PROJECTS[nextIndex].id);
  };

  const togglePlayback = () => {
    if (!selected.video || playbackError) return;
    setPlaybackError("");
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setReelVisible(true);
    const video = videoRef.current;
    if (video && videoDuration > 0 && videoTime >= videoDuration - 0.08) {
      video.currentTime = 0;
      setVideoTime(0);
    }
    setIsPlaying(true);
  };

  const resetReel = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setVideoTime(0);
      setIsPlaying(true);
      setReelVisible(true);
    }
  };

  const handleVideoMetadata = (event) => {
    const video = event.currentTarget;
    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
    if (!video.videoWidth || !video.videoHeight) {
      setIsPlaying(false);
      setReelVisible(false);
      setPlaybackError(
        "Format reel tidak didukung browser ini. Menampilkan still frame."
      );
    }
  };

  const updatePlayheadFromPointer = useCallback((clientX) => {
    const content = timelineContentRef.current;
    if (!content) return;
    const rect = content.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const next = ratio * TOTAL;
    setPlayhead((current) =>
      Math.abs(current - next) < 0.02 ? current : next
    );
  }, []);

  const beginScrub = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      scrubbingRef.current = true;
      setIsScrubbing(true);
      if (event.currentTarget.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      updatePlayheadFromPointer(event.clientX);
    },
    [updatePlayheadFromPointer]
  );

  const moveScrub = useCallback(
    (event) => {
      if (!scrubbingRef.current) return;
      updatePlayheadFromPointer(event.clientX);
    },
    [updatePlayheadFromPointer]
  );

  const endScrub = useCallback((event) => {
    if (!scrubbingRef.current) return;
    scrubbingRef.current = false;
    setIsScrubbing(false);
    if (event.currentTarget.releasePointerCapture) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const beginTrackScrub = (event) => {
    if (event.pointerType === "touch") return;
    beginScrub(event);
  };

  const handlePlayheadKeyDown = (event) => {
    const step = event.shiftKey ? 4 : 1;
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = playhead + step;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = playhead - step;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = TOTAL;
    }
    if (next === null) return;
    event.preventDefault();
    setPlayhead(clamp(next, 0, TOTAL));
  };

  const handleDossierContact = (event) => {
    event.preventDefault();
    setCaseStudyId(null);
    window.setTimeout(() => {
      const target = document.querySelector("#kontak");
      const lenis = window.__lenis;
      if (lenis && target) {
        lenis.scrollTo(target, { duration: 1.2 });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 180);
  };

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        motionOk: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (context.conditions?.reduceMotion) return;

        const panels = [
          libraryRef.current,
          previewRef.current,
          inspectorRef.current,
          timelineRef.current,
        ].filter(Boolean);
        if (!headerRef.current || panels.length === 0) return;

        gsap.set([headerRef.current, ...panels], { autoAlpha: 0 });
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });
        timeline
          .fromTo(
            headerRef.current,
            { y: 26 },
            { y: 0, autoAlpha: 1, duration: 0.65 }
          )
          .fromTo(
            panels,
            { y: 38 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
            "-=0.3"
          );
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          setIsPlaying(false);
          setPlaybackError("Reel tidak dapat diputar di browser ini.");
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, reelVisible, selectedId]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted, reelVisible, selectedId]);

  useEffect(() => {
    const container = timelineScrollRef.current;
    const clip = clipRefs.current[selectedId];
    if (!container || !clip) return;

    const frame = window.requestAnimationFrame(() => {
      const target =
        clip.offsetLeft - container.clientWidth / 2 + clip.offsetWidth / 2;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      container.scrollTo({
        left: Math.max(0, target),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedId]);

  useEffect(() => {
    if (!caseStudyId) return;

    setIsPlaying(false);
    const trigger = caseStudyTriggerRef.current;
    const lenis = window.__lenis;
    const previousOverflow = document.body.style.overflow;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setCaseStudyId(null);
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = closeButtonRef.current?.closest('[role="dialog"]');
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      lenis?.start();
      trigger?.focus?.({ preventScroll: true });
    };
  }, [caseStudyId]);

  const PANEL =
    "relative flex min-w-0 flex-col overflow-hidden border border-white/[0.08] bg-[#101018]";

  return (
    <>
      <section
        id="workspace"
        ref={sectionRef}
        aria-labelledby="workspace-title"
        className="tans-workspace relative w-full overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6 md:px-12 md:py-28"
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div ref={headerRef} className="mb-8 max-w-2xl">
            <h2
              id="workspace-title"
              className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-white sm:text-4xl md:text-[44px]"
            >
              Creative Workspace
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-white/55 sm:text-sm">
              Jelajahi arsip Tans Studio lewat antarmuka edit. Pilih klip di
              media pool, geser playhead, dan buka dossier tiap proyek.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-12 xl:gap-2.5">
            {/* ── Media Pool ── */}
            <article
              ref={libraryRef}
              data-workspace-panel
              className={`${PANEL} order-2 md:order-2 md:col-span-1 xl:order-1 xl:col-span-3`}
            >
              <PanelBar
                icon={FolderOpen}
                label="Media Pool"
                right={
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#a78bfa]" />
                    {String(PROJECTS.length).padStart(2, "0")} ASSETS
                  </>
                }
              />

              <ul className="flex-1 divide-y divide-white/[0.06]">
                {PROJECTS.map((project) => {
                  const isActive = project.id === selected.id;
                  return (
                    <li key={project.id}>
                      <button
                        type="button"
                        onClick={() => selectProject(project.id)}
                        aria-pressed={isActive}
                        aria-label={`Pilih proyek ${project.title}, kategori ${project.category}`}
                        className={`group relative flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition-colors duration-200 ${
                          isActive
                            ? "bg-white/[0.055]"
                            : "hover:bg-white/[0.035]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-2.5 left-0 w-[2px] transition-opacity duration-200"
                          style={{
                            backgroundColor: project.accent,
                            opacity: isActive ? 1 : 0,
                          }}
                        />
                        <ProjectThumb
                          project={project}
                          failed={Boolean(failedMedia[project.id])}
                          onError={() => markMediaFailed(project.id)}
                          className="h-12 w-[72px]"
                          sizes="80px"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`truncate text-[12px] font-semibold transition-colors ${
                                isActive
                                  ? "text-white"
                                  : "text-white/80 group-hover:text-white"
                              }`}
                            >
                              {project.title}
                            </span>
                            {project.video && (
                              <Film
                                size={10}
                                className="shrink-0 text-white/40"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                            {project.category}
                          </span>
                          <span className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-white/40">
                            <span>
                              {formatClipLength(project.timeline.duration)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">
                              {project.format.split(" · ")[0]}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>

            {/* ── Program Monitor ── */}
            <article
              ref={previewRef}
              data-workspace-panel
              className={`${PANEL} order-1 md:order-1 md:col-span-2 xl:order-2 xl:col-span-6`}
            >
              <PanelBar
                icon={Film}
                label="Program Monitor"
                right={<span className="hidden sm:inline">16:9</span>}
              />

              <div className="p-2">
                <div className="group relative aspect-video w-full overflow-hidden bg-[#050508]">
                  {PROJECTS.map((project) => {
                    const isActive = project.id === selected.id;
                    return (
                      <div
                        key={project.id}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "z-[2] scale-100 opacity-100"
                            : "z-[1] scale-[1.035] opacity-0"
                        }`}
                      >
                        {failedMedia[project.id] ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_40%,#1c1c2c,#050508_70%)]">
                            <span className="font-display text-5xl font-bold text-white/10">
                              {project.index}
                            </span>
                            <span className={`${MICRO} text-white/35`}>
                              MEDIA OFFLINE
                            </span>
                          </div>
                        ) : (
                          <Image
                            src={project.image}
                            alt=""
                            fill
                            priority={project.index === "01"}
                            sizes="(min-width: 1024px) 640px, 100vw"
                            onError={() => markMediaFailed(project.id)}
                            className={`object-cover transition-transform duration-700 ${
                              isActive ? "group-hover:scale-[1.012]" : ""
                            }`}
                            style={{ objectPosition: project.focal }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {selected.video && reelVisible && !playbackError && (
                    <video
                      key={selected.video}
                      ref={videoRef}
                      src={selected.video}
                      poster={selected.image}
                      muted={isMuted}
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      onLoadedMetadata={handleVideoMetadata}
                      onTimeUpdate={(event) => {
                        setVideoTime(event.currentTarget.currentTime);
                        setVideoDuration(
                          Number.isFinite(event.currentTarget.duration)
                            ? event.currentTarget.duration
                            : 0
                        );
                      }}
                      onEnded={() => setIsPlaying(false)}
                      onError={() => {
                        setIsPlaying(false);
                        setReelVisible(false);
                        setPlaybackError(
                          "Reel tidak dapat dimuat. Menampilkan still frame."
                        );
                      }}
                      className="absolute inset-0 z-[3] h-full w-full object-cover"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-t from-[#050508]/95 via-[#050508]/10 to-[#050508]/50" />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2.5 z-[5]"
                  >
                    <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-white/25" />
                    <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-white/25" />
                    <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/25" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/25" />
                  </div>

                  {selected.video && !playbackError && (
                    <button
                      type="button"
                      onClick={togglePlayback}
                      aria-label={
                        isPlaying
                          ? `Jeda reel ${selected.title}`
                          : `Putar reel ${selected.title}`
                      }
                      className={`absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#0a0a12]/85 text-white transition-all duration-300 hover:scale-105 hover:border-white/70 ${
                        isPlaying
                          ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                          : "opacity-100"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause
                          size={18}
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      ) : (
                        <Play
                          size={18}
                          fill="currentColor"
                          className="translate-x-[1px]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )}

                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-white/[0.08] px-2.5 py-2">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => selectRelativeProject(-1)}
                    aria-label="Proyek sebelumnya"
                    title="Proyek sebelumnya"
                    className="flex h-8 w-8 items-center justify-center text-white/50 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
                  >
                    <ChevronLeft size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={togglePlayback}
                    disabled={!selected.video || Boolean(playbackError)}
                    aria-label={
                      selected.video
                        ? isPlaying
                          ? `Jeda reel ${selected.title}`
                          : `Putar reel ${selected.title}`
                        : `Reel belum tersedia untuk ${selected.title}`
                    }
                    title={
                      selected.video
                        ? undefined
                        : "Media ini berupa still frame. Reel belum dilampirkan."
                    }
                    className="flex h-8 w-9 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.08] hover:text-white disabled:border-white/[0.07] disabled:bg-transparent disabled:text-white/20"
                  >
                    {isPlaying ? (
                      <Pause size={13} fill="currentColor" aria-hidden="true" />
                    ) : (
                      <Play
                        size={13}
                        fill="currentColor"
                        className="translate-x-[1px]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRelativeProject(1)}
                    aria-label="Proyek berikutnya"
                    title="Proyek berikutnya"
                    className="flex h-8 w-8 items-center justify-center text-white/50 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
                  >
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>

                <div className="ml-auto flex items-center gap-2 font-mono text-[10px] text-white/45">
                  {playbackError ? (
                    <span className="text-[#fdba74]" title={playbackError}>
                      REEL UNAVAILABLE
                    </span>
                  ) : selected.video ? (
                    <>
                      {reelVisible && (
                        <button
                          type="button"
                          onClick={resetReel}
                          aria-label="Putar ulang reel dari awal"
                          title="Putar ulang dari awal"
                          className="hidden items-center px-1.5 py-1 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white sm:inline-flex"
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                            Restart
                          </span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsMuted((current) => !current)}
                        aria-label={
                          isMuted ? "Nyalakan suara reel" : "Bisukan reel"
                        }
                        title={isMuted ? "Nyalakan suara" : "Bisukan"}
                        className="flex h-7 w-7 items-center justify-center border border-white/10 text-white/50 transition-colors duration-200 hover:border-white/30 hover:text-white"
                      >
                        {isMuted ? (
                          <VolumeX size={12} aria-hidden="true" />
                        ) : (
                          <Volume2 size={12} aria-hidden="true" />
                        )}
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                      Still
                    </span>
                  )}
                  <span className="tabular-nums text-white/60">
                    {selected.video
                      ? reelVisible
                        ? formatTimecode(videoTime)
                        : "Reel ready"
                      : "Still frame"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                <span>{selected.category}</span>
                <span className="hidden sm:inline">{selected.format}</span>
                <span>{FPS} FPS</span>
              </div>
            </article>

            {/* ── Inspector ── */}
            <article
              ref={inspectorRef}
              data-workspace-panel
              className={`${PANEL} order-3 md:order-3 md:col-span-1 xl:order-3 xl:col-span-3`}
            >
              <PanelBar
                icon={SlidersHorizontal}
                label="Inspector"
                right={
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#a78bfa]" />
                    Linked
                  </>
                }
              />
              <div
                key={selected.id}
                className="ws-panel-in flex flex-1 flex-col p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0"
                        style={{ backgroundColor: selected.accent }}
                        aria-hidden="true"
                      />
                      <span className={`${MICRO} text-white/45`}>
                        {selected.category}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-none tracking-tight text-white">
                      {selected.title}
                    </h3>
                  </div>
                  <span className="mt-0.5 shrink-0 font-mono text-[10px] text-white/30">
                    #{selected.index}
                  </span>
                </div>

                <p className="mt-3 text-[12px] leading-relaxed text-white/55">
                  {selected.description}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-white/[0.08] pt-4">
                  {[
                    ["CLIENT", selected.client],
                    ["ROLE", selected.role],
                    ["FORMAT", selected.format],
                    ["YEAR", selected.year],
                    ["STATUS", selected.status],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className={`${MICRO} text-white/45`}>{label}</dt>
                      <dd
                        className="mt-1.5 truncate text-[11px] font-medium text-white/75"
                        title={value}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <div className={`${MICRO} text-white/45`}>TOOLKIT</div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {selected.tools.map((tool) => (
                      <span
                        key={tool}
                        className="border border-white/[0.1] bg-white/[0.03] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={(event) => {
                      caseStudyTriggerRef.current = event.currentTarget;
                      setCaseStudyId(selected.id);
                    }}
                    className="group flex w-full items-center justify-between bg-white px-3.5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111] transition-colors duration-200 hover:bg-[#e5e5e5]"
                  >
                    <span>Buka Case Study</span>
                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </article>

            {/* ── Timeline ── */}
            <article
              ref={timelineRef}
              data-workspace-panel
              className={`${PANEL} order-4 md:order-4 md:col-span-2 xl:order-4 xl:col-span-12`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#14141e] px-3 py-2">
                <div className="flex items-center gap-2">
                  <Layers
                    size={13}
                    strokeWidth={1.75}
                    className="text-[#a78bfa]"
                    aria-hidden="true"
                  />
                  <span className={`${MICRO} text-white/60`}>Timeline</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  {isScrubbing && (
                    <span className="text-[#fb923c]">Scrubbing</span>
                  )}
                  <span className="font-mono tabular-nums text-white/65">
                    {formatTimecode(playhead)}
                  </span>
                  <span className="hidden font-mono text-white/30 sm:inline">
                    / {formatTimecode(TOTAL)}
                  </span>
                </div>
              </div>

              <div className="flex">
                <div className="w-12 shrink-0 border-r border-white/[0.08] bg-[#0c0c14] sm:w-14">
                  <div className="flex h-7 items-center justify-center border-b border-white/[0.06]">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                      TC
                    </span>
                  </div>
                  {TRACKS.map((track) => (
                    <div
                      key={track.id}
                      style={{ height: track.height }}
                      className="flex flex-col items-center justify-center gap-0.5 border-b border-white/[0.05]"
                    >
                      <span className="text-[10px] font-bold tracking-[0.06em] text-white/50">
                        {track.id}
                      </span>
                      <span className="hidden text-[9px] font-semibold uppercase tracking-[0.1em] text-white/25 sm:block">
                        {track.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  ref={timelineScrollRef}
                  className="ws-timeline-scroll relative min-w-0 flex-1 overflow-x-auto"
                >
                  <div
                    ref={timelineContentRef}
                    className="relative min-w-[720px] select-none"
                  >
                    <div
                      role="slider"
                      tabIndex={0}
                      aria-label="Posisi playhead pada timeline"
                      aria-orientation="horizontal"
                      aria-valuemin={0}
                      aria-valuemax={TOTAL}
                      aria-valuenow={Number(playhead.toFixed(2))}
                      aria-valuetext={`${formatTimecode(playhead)} dari ${formatTimecode(TOTAL)}`}
                      onPointerDown={beginScrub}
                      onPointerMove={moveScrub}
                      onPointerUp={endScrub}
                      onPointerCancel={endScrub}
                      onKeyDown={handlePlayheadKeyDown}
                      className="relative h-7 cursor-ew-resize touch-none border-b border-white/[0.08] bg-[#0a0a12]"
                      style={TRACK_GRID}
                    >
                      <div className="pointer-events-none absolute inset-0">
                        {RULER_TICKS.map((tick) => (
                          <div
                            key={tick}
                            className="absolute top-0 h-full"
                            style={{ left: `${(tick / TOTAL) * 100}%` }}
                          >
                            <span
                              className={`absolute left-0 top-0 w-px ${
                                tick % 4 === 0
                                  ? "h-1.5 bg-white/25"
                                  : "h-1 bg-white/10"
                              }`}
                            />
                            {tick % 4 === 0 && tick < TOTAL && (
                              <span className="absolute left-1 top-1 font-mono text-[10px] text-white/45">
                                {formatRulerTime(tick)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {TRACKS.map((track) => (
                      <div
                        key={track.id}
                        role="group"
                        aria-label={`Track ${track.id} ${track.label}`}
                        style={{ ...TRACK_GRID, height: track.height }}
                        className="relative border-b border-white/[0.05] bg-[#0c0c14]"
                        onPointerDown={beginTrackScrub}
                        onPointerMove={moveScrub}
                        onPointerUp={endScrub}
                        onPointerCancel={endScrub}
                      >
                        {track.id === "V1" &&
                          PROJECTS.map((project) => {
                            const isActive = project.id === selected.id;
                            return (
                              <button
                                key={`v1-${project.id}`}
                                type="button"
                                ref={(node) => {
                                  if (node) clipRefs.current[project.id] = node;
                                }}
                                onClick={() => selectProject(project.id)}
                                onPointerDown={(event) =>
                                  event.stopPropagation()
                                }
                                aria-pressed={isActive}
                                aria-label={`Pilih klip ${project.title}, kategori ${project.category}`}
                                className={`group absolute inset-y-1 z-10 overflow-hidden border text-left transition-[background-color,border-color] duration-200 ${
                                  isActive
                                    ? "border-white/60"
                                    : "border-white/[0.08] hover:border-white/30"
                                }`}
                                style={{
                                  left: `calc(${(project.timeline.start / TOTAL) * 100}% + 2px)`,
                                  width: `calc(${(project.timeline.duration / TOTAL) * 100}% - 4px)`,
                                  backgroundColor: isActive
                                    ? withAlpha(project.accent, 0.26)
                                    : withAlpha(project.accent, 0.1),
                                }}
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-y-0 left-0 w-[2px]"
                                  style={{
                                    backgroundColor: project.accent,
                                    opacity: isActive ? 1 : 0.65,
                                  }}
                                />
                                <span className="flex h-full flex-col justify-between gap-1 px-2 py-1.5">
                                  <span className="truncate text-[10px] font-semibold uppercase tracking-[0.04em] text-white/90">
                                    {project.title}
                                  </span>
                                  <span className="flex items-center justify-between gap-1">
                                    <span
                                      className="truncate text-[9px] font-semibold uppercase tracking-[0.1em]"
                                      style={{
                                        color: withAlpha(project.accent, 0.95),
                                      }}
                                    >
                                      {project.category}
                                    </span>
                                    <span className="hidden shrink-0 font-mono text-[9px] text-white/35 sm:inline">
                                      {formatClipLength(
                                        project.timeline.duration
                                      )}
                                    </span>
                                  </span>
                                </span>
                              </button>
                            );
                          })}

                        {track.id === "V2" &&
                          PROJECTS.map((project) => {
                            const isActive = project.id === selected.id;
                            return (
                              <button
                                key={`v2-${project.id}`}
                                type="button"
                                onClick={() => selectProject(project.id)}
                                onPointerDown={(event) =>
                                  event.stopPropagation()
                                }
                                aria-pressed={isActive}
                                aria-label={`Pilih title clip ${project.title}`}
                                title={`Title clip, ${project.title}`}
                                className={`absolute inset-y-1 z-10 overflow-hidden border px-1.5 text-left transition-colors duration-200 ${
                                  isActive
                                    ? "border-white/50"
                                    : "border-white/[0.08] hover:border-white/25"
                                }`}
                                style={{
                                  left: `calc(${(project.titleClip.start / TOTAL) * 100}% + 2px)`,
                                  width: `calc(${(project.titleClip.duration / TOTAL) * 100}% - 4px)`,
                                  backgroundColor: withAlpha(
                                    project.accent,
                                    isActive ? 0.28 : 0.1
                                  ),
                                }}
                              >
                                <span
                                  className="block truncate text-[9px] font-semibold uppercase tracking-[0.06em]"
                                  style={{
                                    color: withAlpha(project.accent, 0.95),
                                  }}
                                >
                                  T{project.index}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    ))}

                    <div
                      className="pointer-events-none absolute inset-y-0 z-30"
                      style={{ left: `${playheadPercent}%` }}
                      aria-hidden="true"
                    >
                      <div
                        className={`absolute top-0 h-full w-px ${
                          isScrubbing ? "bg-[#fb923c]" : "bg-[#e9e5ff]"
                        }`}
                      />
                      <div
                        onPointerDown={beginScrub}
                        onPointerMove={moveScrub}
                        onPointerUp={endScrub}
                        onPointerCancel={endScrub}
                        title="Geser playhead"
                        className={`pointer-events-auto absolute -left-[5px] top-0 h-3 w-[11px] cursor-ew-resize touch-none ${
                          isScrubbing ? "bg-[#fb923c]" : "bg-[#e9e5ff]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-1 w-1 shrink-0"
                    style={{ backgroundColor: selected.accent }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{selected.title}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>{String(PROJECTS.length).padStart(2, "0")} CLIPS</span>
                  <span className="hidden sm:inline">
                    {FPS} FPS
                  </span>
                </span>
              </div>
            </article>
          </div>

          <p className="sr-only" aria-live="polite">
            Proyek terpilih: {selected.title}, kategori {selected.category}.
          </p>
        </div>
      </section>

      {caseStudyProject && (
        <CaseStudyDossier
          project={caseStudyProject}
          mediaFailed={Boolean(failedMedia[caseStudyProject.id])}
          onMediaError={() => markMediaFailed(caseStudyProject.id)}
          onClose={() => setCaseStudyId(null)}
          onContact={handleDossierContact}
          closeButtonRef={closeButtonRef}
        />
      )}
    </>
  );
}
