"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, MapPin, Github, Linkedin, CheckCircle2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import GlitchText from "./GlitchText";

const SOCIALS = [
  { icon: Github, label: "GitHub", href: "https://github.com/alianassyed84", color: "#fff", gradient: "from-white/10 to-white/5" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/syedanasali", color: "#0A66C2", gradient: "from-blue-500/10 to-blue-500/5" },
  { icon: Mail, label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=syedanasaliofficialdeveloper@gmail.com", color: "#64FFDA", gradient: "from-accentCyan/10 to-accentCyan/5" },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "8984cef0-b989-49b8-80cb-bcb47c5a3886",
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New Portfolio Message from ${formState.name || "Visitor"}`,
          from_name: "Portfolio Contact Form",
        }),
      });
      const web3Result = await web3FormsResponse.json();
      if (!web3Result.success) throw new Error(web3Result.message || "Failed to send email");
      try {
        await addDoc(collection(db, "messages"), {
          name: formState.name, email: formState.email, message: formState.message,
          createdAt: serverTimestamp(), read: false,
        });
      } catch (fbError) { console.warn("Firebase save failed:", fbError); }
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="py-16 md:py-32 px-4 md:px-12 bg-transparent relative overflow-hidden">
      {/* Ambient glows — enhanced */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-accentCyan/6 blur-[200px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accentBlue/6 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/4 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase neon-flicker"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ willChange: "transform, opacity" }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
          >
            <GlitchText text="LET'S" glitchInterval={4500} />{" "}
            <span className="text-secondaryText/30 uppercase">Connect</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-secondaryText text-lg max-w-2xl mx-auto"
          >
            Have a project in mind or want to collaborate? I&apos;m always open to exciting opportunities.
          </motion.p>
          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="section-divider max-w-xs mx-auto mt-6"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Mail, label: "Email",
                  value: "syedanasaliofficialdeveloper@gmail.com",
                  href: "https://mail.google.com/mail/?view=cm&fs=1&to=syedanasaliofficialdeveloper@gmail.com",
                  color: "#64FFDA",
                },
                { icon: MapPin, label: "Location", value: "Hyderabad, India", href: null, color: "#b794f6" },
              ].map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass-card-crazy holo-border p-5 rounded-2xl flex items-center gap-4 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${info.color}15`, color: info.color, border: `1px solid ${info.color}30`, boxShadow: `0 0 20px ${info.color}10` }}
                  >
                    <info.icon size={20} />
                  </div>
                  <div>
                    <p className="text-secondaryText text-[10px] uppercase tracking-[0.3em] font-black mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-white text-sm font-medium hover:text-accentCyan transition-colors break-all">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-secondaryText text-[10px] uppercase tracking-[0.3em] font-black">Find me on</p>
              <div className="flex gap-3">
                {SOCIALS.map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    title={social.label}
                    className="w-14 h-14 rounded-2xl glass-card-crazy holo-border flex items-center justify-center text-secondaryText hover:text-white transition-all duration-300 relative overflow-hidden"
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability badge — premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="glass-card-crazy aurora-border p-5 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 blur-3xl rounded-full" />
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-3 h-3">
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  <div className="relative w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-white font-black text-sm">Available for opportunities</span>
              </div>
              <p className="text-secondaryText text-xs leading-relaxed">
                Open to internships, freelance projects, and full-time roles. Let&apos;s build something amazing together.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Internships", "Freelance", "Full-time"].map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-lg bg-green-400/10 border border-green-400/20 text-[9px] font-bold text-green-400 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="glass-card-crazy holo-border p-8 md:p-10 rounded-3xl relative overflow-hidden scanline-sweep">
              <div className="absolute top-0 right-0 w-60 h-60 bg-accentCyan/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-accentBlue/5 blur-[60px] rounded-full pointer-events-none" />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-6 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.6 }}
                    className="w-24 h-24 rounded-full bg-accentCyan/20 border-2 border-accentCyan/40 flex items-center justify-center glow-cyan"
                  >
                    <CheckCircle2 size={44} className="text-accentCyan" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white">Message Sent! 🚀</h3>
                  <p className="text-secondaryText max-w-xs">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "" }); }}
                    className="px-8 py-3 rounded-full glass-card-crazy holo-border text-accentCyan text-sm font-black uppercase tracking-widest hover:bg-accentCyan hover:text-background transition-all"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-1">Send a Message</h3>
                    <p className="text-secondaryText text-sm">I typically respond within 24 hours.</p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "name", label: "Name", type: "text", placeholder: "John Doe" },
                      { id: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-secondaryText text-[10px] uppercase tracking-[0.3em] font-black">{field.label}</label>
                        <div className="relative">
                          <input
                            type={field.type}
                            required
                            value={formState[field.id as "name" | "email"]}
                            onChange={(e) => setFormState((s) => ({ ...s, [field.id]: e.target.value }))}
                            onFocus={() => setFocusedField(field.id)}
                            onBlur={() => setFocusedField(null)}
                            placeholder={field.placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-secondaryText/40 text-sm transition-all duration-300 focus:outline-none focus:border-accentCyan/60 focus:bg-accentCyan/5"
                          />
                          {focusedField === field.id && (
                            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-accentCyan to-transparent" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-secondaryText text-[10px] uppercase tracking-[0.3em] font-black">Message</label>
                    <div className="relative">
                      <textarea
                        required
                        rows={6}
                        value={formState.message}
                        onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell me about your project or idea..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-secondaryText/40 text-sm transition-all duration-300 focus:outline-none focus:border-accentCyan/60 focus:bg-accentCyan/5 resize-none"
                      />
                      {focusedField === "message" && (
                        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-accentCyan to-transparent" />
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(100,255,218,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-3 bg-accentCyan text-background py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all disabled:opacity-70 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} strokeWidth={3} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
