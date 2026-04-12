"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github, Instagram, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "21f2cbe5-5b34-42c2-ac61-72f159f283be");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000); // Reset after 5s
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-4 md:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
          >
            Get In Touch
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
          >
            LET&apos;S WORK <br />
            <span className="text-secondaryText/30 uppercase">Together</span>
          </motion.h2>
          <p className="text-secondaryText text-lg max-w-xl">
            Ready to build something extraordinary? I'm always open to new projects, collaborations, and discussions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-8">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-10 rounded-3xl space-y-6 md:space-y-8 relative overflow-hidden"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondaryText uppercase tracking-widest pl-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accentCyan transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondaryText uppercase tracking-widest pl-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="hello@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accentCyan transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondaryText uppercase tracking-widest pl-2">Message</label>
              <textarea 
                name="message"
                required
                rows={4}
                placeholder="Tell me about your project..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accentCyan transition-all resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={status === "loading"}
              className="w-full py-5 bg-accentCyan text-background rounded-2xl font-black uppercase tracking-[.2em] hover:bg-white hover:shadow-[0_0_25px_rgba(100,255,218,.4)] disabled:opacity-50 disabled:hover:bg-accentCyan disabled:hover:shadow-none transition-all flex items-center justify-center gap-3"
            >
              {status === "loading" ? "Sending..." : "Send Message"} 
              {status === "idle" && <Send size={18} />}
              {status === "loading" && <span className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full" />}
            </button>

            {/* Status Messages */}
            {status === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-secondary/95 backdrop-blur-md flex flex-col items-center justify-center text-center rounded-3xl z-10"
              >
                <CheckCircle2 size={64} className="text-green-400 mb-4" />
                <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                <p className="text-secondaryText mt-2">I'll get back to you within 24 hours.</p>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-secondary/95 backdrop-blur-md flex flex-col items-center justify-center text-center rounded-3xl z-10"
              >
                <AlertCircle size={64} className="text-red-400 mb-4" />
                <h3 className="text-2xl font-black text-white">Something went wrong.</h3>
                <p className="text-secondaryText mt-2">Please email me directly instead.</p>
              </motion.div>
            )}
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between py-4"
          >
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Connect</h3>
                <div className="flex flex-col gap-6">
                  <a href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=new" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan group-hover:text-background transition-all">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-secondaryText uppercase font-bold tracking-widest">Email</p>
                      <p className="text-white font-medium group-hover:text-accentCyan">syedanasaliofficialdeveloper@gmail.com</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accentBlue">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-secondaryText uppercase font-bold tracking-widest">Location</p>
                      <p className="text-white font-medium">Hyderabad, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Social</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Linkedin size={22} />, url: "https://linkedin.com/in/syed-anas-ali-861340384" },
                    { icon: <Github size={22} />, url: "https://github.com/alianassyed84-sys" },
                    { icon: <Instagram size={22} />, url: "https://instagram.com/syedanasali_official" },
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondaryText hover:text-accentCyan hover:border-accentCyan/30 hover:scale-110 transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-12">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-xs font-bold text-white uppercase tracking-widest italic">
                  Available for new projects
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
