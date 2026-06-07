"use client";

import { useEffect, useRef, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  glitchInterval?: number; // ms between glitch bursts
}

export default function GlitchText({
  text,
  className = "",
  tag: Tag = "h2",
  glitchInterval = 3500,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerGlitch = () => {
    setIsGlitching(true);
    if (glitchRef.current) clearTimeout(glitchRef.current);
    // Glitch lasts 600ms
    glitchRef.current = setTimeout(() => setIsGlitching(false), 600);
  };

  useEffect(() => {
    timerRef.current = setInterval(triggerGlitch, glitchInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (glitchRef.current) clearTimeout(glitchRef.current);
    };
  }, [glitchInterval]);

  return (
    <Tag
      className={`relative select-none ${className}`}
      onMouseEnter={triggerGlitch}
      data-text={text}
      style={{ display: "inline-block" }}
    >
      {/* Red channel */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          color: "#ff0055",
          clipPath: isGlitching
            ? `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`
            : "inset(100% 0 100% 0)",
          transform: isGlitching
            ? `translate(${(Math.random() - 0.5) * 8}px, ${(Math.random() - 0.5) * 4}px)`
            : "none",
          transition: "clip-path 0.05s step-end, transform 0.05s step-end",
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>

      {/* Cyan channel */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          color: "#00e5ff",
          clipPath: isGlitching
            ? `inset(${Math.random() * 50}% 0 ${Math.random() * 30}% 0)`
            : "inset(100% 0 100% 0)",
          transform: isGlitching
            ? `translate(${(Math.random() - 0.5) * -6}px, ${(Math.random() - 0.5) * 6}px)`
            : "none",
          transition: "clip-path 0.08s step-end, transform 0.08s step-end",
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>

      {/* Main text */}
      <span className="relative">{text}</span>
    </Tag>
  );
}
