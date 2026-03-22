"use client";

import { motion } from "framer-motion";
import { 
  Code2, Database, BrainCircuit, Wrench, 
  Layout, Server, Cpu, Github, Laptop, Layers, 
  Smartphone, Activity
} from "lucide-react";

const SKILLS = [
  {
    category: "Frontend",
    icon: <Layout className="text-accentCyan" />,
    items: ["React.js", "Next.js", "Tailwind CSS", "HTML5/CSS3", "JavaScript", "Framer Motion"],
  },
  {
    category: "Backend",
    icon: <Server className="text-accentBlue" />,
    items: ["Python", "Firebase", "Node.js", "REST APIs", "Express.js", "MongoDB"],
  },
  {
    category: "AI / ML",
    icon: <BrainCircuit className="text-purple-400" />,
    items: ["Claude API", "TensorFlow", "OpenCV", "Machine Learning", "Computer Vision"],
  },
  {
    category: "Tools & Others",
    icon: <Wrench className="text-accentSilver" />,
    items: ["Git / GitHub", "Vercel", "VS Code", "Figma", "PostgreSQL", "PWA"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accentCyan rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accentBlue rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative">
        {/* Header */}
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
            className="text-6xl md:text-8xl font-black text-white"
          >
            TECH <br />
            <span className="text-secondaryText/30 uppercase">Stack</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="glass-card p-8 rounded-3xl space-y-6 group hover:border-accentCyan/30"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{skill.category}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-secondaryText hover:text-accentCyan hover:border-accentCyan/30 hover:bg-accentCyan/5 transition-all cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
