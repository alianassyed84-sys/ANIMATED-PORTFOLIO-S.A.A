import AboutSection from "@/components/AboutSection";
import CertificatesSection from "@/components/CertificatesSection";
import ContactSection from "@/components/ContactSection";
import EducationTimeline from "@/components/EducationTimeline";
import InternshipsSection from "@/components/InternshipsSection";
import GithubActivity from "@/components/GithubActivity";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ProjectsGrid from "@/components/ProjectsGrid";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import SkillsSection from "@/components/SkillsSection";
import Background3D from "@/components/Background3D";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent selection:bg-accentCyan/20 selection:text-accentCyan">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Scrollytelling (Integrated Overlay) */}
      <div className="bg-background">
        <ScrollyCanvas />
      </div>

      {/* Main Content Sections */}
      <div>
        {/* The 3D background stays fixed behind the content after the hero */}
        <div className="fixed inset-0 z-[-1]">
          <Background3D />
        </div>
        
        <ProjectsGrid />
        <GithubActivity />
        <EducationTimeline />
        <InternshipsSection />
        <CertificatesSection />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>

      {/* Custom Cursor Effects could be added here */}
    </main>
  );
}
