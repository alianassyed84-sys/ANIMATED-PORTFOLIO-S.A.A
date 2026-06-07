"use client";

import { useRef, useEffect, useState } from "react";

const ORBITS = [
  {
    radius: 100,
    speed: 0.5,        // radians per second
    tilt: 0.28,        // cos(tilt) for ellipse Y compression
    color: "#64FFDA",
    skills: ["React", "Next.js", "TypeScript"],
  },
  {
    radius: 158,
    speed: 0.32,
    tilt: 0.55,
    color: "#818CF8",
    skills: ["Python", "TensorFlow", "Firebase", "Node.js"],
  },
  {
    radius: 218,
    speed: 0.2,
    tilt: 0.42,
    color: "#C084FC",
    skills: ["Computer Vision", "Tailwind", "PostgreSQL", "Git"],
  },
  {
    radius: 282,
    speed: 0.12,
    tilt: 0.65,
    color: "#60A5FA",
    skills: ["OpenCV", "Framer Motion", "MongoDB", "Linux", "REST APIs"],
  },
];

// Polyfill for roundRect
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export default function SkillSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [size, setSize] = useState(640);

  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.offsetWidth ?? 640;
      setSize(Math.min(w, 680));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.scale(dpr, dpr);

    const CX = size / 2;
    const CY = size / 2;
    const SC = size / 640; // scale factor

    // ── Stars ──
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * size,
      y: Math.random() * size,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.8,
    }));

    // ── Meteors ──
    type Meteor = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };
    const meteors: Meteor[] = [];
    const COLORS = ["#64FFDA", "#818CF8", "#C084FC", "#60A5FA", "#ffffff"];
    let lastMeteor = 0;

    function spawnMeteor(now: number) {
      if (now - lastMeteor < 1400) return;
      lastMeteor = now;
      const angle = Math.random() * Math.PI * 2;
      const dist = size * 0.48;
      const speed = (2.5 + Math.random() * 2.5) * SC;
      meteors.push({
        x: CX + Math.cos(angle) * dist,
        y: CY + Math.sin(angle) * dist,
        vx: -Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        life: 0,
        maxLife: 30 + Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    // pill hit-boxes for hover detection
    type PillBox = { label: string; x: number; y: number; w: number; h: number };
    let pillBoxes: PillBox[] = [];

    let hoveredNow: string | null = null;

    function draw(ts: number) {
      const t = ts * 0.001; // seconds
      ctx.clearRect(0, 0, size, size);

      // ── Background: deep space ──
      const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, size * 0.7);
      bg.addColorStop(0, "rgba(8,18,48,1)");
      bg.addColorStop(0.6, "rgba(4,10,30,1)");
      bg.addColorStop(1, "rgba(2,6,18,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      // ── Starfield ──
      for (const s of stars) {
        const a = s.alpha * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#AADEFF";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Meteors ──
      spawnMeteor(ts);
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        if (m.life >= m.maxLife) { meteors.splice(i, 1); continue; }
        const a = 1 - m.life / m.maxLife;
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 7, m.y - m.vy * 7);
        g.addColorStop(0, m.color);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = a;
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.8 * SC;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 7, m.y - m.vy * 7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ── Orbit ellipses + Pills ──
      const newBoxes: PillBox[] = [];
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      hoveredNow = null;

      for (const orbit of ORBITS) {
        const rx = orbit.radius * SC;
        const ry = rx * orbit.tilt;

        // Ellipse ring
        ctx.save();
        ctx.translate(CX, CY);
        const ringA = 0.1 + 0.04 * Math.sin(t * 0.7);
        ctx.strokeStyle = orbit.color;
        ctx.globalAlpha = ringA;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 14;
        ctx.shadowColor = orbit.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();

        // Pills
        for (let si = 0; si < orbit.skills.length; si++) {
          const skill = orbit.skills[si];
          const baseAngle = (si / orbit.skills.length) * Math.PI * 2;
          const angle = baseAngle + t * orbit.speed;

          // Ellipse position
          const px = CX + Math.cos(angle) * rx;
          const py = CY + Math.sin(angle) * ry;

          // Depth: sin(angle) gives front/back on the ellipse
          const depth = (Math.sin(angle) + 1) / 2; // 0=back, 1=front
          const pillSC = 0.65 + depth * 0.5;
          const alpha = 0.35 + depth * 0.65;

          // Font & measure
          const fsize = Math.round(10 * SC * pillSC);
          ctx.font = `700 ${fsize}px Inter, sans-serif`;
          const label = skill.toUpperCase();
          const tw = ctx.measureText(label).width;

          const dotR = 3.5 * SC * pillSC;
          const gapAfterDot = 5 * SC * pillSC;
          const padX = 9 * SC * pillSC;
          const padY = 5 * SC * pillSC;
          const pillW = padX + dotR * 2 + gapAfterDot + tw + padX;
          const pillH = fsize + padY * 2;

          // Hit-test (in canvas coords)
          const bx = px - pillW / 2;
          const by = py - pillH / 2;
          const isHov = mx >= bx && mx <= bx + pillW && my >= by && my <= by + pillH;
          if (isHov) hoveredNow = skill;

          newBoxes.push({ label: skill, x: bx, y: by, w: pillW, h: pillH });

          // Draw pill
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(px, py);

          const scl = isHov ? 1.15 : 1;
          ctx.scale(scl, scl);

          // Background
          const pillBg = ctx.createLinearGradient(-pillW / 2, 0, pillW / 2, 0);
          pillBg.addColorStop(0, orbit.color + "12");
          pillBg.addColorStop(0.5, orbit.color + "30");
          pillBg.addColorStop(1, orbit.color + "12");
          ctx.fillStyle = pillBg;
          ctx.shadowBlur = isHov ? 28 : 10;
          ctx.shadowColor = orbit.color;
          roundRect(ctx, -pillW / 2, -pillH / 2, pillW, pillH, pillH / 2);
          ctx.fill();

          // Border
          ctx.strokeStyle = orbit.color + (isHov ? "aa" : "45");
          ctx.lineWidth = isHov ? 1.5 : 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();

          // Shimmer on hover
          if (isHov) {
            const sh = ctx.createLinearGradient(-pillW / 2, -pillH / 2, pillW / 2, pillH / 2);
            sh.addColorStop(0, "rgba(255,255,255,0)");
            sh.addColorStop(0.5, "rgba(255,255,255,0.18)");
            sh.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = sh;
            roundRect(ctx, -pillW / 2, -pillH / 2, pillW, pillH, pillH / 2);
            ctx.fill();
          }

          // Dot
          const dotCX = -pillW / 2 + padX + dotR;
          ctx.beginPath();
          ctx.arc(dotCX, 0, dotR, 0, Math.PI * 2);
          ctx.fillStyle = orbit.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = orbit.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Text
          ctx.font = `700 ${fsize}px Inter, sans-serif`;
          ctx.fillStyle = isHov ? "#FFFFFF" : orbit.color;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          const textX = dotCX + dotR + gapAfterDot;
          ctx.fillText(label, textX, 0);

          // Comet tail on bright half
          if (depth > 0.55) {
            const tailLen = 20 * SC * pillSC * depth;
            const tailAngle = angle + Math.PI;
            const tg = ctx.createLinearGradient(0, 0, Math.cos(tailAngle) * tailLen, Math.sin(tailAngle) * tailLen * orbit.tilt);
            tg.addColorStop(0, orbit.color + "70");
            tg.addColorStop(1, "transparent");
            ctx.strokeStyle = tg;
            ctx.lineWidth = 2 * pillSC;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(tailAngle) * tailLen, Math.sin(tailAngle) * tailLen * orbit.tilt);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      pillBoxes = newBoxes;

      // Update hovered state (throttled via ref comparison)
      if (hoveredNow !== hoveredSkillRef.current) {
        hoveredSkillRef.current = hoveredNow;
        setHoveredSkill(hoveredNow);
      }

      // ── CENTER CORE ──
      const pulse = 1 + 0.07 * Math.sin(t * 2.0);
      const coreR = 38 * SC * pulse;

      // Outer glow aura
      const aura = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR * 4.5);
      aura.addColorStop(0, "rgba(100,255,218,0.2)");
      aura.addColorStop(0.3, "rgba(59,130,246,0.1)");
      aura.addColorStop(0.65, "rgba(124,58,237,0.05)");
      aura.addColorStop(1, "transparent");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(CX, CY, coreR * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Energy rings
      for (let ri = 0; ri < 4; ri++) {
        const rr = coreR * (1.7 + ri * 0.55);
        const ra = (0.16 - ri * 0.03) * (0.6 + 0.4 * Math.sin(t * 2.2 + ri * 1.4));
        ctx.beginPath();
        ctx.arc(CX, CY, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,255,218,${ra.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#64FFDA";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Spinning arcs
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(t * 0.55);
      for (let ai = 0; ai < 3; ai++) {
        const a0 = (ai / 3) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(0, 0, coreR * 1.65, a0, a0 + 0.65);
        ctx.strokeStyle = `rgba(100,255,218,${(0.55 + 0.2 * Math.sin(t + ai)).toFixed(2)})`;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#64FFDA";
        ctx.stroke();
      }
      ctx.rotate(-t * 1.15);
      for (let ai = 0; ai < 5; ai++) {
        const a0 = (ai / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(0, 0, coreR * 2.1, a0, a0 + 0.4);
        ctx.strokeStyle = `rgba(192,132,252,${(0.4 + 0.15 * Math.sin(t * 1.4 + ai)).toFixed(2)})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#C084FC";
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      // Core sphere
      const cg = ctx.createRadialGradient(CX - coreR * 0.28, CY - coreR * 0.28, 0, CX, CY, coreR);
      cg.addColorStop(0, "#DFFFFF");
      cg.addColorStop(0.28, "#64FFDA");
      cg.addColorStop(0.62, "#3B82F6");
      cg.addColorStop(1, "#6D28D9");
      ctx.beginPath();
      ctx.arc(CX, CY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.shadowBlur = 50;
      ctx.shadowColor = "#64FFDA";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Specular
      const sg = ctx.createRadialGradient(CX - coreR * 0.32, CY - coreR * 0.3, 0, CX, CY, coreR);
      sg.addColorStop(0, "rgba(255,255,255,0.5)");
      sg.addColorStop(0.4, "rgba(255,255,255,0.1)");
      sg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(CX, CY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

      // Core label
      const cfs = Math.max(10, Math.round(13 * SC));
      ctx.font = `900 ${cfs}px Inter, sans-serif`;
      ctx.fillStyle = "#0A192F";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SAA", CX, CY);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const hoveredSkillRef = useRef<string | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // We need canvas coords (CSS coords, not DPR-scaled)
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 };
    setHoveredSkill(null);
    hoveredSkillRef.current = null;
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center gap-3">
      {/* Hover tooltip */}
      <div className="h-7 flex items-center justify-center">
        {hoveredSkill && (
          <span
            className="px-5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.35em]"
            style={{
              color: "#64FFDA",
              border: "1px solid rgba(100,255,218,0.35)",
              background: "rgba(100,255,218,0.07)",
              boxShadow: "0 0 24px rgba(100,255,218,0.25)",
            }}
          >
            {hoveredSkill}
          </span>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          cursor: hoveredSkill ? "pointer" : "default",
          boxShadow: "0 0 100px rgba(100,255,218,0.07), 0 0 200px rgba(59,130,246,0.04)",
        }}
      />

      {/* Legend */}
      <div className="flex items-center gap-5 flex-wrap justify-center pt-1">
        {ORBITS.map((o, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: o.color, boxShadow: `0 0 6px ${o.color}` }}
            />
            <span
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: o.color + "70" }}
            >
              Orbit {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
