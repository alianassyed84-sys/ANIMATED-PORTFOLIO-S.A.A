"use client";

import { motion } from "framer-motion";
import { GraduationCap, BarChart3 } from "lucide-react";
import Image from "next/image";

const TIMELINE = [
  {
    side: "left",
    icon: <GraduationCap size={24} />,
    logo: "/images/iisr-logo.png",
    institution: "INTERNATIONAL INDIAN SCHOOL, RIYADH",
    achievement: "A Grade",
    period: "2012 - 2023",
    highlight: "Completed 11 years of rigorous schooling in Riyadh, Saudi Arabia under the CBSE curriculum. Built a strong foundation in sciences, mathematics, and logical reasoning that shaped my analytical thinking and problem-solving mindset.",
    location: "Riyadh, Saudi Arabia",
    board: "CBSE",
    tags: ["CBSE Board", "Science Stream", "Mathematics", "11 Years"],
  },
  {
    side: "right",
    icon: <BarChart3 size={24} />,
    logo: "/images/shaheen-logo.png",
    institution: "SHAHEEN JUNIOR COLLEGE",
    achievement: "93%",
    period: "2023 - 2025",
    highlight: "Achieved a stellar 93% in the Telangana Board of Intermediate Education. Specialised in MPC (Maths, Physics, Chemistry) while simultaneously beginning self-taught programming. This period ignited my passion for technology and engineering.",
    location: "Hyderabad, India",
    board: "TSBIE",
    tags: ["MPC Stream", "TSBIE Board", "93% Score", "Top Performer"],
  },
  {
    side: "left",
    icon: <GraduationCap size={24} />,
    logo: "/images/mjcet-logo.png",
    institution: "MUFFAKHAM JAH COLLEGE OF ENGINEERING AND TECHNOLOGY",
    degree: "BE - COMPUTER SCIENCE AND ENGINEERING",
    status: "CURRENT",
    period: "2025-2029",
    highlight: "Pursuing a Bachelor of Engineering in Computer Science with a focus on AI, full-stack development, and software engineering principles. Actively building real-world projects, participating in hackathons, and developing industry-ready expertise.",
    location: "Hyderabad, India",
    board: "OU",
    tags: ["CSE", "OU", "AI Focus", "Hackathons"],
    current: true,
  },
];

export default function EducationTimeline() {
  return (
    <section id="education" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accentCyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
          >
            My Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
          >
            EDUCATIONAL <br />
            <span className="text-secondaryText/30 uppercase">Journey</span>
          </motion.h2>
        </div>

        {/* Timeline — desktop: alternating, mobile: vertical stack */}
        <div className="relative pt-8 md:pt-20">
          {/* Vertical Line (desktop only) */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-accentCyan via-accentBlue to-transparent opacity-30" />

          {/* Mobile vertical line */}
          <div className="md:hidden absolute top-0 left-5 h-full w-[2px] bg-gradient-to-b from-accentCyan via-accentBlue to-transparent opacity-30" />

          {TIMELINE.map((item, index) => (
            <div key={index} className="relative mb-10 md:mb-24">

              {/* === DESKTOP LAYOUT === */}
              <div className={`hidden md:flex items-center justify-between w-full ${item.side === "left" ? "flex-row" : "flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-accentCyan z-10 shadow-[0_0_15px_rgba(100,255,218,0.5)]">
                  {item.current && (
                    <div className="absolute inset-0 rounded-full bg-accentCyan animate-ping opacity-75" />
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: item.side === "left" ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  style={{ willChange: "transform, opacity" }}
                  className={`w-[45%] ${item.side === "left" ? "text-right" : "text-left"}`}
                >
                  <div className="glass-card p-8 rounded-2xl space-y-4 relative group">
                    {item.status && (
                      <div className="absolute -top-3 left-8 px-3 py-1 bg-accentCyan/20 border border-accentCyan/40 rounded-full text-[10px] font-black text-accentCyan tracking-widest animate-pulse">
                        {item.status}
                      </div>
                    )}
                    <div className={`flex items-center gap-4 ${item.side === "left" ? "flex-row-reverse" : "flex-row"}`}>
                      {(item as any).logo ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-accentCyan/30 flex-shrink-0 shadow-[0_0_12px_rgba(100,255,218,0.2)]">
                          <Image src={(item as any).logo} alt={item.institution} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan transition-all duration-500 group-hover:text-background">
                          {item.icon}
                        </div>
                      )}
                      <div>
                        <h4 className="text-accentSilver text-xs font-mono">{item.period}</h4>
                        <h3 className="text-xl font-bold text-white group-hover:text-accentCyan transition-colors">{item.institution}</h3>
                      </div>
                    </div>
                    <p className="text-secondaryText text-sm leading-relaxed">{item.highlight}</p>

                    {/* Tags */}
                    {(item as any).tags && (
                      <div className={`flex flex-wrap gap-2 pt-1 ${item.side === "left" ? "justify-end" : "justify-start"}`}>
                        {(item as any).tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-1 rounded-lg bg-accentCyan/10 border border-accentCyan/20 text-[10px] font-bold text-accentCyan uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={`flex items-center justify-between pt-2 ${item.side === "left" ? "flex-row-reverse" : "flex-row"}`}>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{item.degree || item.achievement}</span>
                      {(item as any).location && (
                        <span className="text-[10px] text-secondaryText font-mono">📍 {(item as any).location}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* === MOBILE LAYOUT === */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="md:hidden flex items-start gap-4 pl-10"
              >
                {/* Mobile dot */}
                <div className="absolute left-[13px] top-3 w-4 h-4 rounded-full bg-background border-2 border-accentCyan z-10 shadow-[0_0_15px_rgba(100,255,218,0.5)]">
                  {item.current && (
                    <div className="absolute inset-0 rounded-full bg-accentCyan animate-ping opacity-75" />
                  )}
                </div>

                <div className="glass-card p-4 rounded-2xl space-y-3 relative group w-full border-white/5 active:border-accentCyan/30 transition-colors">
                  {item.status && (
                    <div className="inline-block px-3 py-0.5 bg-accentCyan/20 border border-accentCyan/40 rounded-full text-[9px] font-black text-accentCyan tracking-widest animate-pulse mb-1">
                      {item.status}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    {(item as any).logo ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-accentCyan/20 flex-shrink-0">
                        <Image src={(item as any).logo} alt={item.institution} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan flex-shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <div>
                      <p className="text-accentCyan text-[9px] font-mono">{item.period}</p>
                      <h3 className="text-sm font-black text-white leading-tight">{item.institution}</h3>
                    </div>
                  </div>
                  <p className="text-secondaryText text-[11px] leading-relaxed line-clamp-4">{item.highlight}</p>
                  {(item as any).tags && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(item as any).tags.map((tag: string) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-accentSilver uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{item.degree || item.achievement}</span>
                    {(item as any).location && (
                      <span className="text-[9px] text-secondaryText/60 font-mono">📍 {(item as any).location}</span>
                    )}
                  </div>
                </div>
              </motion.div>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

