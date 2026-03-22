"use client";

import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

const PROJECTS = [
  {
    category: "E-COMMERCE",
    categoryColor: "#4ade80",
    year: "2025",
    title: "Rebook India",
    description: "Community-driven book marketplace connecting students across Hyderabad to buy and sell second-hand books with smart revenue sharing.",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "Vercel"],
    image: "/projects/rebook-mockup.png",
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

export default function ProjectsGrid() {
  return (
    <section id="work" className="py-24 px-6 md:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto space-y-12">
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
            className="text-6xl md:text-8xl font-black text-white leading-[0.9]"
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
