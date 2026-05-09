"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "exit">("counting");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("exit"), 200);
          setTimeout(() => setLoading(false), 900);
          return 100;
        }
        // Simulate variable load speed
        const increment = prev < 60 ? Math.random() * 12 + 4 : Math.random() * 6 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Animated background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-accentCyan/10"
                animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.05, 0.15] }}
                transition={{ duration: 3, delay: ring * 0.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: ring * 200, height: ring * 200 }}
              />
            ))}
          </div>

          {/* Glowing center dot */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-accentCyan"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ boxShadow: "0 0 30px rgba(100,255,218,0.8), 0 0 60px rgba(100,255,218,0.4)" }}
          />

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-12 text-center"
          >
            <div className="text-5xl md:text-7xl font-black tracking-tighter">
              <span className="text-white">S</span>
              <span className="text-accentCyan">A</span>
              <span className="text-white">A</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondaryText mt-2">
              Creative Developer
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "200px" }}
            transition={{ duration: 0.4 }}
            className="relative h-px bg-white/10 rounded-full overflow-hidden"
            style={{ width: 200 }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #64FFDA, #3b82f6)",
                boxShadow: "0 0 8px rgba(100,255,218,0.8)",
                transition: "width 0.08s ease-out",
              }}
            />
          </motion.div>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-mono text-xs text-secondaryText"
          >
            {Math.round(progress)}%
          </motion.div>

          {/* Animated exit curtain */}
          <AnimatePresence>
            {phase === "exit" && (
              <motion.div
                key="curtain"
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 bg-background"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
