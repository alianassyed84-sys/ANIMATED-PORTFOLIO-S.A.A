"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  BrainCircuit, Wrench,
  Layout, Server, Users, Lightbulb, MessageSquare, Target, Puzzle, Clock,
} from "lucide-react";
import SkillSphere from "./SkillSphere";
import GlitchText from "./GlitchText";


// ─── TECHNICAL SKILLS ───────────────────────────────────────────────────────
const TECH_SKILLS = [
  {
    category: "Frontend",
    icon: Layout,
    color: "#64FFDA",
    items: [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 88 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Framer Motion", level: 80 },
      { name: "TypeScript", level: 75 },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    color: "#3b82f6",
    items: [
      { name: "Python", level: 85 },
      { name: "C Language", level: 78 },
      { name: "Firebase", level: 85 },
      { name: "Node.js", level: 70 },
      { name: "REST APIs", level: 88 },
    ],
  },
  {
    category: "AI / ML",
    icon: BrainCircuit,
    color: "#b794f6",
    items: [
      { name: "Claude API", level: 85 },
      { name: "OpenCV", level: 80 },
      { name: "YOLOv8", level: 75 },
      { name: "TensorFlow", level: 65 },
      { name: "Computer Vision", level: 78 },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: Wrench,
    color: "#CCD6F6",
    items: [
      { name: "Git / GitHub", level: 90 },
      { name: "Vercel", level: 88 },
      { name: "Figma", level: 70 },
      { name: "VS Code", level: 95 },
      { name: "PostgreSQL", level: 65 },
    ],
  },
];

// ─── SOFT SKILLS ────────────────────────────────────────────────────────────
const SOFT_SKILLS = [
  { icon: Lightbulb, label: "Problem Solving", desc: "Breaking complex problems into elegant, logical solutions.", color: "#f59e0b" },
  { icon: MessageSquare, label: "Communication", desc: "Explaining technical concepts clearly to both devs and non-devs.", color: "#64FFDA" },
  { icon: Users, label: "Team Collaboration", desc: "Working effectively in cross-functional hackathon and project teams.", color: "#3b82f6" },
  { icon: Target, label: "Goal-Oriented", desc: "Focused on delivering impactful results that meet real user needs.", color: "#4ade80" },
  { icon: Puzzle, label: "Adaptability", desc: "Quickly picking up new frameworks, languages, and paradigms.", color: "#b794f6" },
  { icon: Clock, label: "Time Management", desc: "Balancing academics, self-learning, and real-world project deadlines.", color: "#f87171" },
];

// ─── LANGUAGES SPOTLIGHT ────────────────────────────────────────────────────
const LANGUAGES = [
  { name: "Python", level: 85, color: "#3b82f6", note: "Projects: TraffiSense, EduPath AI, automation scripts" },
  { name: "C Language", level: 78, color: "#64FFDA", note: "Systems programming, data structures, algorithms" },
  { name: "JavaScript / TypeScript", level: 90, color: "#f59e0b", note: "Full-stack web — Next.js, React, Node.js" },
  { name: "HTML / CSS", level: 95, color: "#4ade80", note: "Semantic markup, animations, responsive layouts" },
  { name: "Dart (Flutter)", level: 60, color: "#b794f6", note: "Cross-platform mobile apps — currently learning" },
];

// ─── MARQUEE PILLS ──────────────────────────────────────────────────────────
const TECH_PILLS = [
  "Python", "C Language", "React", "Next.js", "Firebase", "TailwindCSS",
  "TypeScript", "OpenCV", "YOLOv8", "Claude AI", "MongoDB", "Figma", "Git",
  "Node.js", "REST APIs", "TensorFlow", "Vercel", "Dart",
];

// ─── ANIMATED SKILL BAR ─────────────────────────────────────────────────────
function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const controls = animate(0, level, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (v) => setDisplayed(Math.round(v)),
      });
      return controls.stop;
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, level, delay]);

  return (
    <div ref={ref} className="space-y-1.5 group">
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondaryText font-medium group-hover:text-white transition-colors">{name}</span>
        <span className="text-xs font-black font-mono" style={{ color }}>{displayed}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-32 px-4 md:px-12 bg-transparent relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accentCyan rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accentBlue rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative">

        {/* ── HEADER ── */}
        <div className="text-center space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
          >
            Technical Proficiency
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
          >
            <GlitchText text="TECH" glitchInterval={3200} />
            <br />
            <span className="text-secondaryText/30 uppercase">Stack</span>
          </motion.h2>
        </div>

        {/* ── MARQUEE ── */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 w-20 h-full z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 w-20 h-full z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          <motion.div
            animate={{ x: [0, -1400] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            className="flex gap-3 w-max"
          >
            {[...TECH_PILLS, ...TECH_PILLS].map((pill, i) => (
              <span
                key={i}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-secondaryText font-mono whitespace-nowrap hover:text-accentCyan hover:border-accentCyan/30 transition-colors"
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── SOLAR SYSTEM SKILL VISUALIZATION ── */}
        <div className="py-4 md:py-8 flex flex-col items-center overflow-visible">
          <p className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase mb-6 opacity-60">Tech Solar System</p>
          <SkillSphere />
        </div>

        {/* ── TECHNICAL SKILLS GRID ── */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase mb-8"
          >
            Technical Skills
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {TECH_SKILLS.map((skill, catIndex) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.8 }}
                style={{ willChange: "transform, opacity" }}
                className="glass-card-crazy holo-border p-7 rounded-3xl space-y-6 group transition-all duration-500"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl border transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundColor: `${skill.color}15`,
                      borderColor: `${skill.color}30`,
                      color: skill.color,
                    }}
                  >
                    <skill.icon size={20} />
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">{skill.category}</h3>
                </div>

                <div className="space-y-4">
                  {skill.items.map((item, itemIndex) => (
                    <SkillBar
                      key={item.name}
                      name={item.name}
                      level={item.level}
                      color={skill.color}
                      delay={catIndex * 0.15 + itemIndex * 0.08}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── PROGRAMMING LANGUAGES SPOTLIGHT ── */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase mb-8"
          >
            Programming Languages
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LANGUAGES.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="glass-card p-6 rounded-2xl space-y-3 group hover:border-accentCyan/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lang.color, boxShadow: `0 0 8px ${lang.color}` }}
                    />
                    <span className="text-white font-black text-sm">{lang.name}</span>
                  </div>
                  <span className="text-xs font-black font-mono" style={{ color: lang.color }}>{lang.level}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${lang.color}60, ${lang.color})`,
                      boxShadow: `0 0 10px ${lang.color}50`,
                    }}
                  />
                </div>
                <p className="text-secondaryText text-xs leading-relaxed">{lang.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── SOFT SKILLS ── */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase mb-8"
          >
            Soft Skills
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOFT_SKILLS.map((skill, i) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7 }}
                className="glass-card p-6 rounded-2xl flex items-start gap-4 group hover:border-accentCyan/20 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${skill.color}15`, color: skill.color }}
                >
                  <skill.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-black text-sm group-hover:text-accentCyan transition-colors">{skill.label}</h4>
                  <p className="text-secondaryText text-xs leading-relaxed">{skill.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM NOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-4"
        >
          <p className="text-secondaryText text-sm">
            Always expanding my skill set •{" "}
            <span className="text-accentCyan font-bold">Currently learning: Flutter & Cloud Architecture</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
