"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  category: string;
  categoryColor: string;
  year: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
}

export default function ProjectCard({
  category,
  categoryColor,
  year,
  title,
  description,
  technologies,
  image,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card overflow-hidden group rounded-3xl"
    >
      {/* Image Container */}
      <div className="h-64 overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span 
            className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}40` }}
          >
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="text-secondaryText text-xs font-mono">{year}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-4">
        <h3 className="text-2xl font-black text-white group-hover:text-accentCyan transition-colors">
          {title}
        </h3>
        <p className="text-secondaryText text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-accentSilver font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
