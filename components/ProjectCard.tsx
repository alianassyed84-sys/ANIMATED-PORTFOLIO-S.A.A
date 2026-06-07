"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, Play, VolumeX } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface ProjectCardProps {
  category: string;
  categoryColor: string;
  year: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  images?: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export default function ProjectCard({
  category,
  categoryColor,
  year,
  title,
  description,
  technologies,
  image,
  images,
  videoUrl,
  liveUrl,
  githubUrl,
  featured,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // States
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Resolve images array
  const displayImages = images && images.length > 0 ? images : [image || "/projects/placeholder.png"];

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Automatic slideshow
  useEffect(() => {
    if (displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [displayImages.length]);

  // Video hover controls
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (isHovered) {
      video.currentTime = 0;
      video.play().catch((err) => console.log("Video autoplay blocked/failed: ", err));
    } else {
      video.pause();
    }
  }, [isHovered, videoUrl]);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handle tap for mobile (since hover isn't reliable)
  const handleTap = () => {
    if (window.innerWidth < 768 && liveUrl) {
      window.open(liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        rotateX: typeof window !== 'undefined' && window.innerWidth > 768 ? rotateX : 0, 
        rotateY: typeof window !== 'undefined' && window.innerWidth > 768 ? rotateY : 0, 
        transformStyle: "preserve-3d", 
        willChange: "transform" 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      className="group relative glass-card-crazy holo-border scanline-sweep overflow-hidden rounded-3xl cursor-pointer"
    >
      {featured && (
        <div className="absolute -top-3 left-8 z-20 px-4 py-1.5 bg-accentCyan text-background text-[10px] font-black uppercase tracking-widest rounded-full neon-flicker shadow-[0_0_20px_rgba(100,255,218,0.6)]">
          Featured
        </div>
      )}

      {/* Image / Video Container */}
      <div className="h-52 sm:h-60 md:h-72 overflow-hidden relative bg-black/40">
        {/* Slideshow of Images */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={displayImages[currentSlideIndex]}
                alt={`${title} - slide ${currentSlideIndex}`}
                fill
                priority={currentSlideIndex === 0}
                className="object-cover transition-transform duration-700 md:group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Video Showcase Overlay (Plays on hover) */}
        {videoUrl && (
          <div 
            className={`absolute inset-0 z-10 bg-black transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover"
            />
            {/* Small glass badge showing it's a video demonstration */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-green-400">
              <Play size={10} fill="currentColor" /> Live Showcase
            </div>
            {/* Speaker muted badge */}
            <div className="absolute bottom-4 right-4 z-20 w-6 h-6 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70">
              <VolumeX size={12} />
            </div>
          </div>
        )}

        {/* Slideshow Pagination Indicator Dots */}
        {displayImages.length > 1 && !isHovered && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentSlideIndex === idx ? "bg-accentCyan w-3" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Overlay on hover (Desktop) / Persistent small indicators (Mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/70 backdrop-blur-sm hidden md:flex items-center justify-center gap-4 z-20 transition-all"
        >
          {liveUrl && (
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accentCyan text-background text-xs font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} strokeWidth={3} />
              Live Demo
            </motion.a>
          )}
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-wider hover:bg-white/20 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={14} strokeWidth={2} />
              Source
            </motion.a>
          )}
        </motion.div>

        {/* Mobile Link Shortcut */}
        <div className="absolute bottom-4 right-4 z-20 md:hidden flex gap-2">
            {liveUrl && (
                 <a 
                    href={liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-accentCyan text-background flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    onClick={(e) => e.stopPropagation()}
                 >
                    <ExternalLink size={18} strokeWidth={3} />
                 </a>
            )}
        </div>

        {/* Category + Year badges */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md"
            style={{
              backgroundColor: `${categoryColor}25`,
              color: categoryColor,
              border: `1px solid ${categoryColor}50`,
            }}
          >
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <span className="text-white/60 text-[10px] md:text-xs font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
            {year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg md:text-2xl font-black text-white group-hover:text-accentCyan transition-colors duration-300 leading-tight">
            {title}
          </h3>
          <motion.div
            initial={{ opacity: 0, rotate: -45 }}
            whileHover={{ opacity: 1, rotate: 0 }}
            className="w-8 h-8 rounded-full border border-accentCyan/30 hidden md:flex items-center justify-center text-accentCyan flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ArrowUpRight size={14} />
          </motion.div>
        </div>

        <p className="text-secondaryText text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">{description}</p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] md:text-[10px] text-accentSilver font-mono hover:text-accentCyan hover:border-accentCyan/30 hover:bg-accentCyan/5 transition-all"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom glow on hover (Desktop) */}
      <div
        className="absolute bottom-0 left-0 w-full h-1 opacity-0 md:group-hover:opacity-100 transition-all duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)` }}
      />
    </motion.div>
  );
}
