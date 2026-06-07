"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";

const TOTAL_FRAMES = 40;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cached render state
  const rafLoopRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastIndexRef = useRef<number>(-1);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, life: number, maxLife: number, size: number, color: string}[]>([]);
  const typingStartTimeRef = useRef<number | null>(null);
  // Tagline rotating typewriter state
  const taglineRef = useRef({
    phrases: [
      "Creative Developer & AI Engineer",
      "Pursuing B.E. @ MJCET, Hyderabad",
      "Full-Stack · Computer Vision · LLMs",
      "Building the Future with Code & AI",
    ],
    idx: 0,
    chars: 0,
    // 'typing' | 'hold' | 'erasing' | 'pause'
    phase: "typing" as "typing" | "hold" | "erasing" | "pause",
    lastTick: 0,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress (0-1) to image index (1-40)
  const currentIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      const promises: Promise<void>[] = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, "0");
        img.src = `/sequence/ezgif-frame-${frameNumber}.png`;

        const promise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // continue even if one fails
        });

        promises.push(promise);
        loadedImages.push(img);
      }

      await Promise.all(promises);
      setImages(loadedImages);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  // One-time canvas setup + debounced resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Only resize if dimensions actually changed (avoids GPU texture re-upload)
      if (dimensionsRef.current.w === w && dimensionsRef.current.h === h) return;
      dimensionsRef.current = { w, h };

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctxRef.current = ctx;
      }

      // Force re-draw after resize
      lastIndexRef.current = -1;
    };

    setupCanvas();

    // Debounce resize so rapid events don't thrash canvas texture
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCanvas, 100);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Continuous RAF render loop — runs every display frame for silky 60fps
  useEffect(() => {
    if (images.length === 0) return;

    const drawFrame = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      // Read the latest scroll-driven frame index
      const rawVal = currentIndex.get();
      const rawIndex = Math.floor(rawVal) - 1;
      const safeIndex = Math.min(Math.max(rawIndex, 0), TOTAL_FRAMES - 1);

      if (safeIndex < 24) {
        typingStartTimeRef.current = null;
      }

      // Skip draw if same frame as last time, UNLESS we are in the hero frames (need continuous animation)
      const isHeroActive = safeIndex >= 22;
      if (safeIndex === lastIndexRef.current && !isHeroActive) return;
      lastIndexRef.current = safeIndex;

      const img = images[safeIndex];
      if (!img || !img.complete) return;

      const canvasWidth = dimensionsRef.current.w || window.innerWidth;
      const canvasHeight = dimensionsRef.current.h || window.innerHeight;

      // Object-fit: cover
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // === CANVAS-LEVEL MASK ===
      const MASK_START_FRAME = 22;
      const MASK_FULL_FRAME = 25;

      if (safeIndex >= MASK_START_FRAME) {
        const progress = Math.min(
          (safeIndex - MASK_START_FRAME) / (MASK_FULL_FRAME - MASK_START_FRAME),
          1
        );

        const isMobile = canvasWidth < 768;
        const gradientStartX = isMobile ? canvasWidth * 0.05 : canvasWidth * 0.45;
        const gradient = ctx.createLinearGradient(gradientStartX, 0, canvasWidth, 0);
        gradient.addColorStop(0, `rgba(10, 25, 47, 0)`);
        gradient.addColorStop(isMobile ? 0.3 : 0.15, `rgba(10, 25, 47, ${progress})`);
        gradient.addColorStop(1, `rgba(10, 25, 47, ${progress})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(gradientStartX, 0, canvasWidth - gradientStartX, canvasHeight);

        // === HERO NAME ===
        const START_HERO_FRAME = 24;
        const FULL_HERO_FRAME = 27;

        if (safeIndex >= START_HERO_FRAME) {
          const heroProgress = Math.min(
            (safeIndex - START_HERO_FRAME) / (FULL_HERO_FRAME - START_HERO_FRAME),
            1
          );

          const maskAreaWidth = canvasWidth - gradientStartX;
          const centerX = isMobile ? canvasWidth / 2 : gradientStartX + maskAreaWidth * 0.5;

          ctx.save();
          ctx.globalAlpha = heroProgress;
          ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
          ctx.shadowBlur = 25 * heroProgress;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          const baseNameSize = canvasWidth > 1200 ? 78 : canvasWidth > 768 ? 62 : 38;

          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Calculate vertical flow
          const totalTextH = baseNameSize * (isMobile ? 3.2 : 3.7);
          const startY = (canvasHeight - totalTextH) / 2;

          // ══════════════════════════════════════════
          // CINEMATIC BACKDROP — Aurora · Curtain · God Rays · Rings
          // ══════════════════════════════════════════
          const backdropCY = canvasHeight / 2;
          const _t = Date.now() * 0.001;

          // ── Layer 1: Deep cyan spotlight core ──
          ctx.save();
          ctx.globalAlpha = 1;
          const coreR = Math.min(canvasWidth, canvasHeight) * 0.52;
          const coreGrad = ctx.createRadialGradient(centerX, backdropCY, 0, centerX, backdropCY, coreR);
          coreGrad.addColorStop(0,   `rgba(0,90,150,${0.72 * heroProgress})`);
          coreGrad.addColorStop(0.45,`rgba(0,40,90,${0.28 * heroProgress})`);
          coreGrad.addColorStop(1,   "rgba(0,0,0,0)");
          ctx.fillStyle = coreGrad;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          ctx.restore();

          // ── Layer 2: Breathing purple/magenta orb (drifts slowly) ──
          ctx.save();
          ctx.globalAlpha = 1;
          const pOx = Math.sin(_t * 0.28) * 70;
          const pOy = Math.cos(_t * 0.22) * 40;
          const purpleGrad = ctx.createRadialGradient(
            centerX + pOx, backdropCY - 60 + pOy, 0,
            centerX + pOx, backdropCY - 60 + pOy,
            Math.min(canvasWidth, canvasHeight) * 0.42
          );
          purpleGrad.addColorStop(0,   `rgba(140,0,200,${0.28 * heroProgress})`);
          purpleGrad.addColorStop(0.5, `rgba(60,0,140,${0.10 * heroProgress})`);
          purpleGrad.addColorStop(1,   "rgba(0,0,0,0)");
          ctx.fillStyle = purpleGrad;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          ctx.restore();

          // ── Layer 3: Vertical aurora curtain bands ──
          ctx.save();
          const numBands = 10;
          const zone = canvasWidth - gradientStartX;
          const bandW = zone / numBands;
          for (let b = 0; b < numBands; b++) {
            const bx = gradientStartX + b * bandW;
            const wave = Math.sin(_t * 0.55 + b * 0.75) * 0.5 + 0.5;
            const hue = (185 + b * 22 + _t * 8) % 360;
            const alpha = wave * 0.09 * heroProgress;
            const bg = ctx.createLinearGradient(bx, 0, bx, canvasHeight);
            bg.addColorStop(0,   `hsla(${hue},100%,65%,0)`);
            bg.addColorStop(0.25,`hsla(${hue},100%,65%,${alpha})`);
            bg.addColorStop(0.75,`hsla(${hue},100%,65%,${alpha * 0.6})`);
            bg.addColorStop(1,   `hsla(${hue},100%,65%,0)`);
            ctx.fillStyle = bg;
            ctx.fillRect(bx, 0, bandW, canvasHeight);
          }
          ctx.restore();

          // ── Layer 4: God rays / light shafts from above ──
          ctx.save();
          const numShafts = isMobile ? 3 : 6;
          const shaftSpread = isMobile ? 35 : 75;
          for (let s = 0; s < numShafts; s++) {
            const sx = centerX + (s - (numShafts - 1) / 2) * shaftSpread
                       + Math.sin(_t * 0.35 + s * 1.1) * 18;
            const shaftAlpha = (0.045 + Math.sin(_t * 0.5 + s * 0.9) * 0.02) * heroProgress;
            const shaftW = isMobile ? 16 : 28;
            const sg = ctx.createLinearGradient(sx, 0, sx, canvasHeight * 0.75);
            sg.addColorStop(0,   `rgba(0,229,255,${shaftAlpha * 1.8})`);
            sg.addColorStop(0.55,`rgba(80,180,255,${shaftAlpha})`);
            sg.addColorStop(1,   "rgba(0,100,200,0)");
            ctx.fillStyle = sg;
            ctx.beginPath();
            ctx.moveTo(sx - shaftW * 0.3, 0);
            ctx.lineTo(sx + shaftW * 1.5, canvasHeight * 0.75);
            ctx.lineTo(sx + shaftW * 2.2, canvasHeight * 0.75);
            ctx.lineTo(sx + shaftW * 0.4, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          // ── Layer 5: 3 clean outward-pulsing rings ──
          ctx.save();
          for (let ri = 0; ri < 3; ri++) {
            const phase = ((_t * 0.30 + ri * 0.34) % 1);
            const rR = 70 + phase * (isMobile ? 180 : 260);
            const rA = (1 - phase) * 0.20 * heroProgress;
            ctx.beginPath();
            ctx.arc(centerX, backdropCY, rR, 0, Math.PI * 2);
            ctx.strokeStyle = ri === 1
              ? `rgba(212,175,55,${rA * 0.85})`
              : `rgba(0,229,255,${rA})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
          // ══════════════════════════════════════════
          // END CINEMATIC BACKDROP
          // ══════════════════════════════════════════


          // --- LUMINOUS PARTICLES SYSTEM ---
          if (heroProgress > 0) {
            // Spawn new particles occasionally (fewer on mobile)
            const spawnRate = isMobile ? 0.3 : 0.8;
            if (Math.random() < spawnRate * heroProgress) {
                particlesRef.current.push({
                    x: centerX + (Math.random() - 0.5) * (canvasWidth * (isMobile ? 0.8 : 0.4)),
                    y: startY + totalTextH + 50, // start from bottom of text
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -Math.random() * 2 - 1, // float upward
                    life: 0,
                    maxLife: 60 + Math.random() * 80,
                    size: Math.random() * (isMobile ? 1.5 : 2) + 1,
                    color: Math.random() > 0.5 ? "#00E5FF" : "#FDE484"
                });
            }
            
            // Update and draw particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                let p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life++;
                if (p.life >= p.maxLife) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }
                const pAlpha = (1 - p.life / p.maxLife) * heroProgress;
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = pAlpha;
                ctx.shadowBlur = isMobile ? 10 : 15;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            }
          }

          // Helper to draw floating 3D text
          const drawCinematicText = (
            text: string, 
            y: number, 
            sizeMult: number, 
            xOffset: number, 
            rotDeg: number,
            colorVariant: "gold" | "cyan" | "silver",
            showCursor = false
          ) => {
            const size = baseNameSize * sizeMult;
            ctx.save();
            ctx.font = `900 ${size}px "Cinzel Decorative", serif`;
            
            ctx.translate(centerX + (isMobile ? 0 : xOffset), y + size/2);
            ctx.rotate((rotDeg * Math.PI) / 180);
            
            if (text) {
              // --- CHROMATIC ABERRATION & GLITCH SLICES ---
              // Add a subtle continuous organic shimmer + a rare random fast glitch
              const _time = Date.now() * 0.001;
              const isGlitched = namesDone && (Math.sin(_time * 12) > 0.95 || Math.random() < 0.02);
              const driftX = isGlitched ? (Math.random() - 0.5) * 12 : Math.sin(_time * 3) * 1.2;
              const driftY = isGlitched ? (Math.random() - 0.5) * 8 : Math.cos(_time * 2.5) * 0.8;

              // --- MOTION BLUR TRAILS ---
              const trailsCount = isMobile ? 2 : Math.floor(5 * heroProgress); 
              for(let i = trailsCount; i >= 1; i--) {
                  ctx.save();
                  const trailOffsetY = i * (isMobile ? 3 : 6); 
                  ctx.translate(driftX, trailOffsetY); 
                  ctx.globalAlpha = heroProgress * (0.12 / i);
                  ctx.fillStyle = colorVariant === "cyan" ? "#00B8D4" : colorVariant === "gold" ? "#D4AF37" : "#B0BEC5";
                  ctx.shadowBlur = isMobile ? 8 : 15;
                  ctx.shadowColor = ctx.fillStyle;
                  ctx.fillText(text, 0, -size/2);
                  ctx.restore();
              }

              // Draw Red Chromatic Channel
              ctx.save();
              ctx.fillStyle = "rgba(255, 0, 85, 0.65)";
              ctx.shadowColor = "rgba(255, 0, 85, 0.4)";
              ctx.shadowBlur = 10;
              ctx.fillText(text, driftX - 2.5, -size/2 + driftY);
              ctx.restore();

              // Draw Blue/Cyan Chromatic Channel
              ctx.save();
              ctx.fillStyle = "rgba(0, 229, 255, 0.65)";
              ctx.shadowColor = "rgba(0, 229, 255, 0.4)";
              ctx.shadowBlur = 10;
              ctx.fillText(text, -driftX + 2.5, -size/2 - driftY);
              ctx.restore();

              // Metallic Gradient
              const grad = ctx.createLinearGradient(0, -size/2, 0, size/2);
              if (colorVariant === "gold") {
                grad.addColorStop(0, "#FFFFFF");
                grad.addColorStop(0.2, "#FFE57F");
                grad.addColorStop(0.5, "#D4AF37");
                grad.addColorStop(0.8, "#997A00");
                grad.addColorStop(1, "#FFE57F");
              } else if (colorVariant === "cyan") {
                grad.addColorStop(0, "#FFFFFF");
                grad.addColorStop(0.2, "#84FFFF");
                grad.addColorStop(0.5, "#00E5FF");
                grad.addColorStop(0.8, "#00838F");
                grad.addColorStop(1, "#84FFFF");
              } else {
                grad.addColorStop(0, "#FFFFFF");
                grad.addColorStop(0.5, "#CFD8DC");
                grad.addColorStop(1, "#78909C");
              }

              ctx.shadowColor = colorVariant === "cyan" ? "rgba(0, 229, 255, 0.85)" : colorVariant === "gold" ? "rgba(212, 175, 55, 0.85)" : "rgba(255, 255, 255, 0.4)";
              ctx.shadowBlur = (isMobile ? 25 : 50) * heroProgress;
              ctx.shadowOffsetY = (isMobile ? 6 : 12) * heroProgress;
              
              ctx.lineWidth = 2;
              ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
              ctx.strokeText(text, 0, -size/2);

              ctx.fillStyle = grad;
              ctx.fillText(text, 0, -size/2);
            }

            if (showCursor) {
              const textWidth = text ? ctx.measureText(text).width : 0;
              const cursorX = textWidth > 0 ? textWidth / 2 + (isMobile ? 6 : 12) : 0;
              
              ctx.save();
              ctx.fillStyle = colorVariant === "cyan" ? "#00E5FF" : colorVariant === "gold" ? "#D4AF37" : "#FFFFFF";
              ctx.shadowColor = ctx.fillStyle;
              ctx.shadowBlur = (isMobile ? 15 : 30) * heroProgress;
              
              const cursorW = isMobile ? 3 : 6;
              const cursorH = size * 0.85;
              const cursorY = -size / 2 + (size - cursorH) / 2;
              
              ctx.fillRect(cursorX, cursorY, cursorW, cursorH);
              ctx.restore();
            }

            ctx.restore();
            return size; 
          };

          // ── NAME TYPING (one-shot, time-based) ──
          const nameDuration = 120; // ms per char
          const nameLinePause = 350; // ms between name words

          if (typingStartTimeRef.current === null) {
            typingStartTimeRef.current = Date.now();
          }
          const elapsed = Date.now() - typingStartTimeRef.current;

          // Segment timing for SYED / ANAS / ALI
          const nameWords = ["SYED", "ANAS", "ALI"] as const;
          let nameCumulative = 0;
          const nameSegTimes = nameWords.map((w) => {
            const start = nameCumulative;
            const end = start + (w.length - 1) * nameDuration;
            nameCumulative = end + nameLinePause;
            return { start, end };
          });
          const totalNameDuration = nameCumulative;

          const typedNames = nameWords.map((w, i) => {
            const { start, end } = nameSegTimes[i];
            if (elapsed < start) return "";
            if (elapsed >= end) return w;
            return w.slice(0, Math.floor((elapsed - start) / nameDuration) + 1);
          });

          // Active cursor for name phase (0=SYED,1=ANAS,2=ALI, -1=done)
          let nameCursorLine = -1;
          for (let i = 0; i < nameWords.length; i++) {
            if (elapsed < nameSegTimes[i].end ||
                (i < nameWords.length - 1 && elapsed < nameSegTimes[i + 1].start)) {
              nameCursorLine = i; break;
            }
          }
          const namesDone = elapsed >= totalNameDuration;

          // ── LOOPING TAGLINE TYPEWRITER ──
          const TYPE_SPEED   = 55;   // ms per char when typing
          const ERASE_SPEED  = 28;   // ms per char when erasing (faster)
          const HOLD_MS      = 1800; // ms to hold full phrase
          const PAUSE_MS     = 300;  // ms pause before typing next

          const tl = taglineRef.current;

          if (namesDone) {
            const now = Date.now();
            const dt = now - (tl.lastTick || now);
            tl.lastTick = now;

            const phrase = tl.phrases[tl.idx];

            if (tl.phase === "typing") {
              // advance chars proportionally to time
              tl.chars = Math.min(phrase.length, tl.chars + dt / TYPE_SPEED);
              if (tl.chars >= phrase.length) {
                tl.chars = phrase.length;
                tl.phase = "hold";
                tl.lastTick = now; // reset so hold timer starts fresh
              }
            } else if (tl.phase === "hold") {
              // reuse lastTick as hold-start; but we already set it above so
              // track via a dedicated accumulator by abusing lastTick
              if (!tl["holdStart" as keyof typeof tl]) {
                (tl as Record<string, unknown>)["holdStart"] = now;
              }
              const held = now - ((tl as Record<string, unknown>)["holdStart"] as number);
              if (held >= HOLD_MS) {
                tl.phase = "erasing";
                (tl as Record<string, unknown>)["holdStart"] = 0;
              }
            } else if (tl.phase === "erasing") {
              tl.chars = Math.max(0, tl.chars - dt / ERASE_SPEED);
              if (tl.chars <= 0) {
                tl.chars = 0;
                tl.phase = "pause";
                (tl as Record<string, unknown>)["pauseStart"] = now;
              }
            } else if (tl.phase === "pause") {
              const paused = now - ((tl as Record<string, unknown>)["pauseStart"] as number || now);
              if (paused >= PAUSE_MS) {
                tl.idx = (tl.idx + 1) % tl.phrases.length;
                tl.phase = "typing";
                (tl as Record<string, unknown>)["pauseStart"] = 0;
              }
            }
          } else {
            // Reset tagline state whenever name hasn't finished yet
            tl.chars = 0;
            tl.phase = "typing";
            tl.lastTick = 0;
          }

          const taglineText = namesDone
            ? tl.phrases[tl.idx].slice(0, Math.floor(tl.chars))
            : "";
          const taglineCursorActive = namesDone && nameCursorLine === -1;

          const isCursorVisible = Math.floor(Date.now() / 400) % 2 === 0;

          const offsetTime = Date.now() * 0.001;
          const floatY1 = Math.sin(offsetTime) * 5;
          const floatY2 = Math.cos(offsetTime * 1.2) * 5;
          const floatY3 = Math.sin(offsetTime * 0.8) * 5;

          // Draw the three name lines (cinematic)
          const syedSize = drawCinematicText(typedNames[0], startY + floatY1, 1, -15, -2, "silver", nameCursorLine === 0 && isCursorVisible);
          const anasSize = drawCinematicText(typedNames[1], startY + floatY1 + syedSize * (isMobile ? 0.78 : 0.9) + floatY2, 1.15, 10, 1.5, "gold", nameCursorLine === 1 && isCursorVisible);
          const aliBottomY = startY + floatY1 + syedSize * (isMobile ? 0.78 : 0.9) + floatY2 + anasSize * (isMobile ? 0.72 : 0.85) + floatY3;
          drawCinematicText(typedNames[2], aliBottomY, 1.05, -8, -1, "cyan", nameCursorLine === 2 && isCursorVisible);

          // ── Single looping tagline line ──
          if (taglineText || taglineCursorActive) {
            const taglineY = startY + totalTextH + (isMobile ? 16 : 32);
            const tagFontSize = isMobile ? 11 : 16;

            ctx.save();
            ctx.globalAlpha = heroProgress;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.letterSpacing = isMobile ? "0.3em" : "0.5em";
            ctx.font = `700 ${isMobile ? 12 : 17}px "Inter", sans-serif`;
            ctx.shadowColor = "rgba(0,229,255,0.75)";
            ctx.shadowBlur = 20 * heroProgress;
            ctx.fillStyle = "#A3F7FF";
            ctx.fillText(taglineText, centerX, taglineY);

            // blinking cursor at end of tagline
            if (taglineCursorActive && isCursorVisible) {
              const tw = ctx.measureText(taglineText).width;
              const curX = centerX + tw / 2 + (isMobile ? 4 : 8);
              ctx.fillStyle = "#00E5FF";
              ctx.shadowBlur = 16 * heroProgress;
              ctx.shadowColor = "#00E5FF";
              ctx.fillRect(curX, taglineY, isMobile ? 2 : 3, tagFontSize * 1.1);
            }
            ctx.restore();
          }
          ctx.restore();
        }
      }
    };

    // Continuous loop — always in sync with the display refresh rate
    const loop = () => {
      drawFrame();
      rafLoopRef.current = requestAnimationFrame(loop);
    };

    rafLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafLoopRef.current !== null) {
        cancelAnimationFrame(rafLoopRef.current);
        rafLoopRef.current = null;
      }
    };
  }, [images, currentIndex]);

  return (
    <div id="hero-canvas-container" ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ willChange: "transform" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
            <div className="text-accentCyan font-mono animate-pulse">
              LOADING EXPERIENCE...
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
