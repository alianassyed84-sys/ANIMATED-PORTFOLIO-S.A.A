"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  const points = [
    "Currently pursuing B.E. in Computer Science and Engineering",
    "Based in Hyderabad, India",
    "Experience with Next.js,Firebase,Python,Flutter,Dart",
    "Passionate about AI integration",
    "Hackathon participant (HACKFORGE 2.0)",
    "Building scalable, user-centric applications",
  ];

  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Photo Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ willChange: "transform, opacity" }}
          className="relative group"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-accentCyan/20 group-hover:border-accentCyan/50 transition-colors duration-500 shadow-[0_0_30px_rgba(100,255,218,0.1)] group-hover:shadow-[0_0_50px_rgba(100,255,218,0.2)]">
            <div className="absolute inset-0 bg-accentCyan/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <Image
              src="/images/profile-photo.jpg"
              alt="Syed Anas Ali"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accentCyan/10 blur-3xl rounded-full" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-accentBlue/10 blur-3xl rounded-full" />
        </motion.div>

        {/* Content Column */}
        <div className="space-y-12">
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
            >
              Who am I?
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ willChange: "transform, opacity" }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
            >
              ABOUT <br />
              <span className="text-secondaryText/30 uppercase">Myself</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xl text-white leading-relaxed font-medium">
              Computer Science student and developer specializing in AI-powered web solutions.
              Currently pursuing BE in Computer Science at Muffakham Jah College of Engineering and Technology in Hyderabad, India.
            </p>
            <p className="text-secondaryText leading-relaxed">
              I have a deep passion for problem-solving and clean code. I'm continuously learning new technologies and exploring the intersection of design and engineering to build extraordinary digital experiences.
            </p>
          </motion.div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {points.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ willChange: "transform, opacity" }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 size={18} className="text-accentCyan flex-shrink-0" />
                <span className="text-secondaryText text-sm font-medium">{point}</span>
              </motion.div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}
