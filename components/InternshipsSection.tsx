"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GlitchText from "./GlitchText";


interface Internship {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
  offerLetterUrl?: string;
  recommendationLetterUrl?: string;
  completionCertificateUrl?: string;
  logoUrl?: string;
  status: "ongoing" | "completed";
  order?: number;
}

export default function InternshipsSection() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "internships"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedInternships: Internship[] = [];
      querySnapshot.forEach((doc) => {
        fetchedInternships.push({ id: doc.id, ...doc.data() } as Internship);
      });
      
      // Sort by order or just display as fetched
      fetchedInternships.sort((a, b) => (a.order || 0) - (b.order || 0));
      setInternships(fetchedInternships);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching internships:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || internships.length === 0) return null;

  return (
    <>
      <section id="internships" className="py-16 md:py-24 px-4 md:px-12 bg-transparent relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accentCyan/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-accentCyan text-xs font-black tracking-[0.4em] uppercase"
            >
              Professional Experience
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ willChange: "transform, opacity" }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white"
            >
              <GlitchText text="INTERNSHIPS" glitchInterval={3600} />
              <br />
              <span className="text-secondaryText/30 uppercase">&amp; Work</span>
            </motion.h2>
          </div>

          <div className="relative pt-8 md:pt-20">
             {/* Vertical Line (desktop only) — gradient */}
             <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px]" style={{ background: "linear-gradient(180deg, #64FFDA, #3b82f6, #b794f6, transparent)", opacity: 0.5 }} />

             {/* Mobile vertical line */}
             <div className="md:hidden absolute top-0 left-5 h-full w-[2px]" style={{ background: "linear-gradient(180deg, #64FFDA, #3b82f6, transparent)", opacity: 0.5 }} />

             {internships.map((internship, index) => {
               const side = index % 2 === 0 ? "left" : "right";
               return (
                <div key={internship.id} className="relative mb-10 md:mb-24">
                  {/* === DESKTOP LAYOUT === */}
                  <div className={`hidden md:flex items-center justify-between w-full ${side === "left" ? "flex-row" : "flex-row-reverse"}`}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-accentCyan z-10 shadow-[0_0_15px_rgba(100,255,218,0.5)]">
                      {internship.status === "ongoing" && (
                        <div className="absolute inset-0 rounded-full bg-accentCyan animate-ping opacity-75" />
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      style={{ willChange: "transform, opacity" }}
                      className={`w-[45%] ${side === "left" ? "text-right" : "text-left"}`}
                    >
                      <div className="glass-card-crazy holo-border p-8 rounded-2xl space-y-4 relative group">
                        {internship.status === "ongoing" && (
                          <div className="absolute -top-3 left-8 px-3 py-1 bg-accentCyan text-background rounded-full text-[10px] font-black tracking-widest neon-flicker">
                            ONGOING
                          </div>
                        )}
                        <div className={`flex items-center gap-4 ${side === "left" ? "flex-row-reverse" : "flex-row"}`}>
                          {internship.logoUrl ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-accentCyan/30 flex-shrink-0 shadow-[0_0_12px_rgba(100,255,218,0.2)]">
                              <Image src={internship.logoUrl} alt={internship.companyName} width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan transition-all duration-500 group-hover:text-background flex-shrink-0">
                              <Briefcase size={24} />
                            </div>
                          )}
                          <div>
                            <h4 className="text-accentSilver text-xs font-mono">{internship.duration}</h4>
                            <h3 className="text-xl font-bold text-white group-hover:text-accentCyan transition-colors">{internship.companyName}</h3>
                          </div>
                        </div>
                        <p className="text-secondaryText text-sm leading-relaxed">{internship.description}</p>
                        
                        {internship.technologies && internship.technologies.length > 0 && (
                          <div className={`flex flex-wrap gap-2 pt-1 ${side === "left" ? "justify-end" : "justify-start"}`}>
                            {internship.technologies.map((tech: string) => (
                              <span key={tech} className="px-2 py-1 rounded-lg bg-accentCyan/10 border border-accentCyan/20 text-[10px] font-bold text-accentCyan uppercase tracking-wider">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className={`flex items-center justify-between pt-2 ${side === "left" ? "flex-row-reverse" : "flex-row"}`}>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">{internship.role}</span>
                        </div>

                        <div className={`flex flex-wrap gap-3 mt-4 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          {internship.offerLetterUrl && (
                             <button onClick={() => setSelectedPdf(internship.offerLetterUrl!)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors">
                               <FileText size={14} /> Offer Letter
                             </button>
                          )}
                          {internship.recommendationLetterUrl && (
                             <button onClick={() => setSelectedPdf(internship.recommendationLetterUrl!)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors">
                               <FileText size={14} /> Recommendation
                             </button>
                          )}
                          {internship.completionCertificateUrl && (
                             <button onClick={() => setSelectedPdf(internship.completionCertificateUrl!)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors">
                               <FileText size={14} /> Certificate
                             </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* === MOBILE LAYOUT === */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="md:hidden flex items-start gap-4 pl-10"
                  >
                    <div className="absolute left-[13px] top-3 w-4 h-4 rounded-full bg-background border-2 border-accentCyan z-10 shadow-[0_0_15px_rgba(100,255,218,0.5)]">
                      {internship.status === "ongoing" && (
                        <div className="absolute inset-0 rounded-full bg-accentCyan animate-ping opacity-75" />
                      )}
                    </div>

                    <div className="glass-card-crazy holo-border p-4 rounded-2xl space-y-3 relative group w-full active:border-accentCyan/30 transition-colors">
                      {internship.status === "ongoing" && (
                        <div className="inline-block px-3 py-0.5 bg-accentCyan/20 border border-accentCyan/40 rounded-full text-[9px] font-black text-accentCyan tracking-widest animate-pulse mb-1">
                          ONGOING
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        {internship.logoUrl ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-accentCyan/20 flex-shrink-0">
                            <Image src={internship.logoUrl} alt={internship.companyName} width={40} height={40} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan flex-shrink-0">
                            <Briefcase size={18} />
                          </div>
                        )}
                        <div>
                          <p className="text-accentCyan text-[9px] font-mono">{internship.duration}</p>
                          <h3 className="text-sm font-black text-white leading-tight">{internship.companyName}</h3>
                        </div>
                      </div>
                      <p className="text-secondaryText text-[11px] leading-relaxed line-clamp-4">{internship.description}</p>
                      {internship.technologies && internship.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {internship.technologies.map((tech: string) => (
                            <span key={tech} className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-accentSilver uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{internship.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/5">
                          {internship.offerLetterUrl && (
                             <button onClick={() => setSelectedPdf(internship.offerLetterUrl!)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 active:scale-95 transition-all">
                               <FileText size={12} /> OFFER LETTER
                             </button>
                          )}
                          {internship.recommendationLetterUrl && (
                             <button onClick={() => setSelectedPdf(internship.recommendationLetterUrl!)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 active:scale-95 transition-all">
                               <FileText size={12} /> RECOMMENDATION
                             </button>
                          )}
                          {internship.completionCertificateUrl && (
                             <button onClick={() => setSelectedPdf(internship.completionCertificateUrl!)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 active:scale-95 transition-all">
                               <FileText size={12} /> CERTIFICATE
                             </button>
                          )}
                        </div>
                    </div>
                  </motion.div>
                </div>
               );
             })}
          </div>
        </div>
      </section>

      {/* PDF Modal */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedPdf(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl h-[85vh] bg-background border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-sm font-bold text-white">Document Viewer</h3>
                <div className="flex items-center gap-4">
                  <a href={selectedPdf} target="_blank" rel="noopener noreferrer" className="text-secondaryText hover:text-white transition-colors flex items-center gap-2 text-xs">
                    <ExternalLink size={16} /> Open in new tab
                  </a>
                  <button onClick={() => setSelectedPdf(null)} className="text-secondaryText hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-grow w-full h-full bg-white/5">
                <iframe src={`${selectedPdf}#toolbar=0`} className="w-full h-full border-none" title="PDF Viewer" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
