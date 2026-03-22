"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github, Instagram, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-secondary">
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
            className="text-6xl md:text-8xl font-black text-white"
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
            className="glass-card p-10 rounded-3xl space-y-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondaryText uppercase tracking-widest pl-2">Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accentCyan transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondaryText uppercase tracking-widest pl-2">Email</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accentCyan transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondaryText uppercase tracking-widest pl-2">Message</label>
              <textarea 
                rows={4}
                placeholder="Tell me about your project..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accentCyan transition-all resize-none"
              />
            </div>

            <button className="w-full py-5 bg-accentCyan text-background rounded-2xl font-black uppercase tracking-[.2em] hover:bg-white hover:shadow-[0_0_25px_rgba(100,255,218,.4)] transition-all flex items-center justify-center gap-3">
              Send Message <Send size={18} />
            </button>
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
                  <a href="mailto:syedanasaliofficialdeveloper@gmail.com" className="flex items-center gap-4 group">
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
                    { icon: <Github size={22} />, url: "https://github.com/alianassyed84-" },
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
