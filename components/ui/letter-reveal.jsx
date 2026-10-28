"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

function normalizeLine(line) {
  if (typeof line === "string") return { text: line };
  return line;
}

export default function LetterReveal({
  as: Tag = "span",
  lines = [],
  className = "",
  start = "top 80%",
  stagger = 0.026,
  ...rest
}) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const normalized = lines.map(normalizeLine);
  const plainText = normalized.map((line) => line.text).join(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;

    const chars = root.querySelectorAll(".letter-char");
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          yPercent: 115,
          rotate: 4,
          opacity: 0,
          filter: "blur(6px)",
        },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power4.out",
          stagger,
          scrollTrigger: {
            trigger: root,
            start,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduce, stagger, start]);

  return (
    <Tag ref={rootRef} className={className} {...rest}>
      <span className="sr-only">{plainText}</span>
      <span aria-hidden="true" className="block">
        {normalized.map((line, lineIndex) => {
          const words = line.text.split(" ").filter(Boolean);

          return (
            <span
              key={`${lineIndex}-${line.text}`}
              className={`letter-line ${line.className ?? ""}`}
            >
              {words.map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`}>
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char, charIndex) => (
                      <span
                        key={`${char}-${charIndex}`}
                        className="letter-char"
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
