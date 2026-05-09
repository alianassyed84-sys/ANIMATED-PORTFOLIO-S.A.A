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

        const gradientStartX = canvasWidth * 0.45;
        const gradient = ctx.createLinearGradient(gradientStartX, 0, canvasWidth, 0);
        gradient.addColorStop(0, `rgba(10, 25, 47, 0)`);
        gradient.addColorStop(0.15, `rgba(10, 25, 47, ${progress})`);
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
          const centerX = gradientStartX + maskAreaWidth * 0.5;

          ctx.save();
          ctx.globalAlpha = heroProgress;
          ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
          ctx.shadowBlur = 25 * heroProgress;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          const baseNameSize = canvasWidth > 1200 ? 110 : canvasWidth > 768 ? 85 : 45;
          const taglineSize = canvasWidth > 768 ? "18px" : "13px";

          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Calculate vertical flow
          const totalTextH = baseNameSize * 3.7;
          const startY = (canvasHeight - totalTextH) / 2;

          // --- LUMINOUS PARTICLES SYSTEM ---
          if (heroProgress > 0) {
            // Spawn new particles occasionally
            if (Math.random() < 0.8 * heroProgress) {
                particlesRef.current.push({
                    x: centerX + (Math.random() - 0.5) * (canvasWidth * 0.4),
                    y: startY + totalTextH + 50, // start from bottom of text
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -Math.random() * 2 - 1, // float upward
                    life: 0,
                    maxLife: 60 + Math.random() * 80,
                    size: Math.random() * 2 + 1,
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
                ctx.shadowBlur = 15;
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
            colorVariant: "gold" | "cyan" | "silver"
          ) => {
            const size = baseNameSize * sizeMult;
            ctx.save();
            ctx.font = `italic 700 ${size}px "Bodoni MT", "Didot", "Cinzel Decorative", serif`;
            
            ctx.translate(centerX + xOffset, y + size/2);
            ctx.rotate((rotDeg * Math.PI) / 180);
            
            // --- MOTION BLUR TRAILS ---
            // Draw multiple semi-transparent copies offset downwards
            const trailsCount = Math.floor(6 * heroProgress); 
            for(let i = trailsCount; i >= 1; i--) {
                ctx.save();
                const trailOffsetY = i * 8; // move downwards for upward trail effect
                ctx.translate(0, trailOffsetY); 
                // Fade out trails the further away they are
                ctx.globalAlpha = heroProgress * (0.15 / i);
                
                // Keep trails monochromatic based on the variant
                ctx.fillStyle = colorVariant === "cyan" ? "#00B8D4" : colorVariant === "gold" ? "#D4AF37" : "#B0BEC5";
                
                // Add extreme blur to the trails
                ctx.shadowBlur = 20;
                ctx.shadowColor = ctx.fillStyle;
                
                ctx.fillText(text, 0, -size/2);
                ctx.restore();
            }

            // Metallic Gradient
            const grad = ctx.createLinearGradient(0, -size/2, 0, size/2);
            if (colorVariant === "gold") {
              grad.addColorStop(0, "#FEF0A5");
              grad.addColorStop(0.3, "#D4AF37");
              grad.addColorStop(0.5, "#FFF6C5");
              grad.addColorStop(0.7, "#997A00");
              grad.addColorStop(1, "#E6C200");
            } else if (colorVariant === "cyan") {
              grad.addColorStop(0, "#E0FFFF");
              grad.addColorStop(0.4, "#00E5FF");
              grad.addColorStop(0.6, "#84FFFF");
              grad.addColorStop(1, "#00B8D4");
            } else {
              grad.addColorStop(0, "#FFFFFF");
              grad.addColorStop(0.5, "#B0BEC5");
              grad.addColorStop(1, "#78909C");
            }

            ctx.shadowColor = colorVariant === "cyan" ? "rgba(0, 229, 255, 0.7)" : "rgba(212, 175, 55, 0.7)";
            ctx.shadowBlur = 40 * heroProgress;
            ctx.shadowOffsetY = 15 * heroProgress;
            
            // Stroke for edge rim lighting
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.strokeText(text, 0, -size/2);

            ctx.fillStyle = grad;
            ctx.fillText(text, 0, -size/2);

            ctx.restore();
            return size; 
          };

          const offsetTime = Date.now() * 0.001; // subtle float animation
          const floatY1 = Math.sin(offsetTime) * 5;
          const floatY2 = Math.cos(offsetTime * 1.2) * 5;
          const floatY3 = Math.sin(offsetTime * 0.8) * 5;

          const syedSize = drawCinematicText("SYED", startY + floatY1, 1, -15, -2, "silver");
          const anasSize = drawCinematicText("ANAS", startY + floatY1 + syedSize * 0.85 + floatY2, 1.4, 10, 1.5, "gold");
          drawCinematicText("ALI", startY + floatY1 + syedSize * 0.85 + floatY2 + anasSize * 0.75 + floatY3, 1.2, -8, -1, "cyan");

          ctx.shadowBlur = 20 * heroProgress;
          ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
          ctx.fillStyle = "#A3F7FF";
          ctx.font = `600 ${taglineSize} "Inter", sans-serif`;
          ctx.textBaseline = "top";
          ctx.letterSpacing = "0.6em";
          ctx.textAlign = "center";
          ctx.fillText(
            "CREATIVE DEVELOPER",
            centerX,
            startY + totalTextH + (canvasWidth > 768 ? 30 : 20)
          );
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
