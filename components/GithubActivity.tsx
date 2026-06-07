"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Code2, GitCommit, Star } from "lucide-react";
import GlitchText from "./GlitchText";


interface GithubData {
  followers: number;
  public_repos: number;
  totalStars: number;
  topLanguages: { name: string; count: number }[];
}

export default function GithubActivity() {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);

  // We use Syed Anas Ali's GitHub, or fallback
  const username = "syedanasali"; 

  useEffect(() => {
    async function fetchGithubData() {
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("User fetch failed");
        const userData = await userRes.json();

        // Fetch repos to get stars and languages
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error("Repos fetch failed");
        const reposData = await reposRes.json();

        let totalStars = 0;
        const languagesCount: Record<string, number> = {};

        reposData.forEach((repo: any) => {
          totalStars += repo.stargazers_count;
          if (repo.language) {
            languagesCount[repo.language] = (languagesCount[repo.language] || 0) + 1;
          }
        });

        const topLanguages = Object.entries(languagesCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3); // top 3 languages

        setData({
          followers: userData.followers,
          public_repos: userData.public_repos,
          totalStars,
          topLanguages,
        });
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGithubData();
  }, []);

  if (loading || !data) return null;

  return (
    <section id="activity" className="py-16 md:py-24 px-4 md:px-12 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
          >
            Live Activity
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
          >
            <GlitchText text="GITHUB" glitchInterval={3000} />
            <br />
            <span className="text-secondaryText/30 uppercase">Statistics</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Public Repos", value: data.public_repos, icon: Github, color: "#64FFDA", delay: 0 },
            { label: "Followers", value: data.followers, icon: GitCommit, color: "#3b82f6", delay: 0.1 },
            { label: "Total Stars", value: data.totalStars, icon: Star, color: "#D4AF37", delay: 0.2 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.7 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card-crazy holo-border p-6 rounded-2xl flex items-center justify-between float-anim"
              style={{ animationDelay: `${stat.delay}s` }}
            >
              <div>
                <p className="text-secondaryText text-[10px] font-black uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</h3>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon size={22} />
              </div>
            </motion.div>
          ))}

          {/* Top Languages card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card-crazy holo-border p-6 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-secondaryText text-[10px] font-black uppercase tracking-[0.3em] mb-2">Top Languages</p>
              <div className="flex flex-col gap-1.5">
                {data.topLanguages.map((lang, idx) => (
                  <span key={idx} className="text-sm font-black text-accentCyan flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accentCyan" style={{ boxShadow: "0 0 6px #64FFDA" }} />
                    {lang.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accentCyan/10 flex items-center justify-center text-accentCyan" style={{ border: "1px solid rgba(100,255,218,0.3)" }}>
              <Code2 size={22} />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
