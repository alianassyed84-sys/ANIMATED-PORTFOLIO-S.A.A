"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 40;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const promises = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, "0");
        img.src = `/sequence/ezgif-frame-${frameNumber}.png`;
        
        const promise = new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
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

  // Draw current frame on canvas
  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;

    const render = () => {
      const index = Math.floor(currentIndex.get()) - 1;
      const safeIndex = Math.min(Math.max(index, 0), TOTAL_FRAMES - 1);
      const img = images[safeIndex];
      
      const canvas = canvasRef.current;
      if (!canvas || !img) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Object-fit: cover logic
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Scale up canvas resolution for high DPI screens
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      
      // Standardize coordinate system to CSS pixels
      ctx.scale(dpr, dpr);

      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, drawX, drawY;

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
      
      // Ensure high quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    const unsubscribe = currentIndex.on("change", render);
    // Initial render
    render();
    
    // Resize handler
    window.addEventListener("resize", render);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", render);
    };
  }, [images, currentIndex]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accentCyan font-mono"
            >
              LOADING EXPERIENCE...
            </motion.div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-cover"
        />
        {/* Gradient mask to robustly hide baked-in text on the right side of the images */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-r from-transparent from-[5%] via-background via-[20%] to-background pointer-events-none z-10" />
      </div>
    </div>
  );
}
