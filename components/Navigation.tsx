"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { Download, Menu, X } from "lucide-react";
import Magnetic from "@/components/Magnetic";

const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const { scrollY, scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Smooth scroll progress bar
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > window.innerHeight * 3.5) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setMobileOpen(false);
    }
  });

  // Active section detection
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll locking for mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Scroll progress bar — animated gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #64FFDA, #3b82f6, #b794f6, #00E5FF, #64FFDA)",
          backgroundSize: "200% 100%",
          boxShadow: "0 0 12px rgba(100,255,218,0.9), 0 0 24px rgba(59,130,246,0.4)",
          animation: "gradient-shift 3s linear infinite",
        }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ willChange: "transform" }}
        className="fixed top-2 left-0 w-full z-50 px-4 md:px-6 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card-crazy aurora-border px-4 md:px-6 py-3 rounded-full">
          {/* Logo */}
          <a href="#" className="text-xl font-black tracking-tighter text-white hover:text-accentCyan transition-colors glitch-skew">
            SAA<span className="neon-flicker text-accentCyan text-xs">®</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <Magnetic key={item.label}>
                  <a
                    href={item.href}
                    data-cursor="hover"
                    className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors rounded-full ${
                      isActive
                        ? "text-accentCyan"
                        : "text-secondaryText hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-accentCyan/10 border border-accentCyan/20"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                </Magnetic>
              );
            })}
          </div>

          {/* Right side: Download + Hamburger */}
          <div className="flex items-center gap-3">
            <Magnetic>
              <a
                href="/Syed_Anas_Ali_Official_CV.pdf"
                download="Syed_Anas_Ali_Official_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="flex items-center gap-2 bg-accentCyan text-background px-4 md:px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(100,255,218,0.5)] transition-all cursor-none"
              >
                <span className="hidden sm:inline">Download CV</span>
                <span className="sm:hidden">CV</span>
                <Download size={13} strokeWidth={3} />
              </a>
            </Magnetic>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-accentCyan transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[45] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-secondary border-l border-white/5 p-8 flex flex-col pt-24"
            >
              <div className="space-y-6">
                <p className="text-accentCyan text-[10px] font-black tracking-[0.4em] uppercase opacity-50 mb-4">Navigation</p>
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-2xl font-black uppercase tracking-widest transition-all ${
                      activeSection === item.href.replace("#", "")
                        ? "text-accentCyan"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto space-y-6">
                <div className="h-px w-full bg-white/5" />
                <p className="text-secondaryText text-xs font-medium">Available for new opportunities.</p>
                <div className="flex gap-4">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=syedanasaliofficialdeveloper@gmail.com" target="_blank" rel="noopener noreferrer" className="text-accentCyan text-xs font-bold uppercase tracking-widest">Email</a>
                  <a href="https://linkedin.com/in/syedanasali" className="text-accentCyan text-xs font-bold uppercase tracking-widest">LinkedIn</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
