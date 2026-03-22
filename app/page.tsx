import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import EducationTimeline from "@/components/EducationTimeline";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Overlay from "@/components/Overlay";
import ProjectsGrid from "@/components/ProjectsGrid";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import SkillsSection from "@/components/SkillsSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background selection:bg-accentCyan/20 selection:text-accentCyan">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Scrollytelling */}
      <div className="relative">
        <ScrollyCanvas />
        <Overlay />
      </div>

      {/* Main Content Sections */}
      <div className="relative z-20">
        <ProjectsGrid />
        <EducationTimeline />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>

      {/* Custom Cursor Effects could be added here */}
    </main>
  );
}
