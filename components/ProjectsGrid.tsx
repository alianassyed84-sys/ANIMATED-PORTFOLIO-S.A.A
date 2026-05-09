"use client";

import ProjectCard from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const PROJECTS = [
  {
    category: "E-COMMERCE",
    categoryColor: "#4ade80",
    year: "2025",
    title: "Rebook India",
    description: "Community-driven book marketplace connecting students across Hyderabad to buy and sell second-hand books with smart revenue sharing.",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "Vercel"],
    image: "/projects/rebook-mockup.png",
    featured: true,
  },
  {
    category: "EDUCATION",
    categoryColor: "#3b82f6",
    year: "2026",
    title: "EduPath — AI Study",
    description: "AI-powered study platform helping students create personalized learning paths using Claude API for adaptive learning experiences.",
    technologies: ["Next.js 14", "Claude API", "Firebase", "React Query"],
    image: "/projects/edupath-mockup.png",
  },
  {
    category: "AI",
    categoryColor: "#b794f6",
    year: "2025",
    title: "TraffiSense — Traffic AI",
    description: "Real-time traffic monitoring system using computer vision and AI to analyze traffic flow, detect violations, and optimize signal timing.",
    technologies: ["Python", "OpenCV", "YOLOv8", "Flask", "MongoDB"],
    image: "/projects/traffisense-mockup.png",
    featured: true,
  },
  {
    category: "FULLSTACK",
    categoryColor: "#00d9ff",
    year: "2025",
    title: "FitTrack Pro",
    description: "Comprehensive fitness tracking application with workout planning, nutrition monitoring, progress analytics, and personalized insights.",
    technologies: ["Next.js", "Firebase", "Chart.js", "Tailwind CSS"],
    image: "/projects/fittrack-mockup.png",
  },
];

const FILTERS = ["All", "E-COMMERCE", "EDUCATION", "AI", "FULLSTACK"];

export default function ProjectsGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="py-16 md:py-32 px-4 md:px-12 bg-secondary relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(100,255,218,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-12 relative">
        {/* Header */}
        <div className="space-y-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
          >
            Selected Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9]"
          >
            FEATURED <br />
            <span className="text-secondaryText/30">PROJECTS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl text-secondaryText text-lg"
          >
            A curated selection of my most impactful digital projects and experiments.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-accentCyan text-background shadow-[0_0_20px_rgba(100,255,218,0.3)]"
                  : "bg-white/5 border border-white/10 text-secondaryText hover:text-white hover:border-white/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/5"
        >
          {[
            { value: "4+", label: "Projects Built" },
            { value: "3+", label: "Technologies" },
            { value: "100%", label: "Passion Driven" },
            { value: "∞", label: "Ideas Brewing" },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1 py-6 glass-card rounded-2xl">
              <div className="text-3xl md:text-4xl font-black text-accentCyan">{stat.value}</div>
              <div className="text-secondaryText text-xs uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
