"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { CheckCircle2, Code2, Zap, Trophy, Coffee } from "lucide-react";
import Image from "next/image";

const POINTS = [
  "Currently pursuing B.E. in Computer Science & Engineering",
  "Based in Hyderabad, India",
  "Full-stack with Next.js, Firebase, Python, Flutter",
  "Passionate about AI integration and computer vision",
  "Hackathon participant — HACKFORGE 2.0",
  "Building scalable, user-centric applications",
];

const STATS = [
  { icon: Code2, value: 10, suffix: "+", label: "Projects Built", color: "#64FFDA" },
  { icon: Zap, value: 3, suffix: "+", label: "Years Coding", color: "#3b82f6" },
  { icon: Trophy, value: 1, suffix: "x", label: "Hackathon", color: "#b794f6" },
  { icon: Coffee, value: 999, suffix: "+", label: "Cups of Tea", color: "#f59e0b" },
];

function StatCounter({
  value, suffix, label, icon: Icon, color, delay,
}: {
  value: number; suffix: string; label: string; icon: React.ElementType; color: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (v) => setDisplayed(Math.round(v)),
      });
      return controls.stop;
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <div ref={ref} className="glass-card p-5 rounded-2xl text-center group hover:border-accentCyan/30 transition-all duration-300">
      <div
        className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <Icon size={20} />
      </div>
      <div className="text-2xl md:text-3xl font-black" style={{ color }}>
        {displayed}{suffix}
      </div>
      <div className="text-secondaryText text-xs uppercase tracking-widest font-bold mt-1">{label}</div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-32 px-4 md:px-12 bg-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentCyan/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accentBlue/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
          >
            Who am I?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ willChange: "transform, opacity" }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
          >
            ABOUT <br />
            <span className="text-secondaryText/30 uppercase">Myself</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Photo Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative group"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-accentCyan/20 group-hover:border-accentCyan/50 transition-colors duration-500 shadow-[0_0_40px_rgba(100,255,218,0.08)] group-hover:shadow-[0_0_60px_rgba(100,255,218,0.18)]">
              <div className="absolute inset-0 bg-accentCyan/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <Image
                src="/images/profile-photo.jpg"
                alt="Syed Anas Ali"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Overlay text on photo */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent z-20">
                <div className="text-white font-black text-lg">Syed Anas Ali</div>
                <div className="text-accentCyan text-xs font-mono uppercase tracking-widest">Creative Developer</div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl shadow-xl border border-accentCyan/20 z-20"
            >
              <div className="text-accentCyan font-black text-lg">2025</div>
              <div className="text-secondaryText text-[10px] uppercase tracking-widest">Started CSE</div>
            </motion.div>

            {/* Decorative glow orbs */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accentCyan/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-accentBlue/10 blur-3xl rounded-full pointer-events-none" />
          </motion.div>

          {/* Content Column */}
          <div className="space-y-10">
            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {STATS.map((stat, i) => (
                <StatCounter key={stat.label} {...stat} delay={0.3 + i * 0.1} />
              ))}
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="space-y-4"
            >
              <p className="text-xl text-white leading-relaxed font-medium">
                Computer Science student and developer specializing in AI-powered web solutions at{" "}
                <span className="text-accentCyan font-bold">MJCET, Hyderabad</span>.
              </p>
              <p className="text-secondaryText leading-relaxed">
                I have a deep passion for problem-solving and clean code. I&apos;m continuously learning new technologies
                and exploring the intersection of design and engineering to build extraordinary digital experiences.
              </p>
            </motion.div>

            {/* Key Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="grid grid-cols-1 gap-3"
            >
              {POINTS.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.07, duration: 0.5 }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-center gap-3 group"
                >
                  <CheckCircle2
                    size={16}
                    className="text-accentCyan flex-shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-secondaryText text-sm font-medium group-hover:text-white transition-colors">
                    {point}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
