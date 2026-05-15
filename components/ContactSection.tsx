"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, MapPin, Github, Linkedin, Twitter, ExternalLink, CheckCircle2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const SOCIALS = [
  { icon: Github, label: "GitHub", href: "https://github.com/alianassyed84", color: "#fff" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/syedanasali", color: "#0A66C2" },
  { icon: Mail, label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=syedanasaliofficialdeveloper@gmail.com", color: "#64FFDA" },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. Send Email via Web3Forms
      const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "64883d17-a24d-48be-8673-0c6b6f80bbd1",
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New Portfolio Message from ${formState.name}`,
        }),
      });

      const web3Result = await web3FormsResponse.json();
      
      if (!web3Result.success) {
        throw new Error("Failed to send email notification");
      }

      // 2. Save to Firestore for the Admin Panel
      await addDoc(collection(db, "messages"), {
        name: formState.name,
        email: formState.email,
        message: formState.message,
        createdAt: serverTimestamp(),
        read: false, // Useful for showing "unread" notifications in the admin panel
      });

      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error submitting message: ", err);
      setError("Failed to send message. Please try again or use direct email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-16 md:py-32 px-4 md:px-12 bg-transparent relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accentCyan/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accentBlue/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
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
            LET&apos;S{" "}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "syedanasaliofficialdeveloper@gmail.com",
                  href: "https://mail.google.com/mail/?view=cm&fs=1&to=syedanasaliofficialdeveloper@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Hyderabad, India",
                  href: null,
                },
              ].map((info) => (
                <div key={info.label} className="glass-card p-5 rounded-2xl flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan flex-shrink-0 group-hover:bg-accentCyan group-hover:text-background transition-all duration-300">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <p className="text-secondaryText text-xs uppercase tracking-widest font-bold">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-white text-sm font-medium hover:text-accentCyan transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-secondaryText text-xs uppercase tracking-[0.3em] font-bold">Find me on</p>
              <div className="flex gap-3">
                {SOCIALS.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9, y: 0 }}
                    title={social.label}
                    className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-secondaryText hover:text-white hover:border-accentCyan/40 active:border-accentCyan active:text-accentCyan transition-all duration-300"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-3 h-3">
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  <div className="relative w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-white font-bold text-sm">Available for opportunities</span>
              </div>
              <p className="text-secondaryText text-xs leading-relaxed">
                Open to internships, freelance projects, and full-time roles. Let&apos;s build something amazing together.
              </p>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-accentCyan/5 blur-3xl rounded-full" />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-6 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-accentCyan/20 border border-accentCyan/40 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-accentCyan" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                  <p className="text-secondaryText">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "" }); }}
                    className="px-6 py-3 rounded-full bg-accentCyan/10 border border-accentCyan/30 text-accentCyan text-sm font-bold hover:bg-accentCyan hover:text-background transition-all"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  <h3 className="text-xl font-black text-white mb-2">Send a Message</h3>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-secondaryText text-xs uppercase tracking-widest font-bold">Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-secondaryText/50 text-sm focus:outline-none focus:border-accentCyan/60 focus:bg-accentCyan/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-secondaryText text-xs uppercase tracking-widest font-bold">Email</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-secondaryText/50 text-sm focus:outline-none focus:border-accentCyan/60 focus:bg-accentCyan/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-secondaryText text-xs uppercase tracking-widest font-bold">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                      placeholder="Tell me about your project or idea..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-secondaryText/50 text-sm focus:outline-none focus:border-accentCyan/60 focus:bg-accentCyan/5 transition-all resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full flex items-center justify-center gap-3 bg-accentCyan text-background py-4 md:py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white hover:shadow-[0_0_30px_rgba(100,255,218,0.3)] active:scale-95 transition-all disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} strokeWidth={3} className="group-active:translate-x-1 transition-transform" />
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
