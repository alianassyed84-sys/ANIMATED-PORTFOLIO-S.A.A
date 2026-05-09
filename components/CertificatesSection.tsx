"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, ExternalLink, Trophy, Star } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

// ============================================================================
// 🏆 HOW TO ADD NEW CERTIFICATES / HACKATHONS
// ============================================================================
// Simply add a new object to this array.
// - title: The name of the hackathon or certification
// - issuer: Who organized it (e.g., "Devfolio", "Google", "MLH")
// - date: Month and Year
// - type: "Winner", "Finalist", "Participation", or "Certification"
// - image: Path to the certificate image (put images in the public folder)
// - link: (Optional) Link to the devfolio project or credential URL
// ============================================================================

import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ============================================================================
// 🏆 DYNAMIC CERTIFICATES / HACKATHONS
// ============================================================================
// Fetches data from Firebase 'achievements' collection.
// ============================================================================

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: string;
  image?: string;
  pdfUrl?: string;
  link: string;
  description: string;
  tags?: string[];
  order?: number;
}

// --- Helper Component: 3D Certificate Card ---
function CertificateCard({ cert, index, onClick }: { cert: Certificate, index: number, onClick: (cert: Certificate) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || isTouch) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Determine badge styling based on type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "Winner": return { color: "#D4AF37", bg: "rgba(212, 175, 55, 0.15)", icon: Trophy };
      case "Finalist": return { color: "#C0C0C0", bg: "rgba(192, 192, 192, 0.15)", icon: Star };
      case "Certification": return { color: "#64FFDA", bg: "rgba(100, 255, 218, 0.15)", icon: Award };
      default: return { color: "#8892B0", bg: "rgba(136, 146, 176, 0.15)", icon: Award };
    }
  };

  const badge = getBadgeStyle(cert.type);
  const Icon = badge.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      style={isTouch ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(cert)}
      className="group relative glass-card rounded-3xl overflow-hidden flex flex-col h-full hover:border-white/20 transition-colors cursor-pointer"
    >
      {/* Type Badge */}
      <div 
        className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border border-white/10"
        style={{ backgroundColor: badge.bg, color: badge.color }}
      >
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{cert.type}</span>
      </div>

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-background/50 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        
        {!cert.image || cert.image === "/placeholder-cert.jpg" ? (
          <div className="w-full h-full flex items-center justify-center bg-white/5 group-hover:scale-105 transition-transform duration-700">
            <Award className="text-white/10 w-20 h-20" />
          </div>
        ) : (
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-accentCyan text-xs font-mono">{cert.date}</span>
        </div>
        
        <h3 className="text-xl font-black text-white mb-1 leading-tight group-hover:text-accentCyan transition-colors">
          {cert.title}
        </h3>
        <p className="text-secondaryText text-sm font-medium mb-4">
          Issued by: <span className="text-white/80">{cert.issuer}</span>
        </p>
        
        <p className="text-secondaryText text-sm leading-relaxed mb-6 flex-grow">
          {cert.description}
        </p>

        {cert.tags && cert.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {cert.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded-lg bg-accentCyan/10 border border-accentCyan/20 text-[9px] font-bold text-accentCyan uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        )}

        {cert.link && cert.link !== "#" && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-accentCyan transition-colors mt-auto w-max z-20 relative"
          >
            View Credential <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Ambient Glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accentCyan/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const q = query(collection(db, "achievements"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedCerts: Certificate[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCerts.push({ id: doc.id, ...doc.data() } as Certificate);
      });
      
      fetchedCerts.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCertificates(fetchedCerts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || certificates.length === 0) return null;

  return (
    <>
      <section id="certificates" className="py-24 md:py-40 px-4 md:px-12 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="text-accentCyan font-mono text-sm tracking-widest uppercase">
                03. Achievements
              </span>
              <div className="h-[1px] bg-white/10 flex-grow max-w-[200px]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none tracking-tight"
            >
              HACKATHONS
              <br />
              <span className="text-secondaryText/30">& CERTIFICATES</span>
            </motion.h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, i) => (
              <CertificateCard key={cert.id} cert={cert} index={i} onClick={setSelectedCert} />
            ))}
          </div>

        </div>
      </section>

      {/* Modal Preview */}
      {/* Ensure AnimatePresence is used properly, we'll use a simpler modal if it's not imported or just import AnimatePresence */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] bg-background border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-sm font-bold text-white">{selectedCert.title}</h3>
              <div className="flex items-center gap-4">
                {(selectedCert.pdfUrl || selectedCert.image) && (
                  <a href={selectedCert.pdfUrl || selectedCert.image} target="_blank" rel="noopener noreferrer" className="text-secondaryText hover:text-white transition-colors flex items-center gap-2 text-xs">
                    <ExternalLink size={16} /> Open
                  </a>
                )}
                <button onClick={() => setSelectedCert(null)} className="text-secondaryText hover:text-white transition-colors">
                  {/* using a simple 'X' string since lucide X might not be imported if we missed it, but wait, ExternalLink is imported, I can import X above */}
                  <span className="text-lg font-bold">✕</span>
                </button>
              </div>
            </div>
            
            <div className="flex-grow w-full h-full bg-white/5 overflow-auto flex items-center justify-center p-4">
              {selectedCert.pdfUrl ? (
                <iframe src={`${selectedCert.pdfUrl}#toolbar=0`} className="w-full h-[70vh] border-none" title="PDF Viewer" />
              ) : selectedCert.image && selectedCert.image !== "/placeholder-cert.jpg" ? (
                <div className="relative w-full h-[70vh]">
                  <Image src={selectedCert.image} alt={selectedCert.title} fill className="object-contain" />
                </div>
              ) : (
                <div className="text-secondaryText text-center p-8">No preview available</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
