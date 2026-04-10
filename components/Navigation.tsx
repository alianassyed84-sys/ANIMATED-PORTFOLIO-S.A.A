"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import Magnetic from "@/components/Magnetic";

export default function Navigation() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > window.innerHeight * 3.5) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setMobileOpen(false);
    }
  });

  const navItems = ["Work", "About", "Skills", "Contact"];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ willChange: "transform" }}
        className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-4 md:px-6 py-3 rounded-full">
          {/* Logo */}
          <div className="text-xl font-black tracking-tighter text-white">
            SAA<span className="text-accentCyan text-xs">®</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Magnetic key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  data-cursor="hover"
                  className="text-sm font-medium text-secondaryText hover:text-white transition-colors uppercase tracking-widest focus:text-accentCyan outline-none block"
                >
                  {item}
                </a>
              </Magnetic>
            ))}
          </div>

          {/* Right side: Download + Hamburger */}
          <div className="flex items-center gap-3">
            <Magnetic>
              <a
                href="/Syed_Anas_Ali_Official_CV.pdf"
                download="Syed_Anas_Ali_Official_CV.pdf"
                data-cursor="hover"
                className="flex items-center gap-2 bg-accentCyan text-background px-3 md:px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_rgba(100,255,218,0.5)] transition-all cursor-none"
              >
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">CV</span>
                <Download size={14} strokeWidth={3} />
              </a>
            </Magnetic>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-accentCyan transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-24 left-4 right-4 z-40 glass-card rounded-3xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-bold text-secondaryText hover:text-accentCyan transition-colors uppercase tracking-widest py-2 border-b border-white/5"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
