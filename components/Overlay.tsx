"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Section 1: Name and Tagline appears upon scrolling, perfectly replacing the placeholder
  const opacity1 = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.25], [0, 0, 1, 0]);
  const x1 = useTransform(scrollYProgress, [0.08, 0.16], [50, 0]);

  // Section 2: 30% - 50%
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.25, 0.55], [-100, 0]);

  // Section 3: 60% - 80%
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const x3 = useTransform(scrollYProgress, [0.6, 0.9], [100, 0]);

  // Scroll Indicator fades out immediately
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-[400vh] pointer-events-none z-10">
      {/* Section 1: Right aligned Name & Title */}
      <section className="sticky top-0 h-screen w-full flex flex-col items-end justify-center p-8 md:p-24 text-right">
        <motion.div style={{ opacity: opacity1, x: x1 }} className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.85]">
            SYED<br />ANAS<br />ALI
          </h1>
          <p className="text-xl md:text-2xl font-bold text-accentCyan tracking-[0.3em] uppercase">
            CREATIVE DEVELOPER
          </p>
        </motion.div>
      </section>

      {/* Section 2 */}
      <section className="sticky top-0 h-screen w-full flex items-center justify-start p-8 md:p-24">
        <motion.div style={{ opacity: opacity2, x: x2 }} className="max-w-2xl text-left">
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
            I craft modern <br />
            <span className="text-accentCyan">web experiences.</span>
          </h2>
        </motion.div>
      </section>

      {/* Section 3 */}
      <section className="sticky top-0 h-screen w-full flex items-center justify-end p-8 md:p-24 text-right">
        <motion.div style={{ opacity: opacity3, x: x3 }} className="max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Bridging design <br />
            <span className="text-accentBlue">and engineering.</span>
          </h2>
        </motion.div>
      </section>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ opacity: scrollIndicatorOpacity }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-secondaryText text-xs uppercase tracking-widest font-mono">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accentCyan to-transparent animate-pulse" />
      </motion.div>
    </div>
  );
}
