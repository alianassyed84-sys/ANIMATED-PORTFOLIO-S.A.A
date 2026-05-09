"use client";

import { motion } from "framer-motion";

const ORBITS = [
  {
    radius: 100,
    duration: 16,
    skills: ["React", "Next.js", "TypeScript"],
    color: "#64FFDA",
    dotColor: "#64FFDA",
  },
  {
    radius: 162,
    duration: 28,
    skills: ["Python", "TensorFlow", "Firebase", "Node.js"],
    color: "#818CF8",
    dotColor: "#818CF8",
  },
  {
    radius: 228,
    duration: 42,
    skills: ["Computer Vision", "Tailwind", "PostgreSQL", "Docker", "Git"],
    color: "#C084FC",
    dotColor: "#C084FC",
  },
  {
    radius: 298,
    duration: 60,
    skills: ["OpenCV", "Framer Motion", "Three.js", "MongoDB", "Linux", "REST APIs"],
    color: "#60A5FA",
    dotColor: "#60A5FA",
  },
];

export default function SkillSphere() {
  const SIZE = 700;
  const CENTER = SIZE / 2;

  return (
    <div className="w-full flex items-center justify-center py-8" style={{ minHeight: SIZE }}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>

        {/* ── Orbit ring traces ── */}
        {ORBITS.map((orbit, i) => (
          <div
            key={`ring-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orbit.radius * 2,
              height: orbit.radius * 2,
              top: CENTER - orbit.radius,
              left: CENTER - orbit.radius,
              border: `1px solid ${orbit.color}20`,
              boxShadow: `0 0 20px ${orbit.color}08`,
            }}
          />
        ))}

        {/* ── Orbiting skill pills ── */}
        {ORBITS.map((orbit, orbitIdx) =>
          orbit.skills.map((skill, skillIdx) => {
            const totalSkills = orbit.skills.length;
            const startAngle = (360 / totalSkills) * skillIdx;

            return (
              // Orbit container — rotates 360° continuously
              <motion.div
                key={`${orbitIdx}-${skill}`}
                style={{
                  position: "absolute",
                  width: orbit.radius * 2,
                  height: orbit.radius * 2,
                  top: CENTER - orbit.radius,
                  left: CENTER - orbit.radius,
                  borderRadius: "50%",
                  rotate: startAngle,
                }}
                animate={{ rotate: startAngle + 360 }}
                transition={{
                  duration: orbit.duration,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 0,
                }}
              >
                {/* Pill — counter-rotates to stay upright */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    x: "-50%",
                    rotate: -startAngle,
                  }}
                  animate={{ rotate: -(startAngle + 360) }}
                  transition={{
                    duration: orbit.duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 0,
                  }}
                >
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold whitespace-nowrap select-none text-[11px] uppercase tracking-wider"
                    style={{
                      color: orbit.color,
                      background: `${orbit.color}12`,
                      border: `1px solid ${orbit.color}35`,
                      boxShadow: `0 0 14px ${orbit.color}18, inset 0 0 8px ${orbit.color}08`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: orbit.color, boxShadow: `0 0 6px ${orbit.color}` }}
                    />
                    {skill}
                  </span>
                </motion.div>
              </motion.div>
            );
          })
        )}

        {/* ── Center Sun ── */}
        <div
          className="absolute"
          style={{ top: CENTER, left: CENTER, transform: "translate(-50%, -50%)" }}
        >
          {/* Outermost slow pulse */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 110,
              height: 110,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              border: "1px solid rgba(100,255,218,0.15)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(100,255,218,0.15) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />

          {/* Core sphere */}
          <motion.div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg, #64FFDA 0%, #3B82F6 60%, #7C3AED 100%)",
              boxShadow:
                "0 0 30px rgba(100,255,218,0.4), 0 0 60px rgba(100,255,218,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-black text-sm text-[#0A192F] tracking-tight drop-shadow">
              SAA
            </span>
          </motion.div>
        </div>

        {/* ── Legend ── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4 flex-wrap justify-center pb-2">
          {ORBITS.map((orbit, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: orbit.color, boxShadow: `0 0 5px ${orbit.color}` }}
              />
              <span className="text-[10px] text-white/30 font-mono">
                Orbit {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
