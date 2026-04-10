"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function NoiseOverlay() {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(0);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fade in from 100vh to 130vh (just after the hero section)
  // Max opacity of 0.05 for a subtle grain
  const opacity = useTransform(
    scrollY,
    [vh * 1, vh * 1.3],
    [0, 0.05] 
  );

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9000]"
      style={{ opacity, willChange: 'opacity' }}
    >
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </motion.div>
  );
}
