"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LetterReveal from "@/components/ui/letter-reveal";
import { VIDEO_PROJECTS } from "@/lib/video-projects";

gsap.registerPlugin(ScrollTrigger);

export default function VideoProjectsSection() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const videoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState({});

  useEffect(() => {
    const panels = Array.from(
      trackRef.current?.querySelectorAll("[data-video-panel]") ?? []
    );
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute("data-index"));
          if (Number.isFinite(index)) setActiveIndex(index);
        });
      },
      { threshold: 0.6 }
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      video.muted = muted;
      if (index === activeIndex) {
        const play = video.play();
        if (play) play.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, muted]);

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => video?.pause());
    };
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!pin || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (progress) {
          gsap.fromTo(
            progress,
            { width: "0%" },
            {
              width: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        const panels = gsap.utils.toArray(".video-panel", track);
        panels.forEach((panel) => {
          const left = panel.querySelector("[data-parallax='left']");
          const media = panel.querySelector("[data-parallax='media']");
          const right = panel.querySelector("[data-parallax='right']");

          const shift = (element, xPercent) => {
            if (!element) return;
            gsap.to(element, {
              xPercent,
              ease: "none",
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: "left right",
                end: "right left",
                scrub: 1.2,
              },
            });
          };

          shift(left, -6);
          shift(media, -3);
          shift(right, 6);
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="video"
      aria-labelledby="video-title"
      className="video-projects on-navy relative"
    >
      <div className="shell pb-12 pt-20 md:pb-16 md:pt-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Motion archive — 2025 / 2026</p>
            <LetterReveal
              as="h2"
              id="video-title"
              className="display mt-5 text-bone"
              lines={[{ text: "Video" }, { text: "Projects." }]}
            />
          </div>
          <p className="body-copy max-w-[380px] md:pb-2 md:text-right">
            Dua potongan dari meja edit: eksperimen warna, ritme, dan materi
            yang belum selesai.
          </p>
        </div>
      </div>

      <div ref={pinRef} className="video-pin">
        <div ref={trackRef} className="video-track no-scrollbar">
          {VIDEO_PROJECTS.map((project, index) => (
            <article
              key={project.id}
              data-video-panel
              data-index={index}
              aria-label={`${project.index} dari ${VIDEO_PROJECTS.length}: ${project.title}`}
              className="video-panel"
            >
              <div className="video-panel-inner">
                <div data-parallax="left" className="video-copy-left">
                  <p className="eyebrow text-bone/45">[{project.index}]</p>
                  <h3 className="heading mt-4 text-bone">{project.title}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-bone/70">
                    {project.category}
                  </p>
                  <p className="mt-10 hidden text-[10px] uppercase tracking-[0.08em] text-bone/40 md:block">
                    {project.year} — {project.role}
                  </p>
                </div>

                <div data-parallax="media" className="video-media">
                  <div className="video-frame">
                    {failed[project.id] ? (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-charcoal px-6 text-center">
                        <span className="eyebrow text-bone/50">
                          Media unavailable
                        </span>
                        <span className="text-[15px] text-bone/80">
                          {project.title}
                        </span>
                      </div>
                    ) : (
                      <video
                        ref={(node) => {
                          videoRefs.current[index] = node;
                        }}
                        src={project.src}
                        muted={muted}
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={`Cuplikan ${project.title}`}
                        onCanPlay={(event) => {
                          if (index === activeIndex) {
                            const play = event.currentTarget.play();
                            if (play) play.catch(() => {});
                          }
                        }}
                        onError={() =>
                          setFailed((current) => ({
                            ...current,
                            [project.id]: true,
                          }))
                        }
                      />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.08em] text-bone/40">
                    <span>{project.placeholder ? "Work in progress" : "Selected work"}</span>
                    <span>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(VIDEO_PROJECTS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div data-parallax="right" className="video-copy-right">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="body-copy mt-6">{project.description}</p>

                  <dl className="mt-10 border-t border-bone/15 pt-6 text-[15px]">
                    <div className="flex items-center justify-between gap-4 border-b border-bone/10 py-2.5">
                      <dt className="text-bone/45">Year</dt>
                      <dd>{project.year}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-bone/10 py-2.5">
                      <dt className="text-bone/45">Role</dt>
                      <dd>{project.role}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-2.5">
                      <dt className="text-bone/45">Format</dt>
                      <dd>16:9 / stereo</dd>
                    </div>
                  </dl>

                  {project.placeholder && (
                    <span className="tag tag--accent mt-6">Placeholder</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="video-progress">
          <span className="eyebrow text-bone/45">
            [{String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(VIDEO_PROJECTS.length).padStart(2, "0")}]
          </span>
          <div className="video-progress-track">
            <div ref={progressRef} className="video-progress-bar" />
          </div>
          <button
            type="button"
            onClick={() => setMuted((current) => !current)}
            aria-pressed={!muted}
            className="eyebrow shrink-0 text-bone/60 transition-colors hover:text-bone"
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
          <span className="eyebrow hidden shrink-0 text-bone/35 md:inline">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
