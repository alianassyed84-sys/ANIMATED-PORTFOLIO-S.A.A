"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 md:px-12 bg-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-2xl font-black tracking-tighter text-white">
            SAA<span className="text-accentCyan text-xs">®</span>
          </div>
          <p className="text-xs font-bold text-secondaryText uppercase tracking-[0.3em] mt-1">Creative Developer</p>
        </div>

        {/* Copyright */}
        <div className="text-secondaryText text-sm font-mono flex flex-col items-center gap-2">
            <span>© {currentYear} SYED ANAS ALI. ALL RIGHTS RESERVED.</span>
            <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase">
                <a href="#" className="hover:text-accentCyan">Privacy</a>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <a href="#" className="hover:text-accentCyan">Terms</a>
            </div>
        </div>

        {/* Back to top button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan group-hover:text-background transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-secondaryText group-hover:text-white">Top</span>
        </button>
      </div>
    </footer>
  );
}
