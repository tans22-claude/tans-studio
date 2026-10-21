"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
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

const RULER_TICKS = Array.from(
  { length: TOTAL / 2 + 1 },
  (_, index) => index * 2
);

const TRACKS = [
  { id: "V2", label: "TITLE", height: 24 },
  { id: "V1", label: "VIDEO", height: 56 },
];

const TRACK_GRID = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,199,198,0.07) 1px, transparent 1px)",
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

function PanelHeader({ icon: Icon, label, right }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-black/80 bg-[#4f0423] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          size={12}
          strokeWidth={1.8}
          className="shrink-0 text-[#ffc7c6]"
          aria-hidden="true"
        />
        <span className="label truncate text-[#ffc7c6]">{label}</span>
      </div>
      {right ? <div className="label shrink-0 text-white/45">{right}</div> : null}
    </div>
  );
}

function MediaThumb({ project, failed, onError, className = "" }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden border border-black bg-[#4f0423] ${className}`}
    >
      {failed ? (
        <span className="absolute inset-0 flex items-center justify-center font-display text-lg text-[#e10600]">
          {project.index}
        </span>
      ) : (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="72px"
          onError={onError}
          className="object-cover"
          style={{ objectPosition: project.focal }}
        />
      )}
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
    ["Brief", caseStudy.brief],
    ["Approach", caseStudy.approach],
    ["Outcome", caseStudy.outcome],
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/85">
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
          className="ws-dialog-in relative w-full max-w-5xl overflow-hidden rounded-xl border border-black bg-[#260212]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup studi kasus"
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/25 bg-black text-white transition-colors hover:border-[#e10600] hover:bg-[#e10600]"
          >
            <X size={15} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className="grid md:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[240px] overflow-hidden bg-[#1a0208] md:min-h-[560px]">
              {mediaFailed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#4f0423]">
                  <span className="font-display text-6xl leading-none text-[#e10600]/45">
                    {project.index}
                  </span>
                  <span className="label text-[#ffc7c6]/60">Media offline</span>
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
              <div className="absolute inset-x-0 bottom-0 border-t border-black bg-black px-4 py-3">
                <p className="label text-[#ffc7c6]">
                  {project.category} — {project.year}
                </p>
              </div>
            </div>

            <div className="ws-dialog-scroll p-5 sm:p-7 md:max-h-[82vh] md:overflow-y-auto md:p-8">
              <div className="mt-1 flex items-start justify-between gap-3 pr-9 md:pr-0">
                <div className="min-w-0">
                  <p className="label text-[#e10600]">Sesi {project.index}</p>
                  <h3
                    id="dossier-title"
                    className="mt-2 font-display text-[34px] leading-[0.9] tracking-[0.015em] text-white sm:text-[42px]"
                  >
                    {project.title}
                  </h3>
                </div>
              </div>

              <p
                id="dossier-summary"
                className="mt-4 text-[13px] leading-relaxed text-[#ffc7c6]"
              >
                {caseStudy.summary}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-black py-4">
                {[
                  ["Client", project.client],
                  ["Role", project.role],
                  ["Format", project.format],
                  ["Status", project.status],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <div className="label text-[#ffc7c6]/50">{label}</div>
                    <div
                      className="mt-1.5 truncate text-[12px] text-white/80"
                      title={value}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {sections.map(([label, body]) => (
                  <div key={label}>
                    <div className="label text-[#e10600]">{label}</div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">
                      {body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="label text-[#ffc7c6]/50">Deliverables</div>
                  <ul className="mt-2 space-y-1.5">
                    {caseStudy.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[11px] leading-relaxed text-white/65"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[6px] h-1 w-1 shrink-0 bg-[#e10600]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="label text-[#ffc7c6]/50">Toolkit</div>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {project.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded-[5px] border border-[#ffc7c6]/20 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#ffc7c6]"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2 border-t border-black pt-5 sm:flex-row">
                <a
                  href="#kontak"
                  onClick={onContact}
                  className="btn-primary flex-1 !text-[11px]"
                >
                  Diskusikan Proyek
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost !text-[11px]"
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
  const mediaRef = useRef(null);
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
    setPlayhead(project.timeline.start + 0.5);
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
    if (!video) return;
    video.currentTime = 0;
    setVideoTime(0);
    setIsPlaying(true);
    setReelVisible(true);
  };

  const handleVideoMetadata = (event) => {
    const video = event.currentTarget;
    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
    if (!video.videoWidth || !video.videoHeight) {
      setIsPlaying(false);
      setReelVisible(false);
      setPlaybackError("Reel tidak didukung browser ini.");
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
      event.preventDefault();
      scrubbingRef.current = true;
      setIsScrubbing(true);
      updatePlayheadFromPointer(event.clientX);
    },
    [updatePlayheadFromPointer]
  );

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
      if (window.__lenis && target) {
        window.__lenis.scrollTo(target, { duration: 1.2 });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 180);
  };

  useEffect(() => {
    const handleSelect = (event) => {
      if (event.detail) selectProject(event.detail);
    };
    window.addEventListener("tans:select-project", handleSelect);
    return () =>
      window.removeEventListener("tans:select-project", handleSelect);
  }, [selectProject]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (scrubbingRef.current) updatePlayheadFromPointer(event.clientX);
    };
    const stopScrub = () => {
      if (!scrubbingRef.current) return;
      scrubbingRef.current = false;
      setIsScrubbing(false);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopScrub);
    window.addEventListener("pointercancel", stopScrub);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopScrub);
      window.removeEventListener("pointercancel", stopScrub);
    };
  }, [updatePlayheadFromPointer]);

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
          mediaRef.current,
          previewRef.current,
          inspectorRef.current,
          timelineRef.current,
        ].filter(Boolean);
        if (!headerRef.current || panels.length === 0) return;

        gsap.set([headerRef.current, ...panels], { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });
        tl.fromTo(
          headerRef.current,
          { y: 26 },
          { y: 0, autoAlpha: 1, duration: 0.6 }
        ).fromTo(
          panels,
          { y: 30 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 },
          "-=0.25"
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
          setPlaybackError("Reel tidak dapat diputar.");
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
    const previousOverflow = document.body.style.overflow;
    window.__lenis?.stop();
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
      window.__lenis?.start();
      trigger?.focus?.({ preventScroll: true });
    };
  }, [caseStudyId]);

  const PANEL =
    "relative flex min-w-0 flex-col overflow-hidden border border-black bg-[#260212]";

  return (
    <>
      <section
        id="workspace"
        ref={sectionRef}
        aria-labelledby="workspace-title"
        className="tans-workspace section-pad relative w-full overflow-hidden border-y border-black"
      >
        <div className="container-page">
          <div
            ref={headerRef}
            className="flex flex-col justify-between gap-6 pb-8 md:flex-row md:items-end"
          >
            <div>
              <p className="eyebrow mb-4">Ruang edit — sesi 01/05</p>
              <h2
                id="workspace-title"
                className="display-xl text-white"
              >
                Ruang <span className="text-[#e10600]">Edit.</span>
              </h2>
            </div>
            <p className="body-copy max-w-[360px] md:text-right">
              Pilih proyek, geser playhead, lalu buka catatan produksinya.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-black bg-[#1a0208]">
            <div className="flex items-center justify-between gap-3 border-b border-black bg-black px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#e10600]" aria-hidden="true" />
                <span className="label text-[#ffc7c6]">
                  TANS / Session room
                </span>
              </div>
              <div className="label hidden text-white/40 sm:block">
                {String(PROJECTS.length).padStart(2, "0")} assets — {FPS} fps
              </div>
              <span className="label tabular-nums text-white/70">
                {formatTimecode(playhead)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2 lg:grid-cols-12">
              {/* Media pool */}
              <article
                ref={mediaRef}
                className={`${PANEL} order-2 md:order-2 md:col-span-1 lg:order-1 lg:col-span-3`}
              >
                <PanelHeader
                  icon={FolderOpen}
                  label="Media pool"
                  right={`${String(PROJECTS.length).padStart(2, "0")} klip`}
                />
                <ul className="flex-1 divide-y divide-black/70">
                  {PROJECTS.map((project) => {
                    const isActive = project.id === selected.id;
                    return (
                      <li key={project.id}>
                        <button
                          type="button"
                          onClick={() => selectProject(project.id)}
                          aria-pressed={isActive}
                          aria-label={`Pilih proyek ${project.title}`}
                          className={`group relative flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition-colors duration-200 ${
                            isActive
                              ? "bg-[#4f0423]"
                              : "hover:bg-[#4f0423]/55"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-2 left-0 w-[2px] bg-[#e10600] transition-opacity duration-200"
                            style={{ opacity: isActive ? 1 : 0 }}
                          />
                          <MediaThumb
                            project={project}
                            failed={Boolean(failedMedia[project.id])}
                            onError={() => markMediaFailed(project.id)}
                            className="h-11 w-[64px]"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-2">
                              <span className="label shrink-0 text-[#e10600]">
                                {project.index}
                              </span>
                              <span
                                className={`truncate text-[12px] leading-tight ${
                                  isActive ? "text-white" : "text-white/80"
                                }`}
                              >
                                {project.title}
                              </span>
                            </span>
                            <span className="mt-1.5 block truncate label text-[#ffc7c6]/55">
                              {project.category}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto flex items-center gap-2 border-t border-black px-3 py-2.5">
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 bg-[#e10600]"
                  />
                  <span className="label text-[#ffc7c6]/35">
                    Panel tersinkron
                  </span>
                </div>
              </article>

              {/* Program monitor */}
              <article
                ref={previewRef}
                className={`${PANEL} order-1 md:order-1 md:col-span-2 lg:order-2 lg:col-span-6`}
              >
                <PanelHeader
                  icon={Play}
                  label="Program monitor"
                  right="16:9"
                />

                <div className="group relative aspect-video w-full overflow-hidden bg-[#1a0208]">
                  {PROJECTS.map((project) => {
                    const isActive = project.id === selected.id;
                    return (
                      <div
                        key={project.id}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "z-[2] scale-100 opacity-100"
                            : "z-[1] scale-[1.03] opacity-0"
                        }`}
                      >
                        {failedMedia[project.id] ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#4f0423]">
                            <span className="font-display text-6xl leading-none text-[#e10600]/45">
                              {project.index}
                            </span>
                            <span className="label text-[#ffc7c6]/55">
                              Media offline
                            </span>
                          </div>
                        ) : (
                          <Image
                            src={project.image}
                            alt={`${project.title}, pratinjau proyek`}
                            fill
                            priority={project.index === "01"}
                            sizes="(min-width: 1024px) 640px, 100vw"
                            onError={() => markMediaFailed(project.id)}
                            className={`object-cover transition-transform duration-700 ${
                              isActive ? "group-hover:scale-[1.01]" : ""
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

                  <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] flex items-start justify-between gap-2 p-2.5">
                    <span className="label bg-black/80 px-2 py-1.5 text-[#ffc7c6]">
                      {selected.index} / {selected.category}
                    </span>
                    <span className="label bg-black/80 px-2 py-1.5 text-white/60">
                      {reelVisible ? "Reel" : "Still"}
                    </span>
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
                      className={`absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[15px] border border-black bg-[#e10600] text-white transition-opacity duration-200 hover:bg-[#b80500] ${
                        isPlaying
                          ? "opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                          : "opacity-100"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause size={17} fill="currentColor" aria-hidden="true" />
                      ) : (
                        <Play
                          size={17}
                          fill="currentColor"
                          className="translate-x-[1px]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-black px-2.5 py-2">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => selectRelativeProject(-1)}
                      aria-label="Proyek sebelumnya"
                      className="flex h-8 w-8 items-center justify-center rounded-[7px] text-white/55 transition-colors hover:bg-[#4f0423] hover:text-white"
                    >
                      <ChevronLeft size={15} aria-hidden="true" />
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
                      className="flex h-8 w-9 items-center justify-center rounded-[7px] border border-[#ffc7c6]/25 text-white/85 transition-colors hover:border-[#e10600] hover:bg-[#e10600] disabled:border-white/10 disabled:text-white/20"
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
                      className="flex h-8 w-8 items-center justify-center rounded-[7px] text-white/55 transition-colors hover:bg-[#4f0423] hover:text-white"
                    >
                      <ChevronRight size={15} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    {playbackError ? (
                      <span className="label text-[#e10600]">Reel offline</span>
                    ) : selected.video ? (
                      <>
                        {reelVisible && (
                          <button
                            type="button"
                            onClick={resetReel}
                            className="label hidden px-1.5 py-1 text-white/40 transition-colors hover:text-white sm:inline-flex"
                          >
                            Restart
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsMuted((current) => !current)}
                          aria-label={
                            isMuted ? "Nyalakan suara reel" : "Bisukan reel"
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-[#ffc7c6]/20 text-white/55 transition-colors hover:border-[#ffc7c6]/50 hover:text-white"
                        >
                          {isMuted ? (
                            <VolumeX size={12} aria-hidden="true" />
                          ) : (
                            <Volume2 size={12} aria-hidden="true" />
                          )}
                        </button>
                      </>
                    ) : null}
                    <span className="label tabular-nums text-white/55">
                      {selected.video
                        ? reelVisible
                          ? formatTimecode(videoTime)
                          : "Reel ready"
                        : "Still frame"}
                    </span>
                  </div>
                </div>
              </article>

              {/* Inspector */}
              <article
                ref={inspectorRef}
                className={`${PANEL} order-3 md:order-3 md:col-span-1 lg:order-3 lg:col-span-3`}
              >
                <PanelHeader
                  icon={SlidersHorizontal}
                  label="Inspector"
                  right="Linked"
                />
                <div
                  key={selected.id}
                  className="ws-panel-in flex flex-1 flex-col p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="label text-[#e10600]">
                        {selected.category}
                      </span>
                      <h3 className="mt-2 font-display text-[28px] leading-[0.92] tracking-[0.015em] text-white">
                        {selected.title}
                      </h3>
                    </div>
                    <span className="label shrink-0 text-white/25">
                      {selected.index}
                    </span>
                  </div>

                  <p className="mt-3 text-[12px] leading-relaxed text-[#ffc7c6]/80">
                    {selected.description}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-black pt-4">
                    {[
                      ["Client", selected.client],
                      ["Year", selected.year],
                      ["Role", selected.role],
                      ["Format", selected.format],
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="label text-[#ffc7c6]/45">{label}</dt>
                        <dd
                          className="mt-1.5 truncate text-[11px] text-white/75"
                          title={value}
                        >
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 border-t border-black pt-4">
                    <div className="label text-[#ffc7c6]/45">Toolkit</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selected.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-[5px] border border-[#ffc7c6]/20 px-2 py-1 text-[9px] uppercase tracking-[0.08em] text-[#ffc7c6]/85"
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
                      className="btn-primary group flex w-full !text-[11px]"
                    >
                      Buka Studi Kasus
                      <ArrowUpRight
                        size={13}
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </article>

              {/* Timeline */}
              <article
                ref={timelineRef}
                className={`${PANEL} order-4 md:order-4 md:col-span-2 lg:col-span-12`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-black bg-[#4f0423] px-3 py-2">
                  <span className="label text-[#ffc7c6]">Timeline</span>
                  <div className="flex items-center gap-3">
                    {isScrubbing && (
                      <span className="label text-[#e10600]">Scrub</span>
                    )}
                    <span className="label tabular-nums text-white/70">
                      {formatTimecode(playhead)} / {formatTimecode(TOTAL)}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-11 shrink-0 border-r border-black bg-[#1f0210] sm:w-14">
                    <div className="flex h-7 items-center justify-center border-b border-black/70">
                      <span className="label text-white/35">TC</span>
                    </div>
                    {TRACKS.map((track) => (
                      <div
                        key={track.id}
                        style={{ height: track.height }}
                        className="flex flex-col items-center justify-center gap-0.5 border-b border-black/60"
                      >
                        <span className="text-[9px] font-bold tracking-[0.08em] text-[#ffc7c6]/60">
                          {track.id}
                        </span>
                        <span className="hidden label text-[8px] text-white/25 sm:block">
                          {track.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    ref={timelineScrollRef}
                    className="ws-scroll touch-pan-x relative min-w-0 flex-1 overflow-x-auto"
                  >
                    <div
                      ref={timelineContentRef}
                      className="relative min-w-[760px] select-none"
                    >
                      <div
                        role="slider"
                        tabIndex={0}
                        aria-label="Posisi playhead"
                        aria-orientation="horizontal"
                        aria-valuemin={0}
                        aria-valuemax={TOTAL}
                        aria-valuenow={Number(playhead.toFixed(2))}
                        aria-valuetext={`${formatTimecode(
                          playhead
                        )} dari ${formatTimecode(TOTAL)}`}
                        onPointerDown={beginScrub}
                        onKeyDown={handlePlayheadKeyDown}
                        className="relative h-7 cursor-ew-resize touch-none border-b border-black bg-[#1a0208]"
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
                                    ? "h-1.5 bg-[#ffc7c6]/30"
                                    : "h-1 bg-white/10"
                                }`}
                              />
                              {tick % 8 === 0 && tick < TOTAL && (
                                <span className="absolute left-1 top-1.5 font-mono text-[9px] text-[#ffc7c6]/45">
                                  {`00:${pad(tick)}`}
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
                          className="relative border-b border-black/60 bg-[#1f0210]"
                          onPointerDown={beginTrackScrub}
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
                                  aria-label={`Pilih klip ${project.title}`}
                                  className={`group absolute inset-y-1 z-10 overflow-hidden rounded-[3px] border px-2 text-left transition-colors duration-200 ${
                                    isActive
                                      ? "border-[#e10600] bg-[#e10600] text-white"
                                      : "border-black bg-[#4f0423] text-[#ffc7c6] hover:border-[#e10600]"
                                  }`}
                                  style={{
                                    left: `calc(${
                                      (project.timeline.start / TOTAL) * 100
                                    }% + 2px)`,
                                    width: `calc(${
                                      (project.timeline.duration / TOTAL) * 100
                                    }% - 4px)`,
                                  }}
                                >
                                  <span className="flex h-full items-center gap-1.5">
                                    <span
                                      aria-hidden="true"
                                      className={`h-1.5 w-1.5 shrink-0 ${
                                        isActive
                                          ? "bg-white"
                                          : "bg-[#e10600]"
                                      }`}
                                    />
                                    <span className="truncate text-[10px] font-medium uppercase tracking-[0.04em]">
                                      {project.title}
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
                                  className={`absolute inset-y-0.5 z-10 overflow-hidden rounded-[2px] border px-1.5 text-left transition-colors duration-200 ${
                                    isActive
                                      ? "border-[#ffc7c6] bg-[#ffc7c6] text-[#260212]"
                                      : "border-[#ffc7c6]/25 text-[#ffc7c6]/70 hover:border-[#ffc7c6]"
                                  }`}
                                  style={{
                                    left: `calc(${
                                      (project.titleClip.start / TOTAL) * 100
                                    }% + 2px)`,
                                    width: `calc(${
                                      (project.titleClip.duration / TOTAL) * 100
                                    }% - 4px)`,
                                  }}
                                >
                                  <span className="block truncate text-[8px] font-bold uppercase tracking-[0.08em]">
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
                            isScrubbing ? "bg-[#e10600]" : "bg-[#ffc7c6]"
                          }`}
                        />
                        <div
                          className={`absolute -left-[5px] top-0 h-3 w-[11px] ${
                            isScrubbing ? "bg-[#ffc7c6]" : "bg-[#e10600]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-black px-3 py-2.5">
                  <span className="label shrink-0 text-[#ffc7c6]/45">
                    Playhead
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={TOTAL}
                    step={0.1}
                    value={playhead}
                    onChange={(event) =>
                      setPlayhead(Number(event.target.value))
                    }
                    aria-label="Posisi playhead"
                    aria-valuetext={formatTimecode(playhead)}
                    className="ws-range"
                  />
                  <span className="label w-[74px] shrink-0 text-right tabular-nums text-white/55">
                    {formatTimecode(playhead)}
                  </span>
                </div>
              </article>
            </div>
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
