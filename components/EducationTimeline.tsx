"use client";

import { motion } from "framer-motion";
import { GraduationCap, BarChart3, Binary, Award } from "lucide-react";

const TIMELINE = [
  {
    side: "left",
    icon: <GraduationCap size={24} />,
    institution: "International Indian School, Riyadh",
    achievement: "A Grade",
    period: "2012 - 2023",
    highlight: "Strong academic discipline and conceptual clarity",
  },
  {
    side: "right",
    icon: <BarChart3 size={24} />,
    institution: "Shaheen Junior College",
    achievement: "93%",
    period: "2023 - 2025",
    highlight: "Commitment to excellence and academic growth",
  },
  {
    side: "left",
    icon: <Binary size={24} />,
    institution: "Muffakham Jah College of Engineering",
    degree: "BE - Computer Science",
    status: "CURRENT",
    period: "2025-2029",
    highlight: "Developing technical skills and industry-ready expertise",
    current: true,
  },
];

export default function EducationTimeline() {
  return (
    <section id="education" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accentCyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative">
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
            className="text-6xl md:text-8xl font-black text-white"
          >
            EDUCATIONAL <br />
            <span className="text-secondaryText/30 uppercase">Journey</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative pt-20">
          {/* Vertical Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-accentCyan via-accentBlue to-transparent opacity-30" />

          {TIMELINE.map((item, index) => (
            <div key={index} className={`relative mb-24 flex items-center justify-between w-full ${item.side === "left" ? "flex-row" : "flex-row-reverse"}`}>
              {/* Dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-accentCyan z-10 shadow-[0_0_15px_rgba(100,255,218,0.5)]">
                {item.current && (
                  <div className="absolute inset-0 rounded-full bg-accentCyan animate-ping opacity-75" />
                )}
              </div>

              {/* Card Container */}
              <motion.div
                initial={{ opacity: 0, x: item.side === "left" ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`w-[45%] ${item.side === "left" ? "text-right" : "text-left"}`}
              >
                <div className="glass-card p-8 rounded-2xl space-y-4 relative group">
                  {item.status && (
                    <div className="absolute -top-3 left-8 px-3 py-1 bg-accentCyan/20 border border-accentCyan/40 rounded-full text-[10px] font-black text-accentCyan tracking-widest animate-pulse">
                      {item.status}
                    </div>
                  )}

                  <div className={`flex items-center gap-4 ${item.side === "left" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className="w-12 h-12 rounded-xl bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan transition-all duration-500 group-hover:text-background">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-accentSilver text-xs font-mono">{item.period}</h4>
                      <h3 className="text-xl font-bold text-white group-hover:text-accentCyan transition-colors">
                        {item.institution}
                      </h3>
                    </div>
                  </div>

                  <p className="text-secondaryText text-sm leading-relaxed">
                    {item.highlight}
                  </p>

                  <div className={`flex items-center gap-2 pt-2 ${item.side === "left" ? "justify-end" : "justify-start"}`}>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {item.degree || item.achievement}
                    </span>
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
