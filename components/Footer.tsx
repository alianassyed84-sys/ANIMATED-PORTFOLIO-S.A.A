"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp, Heart, Zap } from "lucide-react";

const SOCIALS = [
  { icon: Github, href: "https://github.com/alianassyed84", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/syedanasali", label: "LinkedIn" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=syedanasaliofficialdeveloper@gmail.com", label: "Email" },
];

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Education", href: "#education" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, transparent, #000000 30%)" }}>
      {/* Top section divider */}
      <div className="section-divider" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accentCyan/4 blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accentBlue/4 blur-[120px] pointer-events-none" />

      {/* Scanline texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(100,255,218,0.3) 3px, rgba(100,255,218,0.3) 4px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-12">
          {/* Brand column */}
          <div className="space-y-6">
            <div>
              <div className="text-4xl font-black tracking-tighter glitch-skew" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                <span className="text-white">S</span>
                <span className="text-accentCyan neon-flicker">A</span>
                <span className="text-white">A</span>
                <span className="text-accentCyan text-sm">®</span>
              </div>
              <p className="text-[10px] font-black text-accentCyan uppercase tracking-[0.4em] mt-1 animated-gradient-text">
                Creative Developer
              </p>
            </div>
            <p className="text-secondaryText text-sm leading-relaxed max-w-xs">
              Building AI-powered, pixel-perfect digital experiences from Hyderabad, India.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIALS.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-11 h-11 rounded-xl glass-card-crazy holo-border flex items-center justify-center text-secondaryText hover:text-accentCyan transition-all duration-300"
                >
                  <social.icon size={17} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div className="space-y-5">
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link, i) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 6 }}
                    className="text-secondaryText text-sm hover:text-accentCyan transition-colors group flex items-center gap-3"
                  >
                    <span className="w-4 h-px bg-secondaryText/20 group-hover:w-8 group-hover:bg-accentCyan transition-all duration-300" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status column */}
          <div className="space-y-5">
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs">Status</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-2.5 h-2.5 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  <div className="relative w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-sm text-white font-bold">Available for work</span>
              </div>
              <div className="glass-card-crazy aurora-border rounded-2xl p-4 space-y-2">
                <p className="text-secondaryText text-[10px] uppercase tracking-[0.3em] font-black">Currently</p>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-accentCyan" />
                  <p className="text-white text-sm font-black">BE CSE @ MJCET</p>
                </div>
                <p className="text-secondaryText text-xs font-mono">Hyderabad, India • 2025–2029</p>
              </div>
              <motion.a
                href="/Syed_Anas_Ali_Official_CV.pdf"
                download="Syed_Anas_Ali_Official_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-accentCyan text-sm font-black hover:underline underline-offset-4 group"
              >
                Download CV
                <ArrowUp size={14} className="rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1 text-secondaryText text-[10px] md:text-xs font-mono text-center sm:text-left">
            <span>© {currentYear} SYED ANAS ALI — ALL RIGHTS RESERVED.</span>
            <span className="flex items-center gap-1.5">
              Built with <Heart size={10} className="text-red-400 fill-red-400" /> & Next.js · Powered by Framer Motion & WebGL
            </span>
          </div>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(100,255,218,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2.5 px-5 py-2.5 glass-card-crazy holo-border rounded-full text-secondaryText hover:text-accentCyan transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Back to top</span>
            <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:bg-accentCyan group-hover:border-accentCyan group-hover:text-background transition-all">
              <ArrowUp size={12} />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
