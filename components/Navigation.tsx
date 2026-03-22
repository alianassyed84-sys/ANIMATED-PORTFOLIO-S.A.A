"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Download } from "lucide-react";

export default function Navigation() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show nav after hero section (~400vh)
    if (latest > window.innerHeight * 3.5) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  const navItems = ["Work", "About", "Skills", "Contact"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 rounded-full">
        {/* Logo */}
        <div className="text-xl font-black tracking-tighter text-white">
          SAA<span className="text-accentCyan text-xs">®</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-secondaryText hover:text-white transition-colors uppercase tracking-widest focus:text-accentCyan outline-none"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Resume Button */}
        <button className="flex items-center gap-2 bg-accentCyan text-background px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_rgba(100,255,218,0.5)] transition-all">
          Resume
          <Download size={14} strokeWidth={3} />
        </button>
      </div>
    </motion.nav>
  );
}
