"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Current mouse position
    let mx = -100, my = -100;
    // Trailing ring position (lerped)
    let tx = -100, ty = -100;
    let isHovering = false;
    let isClicking = false;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Direct DOM update for the inner dot — zero lag
      inner.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;

      const target = e.target as HTMLElement;
      const hoverable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.hasAttribute("data-cursor") ||
        target.closest("[data-cursor]") ||
        window.getComputedStyle(target).cursor === "pointer";

      const nowHovering = !!hoverable;
      if (nowHovering !== isHovering) {
        isHovering = nowHovering;
        inner.style.width = isHovering ? "14px" : "10px";
        inner.style.height = isHovering ? "14px" : "10px";
        inner.style.backgroundColor = isHovering ? "#64FFDA" : "#ffffff";
        outer.style.width = isHovering ? "52px" : "38px";
        outer.style.height = isHovering ? "52px" : "38px";
        outer.style.borderColor = isHovering
          ? "rgba(100,255,218,0.8)"
          : "rgba(100,255,218,0.35)";
      }
    };

    const onDown = () => {
      isClicking = true;
      inner.style.width = "8px";
      inner.style.height = "8px";
      inner.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };

    const onUp = () => {
      isClicking = false;
      inner.style.width = isHovering ? "14px" : "10px";
      inner.style.height = isHovering ? "14px" : "10px";
    };

    // RAF loop ONLY for the trailing outer ring (lerp)
    const loop = () => {
      // Lerp factor: 0.25 = fast catch-up, smooth trail
      tx += (mx - tx) * 0.25;
      ty += (my - ty) * 0.18;
      const halfSize = isHovering ? 26 : 19;
      outer.style.transform = `translate(${tx - halfSize}px, ${ty - halfSize}px)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      {/* Outer trailing ring */}
      <div
        ref={outerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "1px solid rgba(100,255,218,0.35)",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
          willChange: "transform",
        }}
      />
      {/* Inner dot — zero lag, follows mouse directly */}
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          transition: "width 0.15s ease, height 0.15s ease, background-color 0.15s ease",
          willChange: "transform",
        }}
      />
    </div>
  );
}
