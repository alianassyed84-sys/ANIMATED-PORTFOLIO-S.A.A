"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const canvas = trailRef.current;
    if (!outer || !inner || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    let mx = -200, my = -200;
    let tx = -200, ty = -200;
    let isHovering = false;
    let rafId: number;

    // Comet trail particles
    const particles: {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number;
      color: string;
    }[] = [];

    const COLORS = ["#64FFDA", "#00E5FF", "#3b82f6", "#b794f6", "#ffffff"];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      inner.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;

      // Spawn comet particles at cursor
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.5,
          life: 0,
          maxLife: 20 + Math.random() * 20,
          size: Math.random() * 3 + 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }

      const target = e.target as HTMLElement;
      const nowHovering = !!(
        target.tagName === "A" || target.tagName === "BUTTON" ||
        target.closest("a") || target.closest("button") ||
        target.hasAttribute("data-cursor") || target.closest("[data-cursor]") ||
        window.getComputedStyle(target).cursor === "pointer"
      );
      if (nowHovering !== isHovering) {
        isHovering = nowHovering;
        inner.style.width = isHovering ? "14px" : "10px";
        inner.style.height = isHovering ? "14px" : "10px";
        inner.style.backgroundColor = isHovering ? "#64FFDA" : "#ffffff";
        outer.style.width = isHovering ? "56px" : "40px";
        outer.style.height = isHovering ? "56px" : "40px";
        outer.style.borderColor = isHovering ? "rgba(100,255,218,0.9)" : "rgba(100,255,218,0.4)";
        outer.style.boxShadow = isHovering
          ? "0 0 20px rgba(100,255,218,0.5), 0 0 40px rgba(100,255,218,0.2)"
          : "0 0 8px rgba(100,255,218,0.2)";
      }
    };

    const onDown = () => {
      inner.style.width = "6px";
      inner.style.height = "6px";
      // Explosion of particles on click
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: mx, y: my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          size: Math.random() * 4 + 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };
    const onUp = () => {
      inner.style.width = isHovering ? "14px" : "10px";
      inner.style.height = isHovering ? "14px" : "10px";
    };

    const loop = () => {
      // Lerp outer ring
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.15;
      const halfSize = isHovering ? 28 : 20;
      outer.style.transform = `translate(${tx - halfSize}px, ${ty - halfSize}px)`;

      // Draw particles on canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // subtle gravity
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life++;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        const alpha = (1 - p.life / p.maxLife) * 0.85;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

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
      {/* Particle trail canvas */}
      <canvas
        ref={trailRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Outer trailing ring */}
      <div
        ref={outerRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: 40, height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(100,255,218,0.4)",
          boxShadow: "0 0 8px rgba(100,255,218,0.2)",
          background: "radial-gradient(circle, rgba(100,255,218,0.04) 0%, transparent 70%)",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          willChange: "transform",
        }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: 10, height: 10,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          transition: "width 0.12s ease, height 0.12s ease, background-color 0.12s ease",
          willChange: "transform",
        }}
      />
    </div>
  );
}
