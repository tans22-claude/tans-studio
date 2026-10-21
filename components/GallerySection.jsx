"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { WORKSPACE_PROJECTS } from "@/lib/workspace-projects";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["SEMUA", "COLOR", "EDITORIAL", "COMMERCIAL", "KEY ART"];

function projectMatchesFilter(project, filter) {
  if (filter === "SEMUA") return true;
  return project.category.toUpperCase().includes(filter);
}

function openProject(projectId) {
  window.dispatchEvent(
    new CustomEvent("tans:select-project", { detail: projectId })
  );
  const target = document.querySelector("#workspace");
  if (!target) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

function WorkCard({ project, onOpen }) {
  const [failed, setFailed] = useState(false);

  return (
    <a
      href="#workspace"
      data-gallery-card
      onClick={(event) => {
        event.preventDefault();
        onOpen(project.id);
      }}
      className="group relative flex h-[430px] w-[82vw] shrink-0 flex-col overflow-hidden rounded-xl border border-black bg-[#4f0423] transition-colors duration-200 hover:border-[#e10600] sm:h-[470px] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#4f0423]">
            <span className="font-display text-6xl leading-none text-[#e10600]/40">
              {project.index}
            </span>
            <span className="label text-[#ffc7c6]/60">Media offline</span>
          </div>
        ) : (
          <Image
            src={project.image}
            alt={`${project.title}, ${project.category}`}
            fill
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 32vw"
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            style={{ objectPosition: project.focal }}
          />
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/20 bg-black/70 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </div>

      <div className="flex h-[104px] shrink-0 items-center justify-between gap-4 border-t border-black bg-black px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="label text-[#e10600]">{project.index}</span>
            <span className="h-px w-5 bg-[#e10600]" aria-hidden="true" />
            <span className="label truncate text-[#ffc7c6]">
              {project.category}
            </span>
          </div>
          <h3 className="mt-2 truncate font-display text-[23px] leading-none tracking-[0.02em] text-white">
            {project.title}
          </h3>
        </div>
        <span className="label shrink-0 text-white/40">{project.year}</span>
      </div>
    </a>
  );
}

export default function GallerySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const railRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("SEMUA");
  const reduce = useReducedMotion();

  const filteredProjects = useMemo(
    () =>
      WORKSPACE_PROJECTS.filter((project) =>
        projectMatchesFilter(project, activeFilter)
      ),
    [activeFilter]
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    rail.scrollTo({
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeFilter]);

  useEffect(() => {
    if (reduce || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 86%" },
        }
      );
      gsap.fromTo(
        "[data-gallery-card]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: railRef.current, start: "top 84%" },
        }
      );

      // Parallax: images inside cards drift upward on scroll
      gsap.utils.toArray("[data-gallery-card] img").forEach((img) => {
        gsap.fromTo(
          img,
          { y: "-6%" },
          {
            y: "6%",
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-gallery-card]"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // Parallax: header drifts slower than card rail
      gsap.to(headerRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce, activeFilter]);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("[data-gallery-card]");
    const distance = card ? card.getBoundingClientRect().width + 16 : 360;
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section
      id="karya"
      ref={sectionRef}
      className="section-pad relative w-full overflow-hidden bg-[#260212]"
    >
      <div ref={headerRef} className="container-page">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-[820px]">
            <p className="eyebrow mb-5">Arsip karya — 2025/26</p>
            <h2 className="display-xl text-[#e10600]">
              Karya
              <br />
              <span className="text-[#ffc7c6]">Pilihan.</span>
            </h2>
            <p className="body-copy mt-5 max-w-[440px]">
              Lima proyek dari meja grading, retouch, dan key art. Pilih satu
              untuk membuka sesinya.
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
            <div className="flex items-center gap-2">
              <span className="label text-[#ffc7c6]/55">
                {String(filteredProjects.length).padStart(2, "0")} proyek
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                aria-label="Karya sebelumnya"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#ffc7c6]/30 text-[#ffc7c6] transition-colors hover:border-[#e10600] hover:bg-[#e10600] hover:text-white"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                aria-label="Karya berikutnya"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#ffc7c6]/30 text-[#ffc7c6] transition-colors hover:border-[#e10600] hover:bg-[#e10600] hover:text-white"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter karya">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className="pill-toggle"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <div
          ref={railRef}
          className="ws-scroll flex gap-4 overflow-x-auto px-5 pb-3 md:px-8 xl:px-[max(2rem,calc((100vw-1280px)/2+2rem))]"
        >
          {filteredProjects.map((project) => (
            <WorkCard key={project.id} project={project} onOpen={openProject} />
          ))}
          <div aria-hidden="true" className="w-1 shrink-0" />
        </div>
      </div>
    </section>
  );
}
