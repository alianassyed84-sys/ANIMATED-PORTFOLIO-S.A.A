"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Code2, GitCommit, Star } from "lucide-react";

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
            GITHUB <br />
            <span className="text-secondaryText/30 uppercase">Statistics</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
             <div>
                <p className="text-secondaryText text-xs font-bold uppercase tracking-wider mb-1">Public Repos</p>
                <h3 className="text-3xl font-black text-white">{data.public_repos}</h3>
             </div>
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white"><Github size={24} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
             <div>
                <p className="text-secondaryText text-xs font-bold uppercase tracking-wider mb-1">Followers</p>
                <h3 className="text-3xl font-black text-white">{data.followers}</h3>
             </div>
             <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><GitCommit size={24} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
             <div>
                <p className="text-secondaryText text-xs font-bold uppercase tracking-wider mb-1">Total Stars</p>
                <h3 className="text-3xl font-black text-white">{data.totalStars}</h3>
             </div>
             <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400"><Star size={24} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
             <div>
                <p className="text-secondaryText text-xs font-bold uppercase tracking-wider mb-1">Top Languages</p>
                <div className="flex flex-col gap-1 mt-1">
                  {data.topLanguages.map((lang, idx) => (
                    <span key={idx} className="text-sm font-bold text-accentCyan flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accentCyan" /> {lang.name}
                    </span>
                  ))}
                </div>
             </div>
             <div className="w-12 h-12 rounded-full bg-accentCyan/10 flex items-center justify-center text-accentCyan"><Code2 size={24} /></div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
