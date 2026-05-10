"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter, ArrowUp, Heart } from "lucide-react";

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
    <footer className="bg-secondary border-t border-white/5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accentCyan/3 blur-[120px] pointer-events-none" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-12 border-b border-white/5">
          {/* Brand column */}
          <div className="space-y-5">
            <div>
              <div className="text-3xl font-black tracking-tighter text-white">
                SAA<span className="text-accentCyan text-sm">®</span>
              </div>
              <p className="text-xs font-bold text-accentCyan uppercase tracking-[0.3em] mt-1">
                Creative Developer
              </p>
            </div>
            <p className="text-secondaryText text-sm leading-relaxed max-w-xs">
              Building AI-powered, pixel-perfect digital experiences from Hyderabad, India.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIALS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-secondaryText hover:text-accentCyan hover:border-accentCyan/30 transition-all duration-300"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation column */}       
          <div className="space-y-5">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-secondaryText text-sm hover:text-accentCyan transition-colors group flex items-center gap-2"
                  >
                    <span className="w-4 h-px bg-secondaryText/30 group-hover:w-6 group-hover:bg-accentCyan transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status column */}
          <div className="space-y-5">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Status</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-2.5 h-2.5 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  <div className="relative w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-sm text-white font-medium">Available for work</span>
              </div>
              <div className="glass-card rounded-2xl p-4 space-y-2">
                <p className="text-secondaryText text-xs uppercase tracking-widest font-bold">Currently</p>
                <p className="text-white text-sm font-medium">BE CSE @ MJCET, Hyderabad</p>
                <p className="text-secondaryText text-xs">2025 — 2029</p>
              </div>
              <a
                href="/Syed_Anas_Ali_Official_CV.pdf"
                download="Syed_Anas_Ali_Official_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accentCyan text-sm font-bold hover:underline underline-offset-4"
              >
                Download CV
                <ArrowUp size={14} className="rotate-45" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
          <div className="flex flex-col items-center sm:items-start gap-2 text-secondaryText text-[10px] md:text-xs font-mono text-center sm:text-left">
            <span>© {currentYear} SYED ANAS ALI.</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-white/10">|</span>
              <span className="flex items-center gap-1">
                Built with <Heart size={10} className="text-red-400 fill-red-400" /> & Next.js
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-4">
            <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-secondaryText">
              <a href="#" className="hover:text-accentCyan transition-colors">Privacy</a>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <a href="#" className="hover:text-accentCyan transition-colors">Terms</a>
            </div>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-secondaryText hover:text-accentCyan transition-all active:scale-95"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Back to top</span>
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:bg-accentCyan group-hover:border-accentCyan group-hover:text-background transition-all">
                <ArrowUp size={12} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
