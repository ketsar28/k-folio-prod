import { useState } from "react";
import Navbar from "../common/Navbar";
import HeroSection from "../fragments/HeroSection";
import AboutSection from "../fragments/AboutSection";
import ExperienceFragment from "../fragments/side-right/ExperienceFragment";
import PortfolioSection from "../fragments/PortfolioSection";
import BlogFragment from "../fragments/side-right/BlogFragment";
import ContactSection from "../fragments/ContactSection";
import Footer from "../common/Footer";
import CVModal from "../common/CVModal";

const HomeLayout = () => {
  const [isCVOpen, setIsCVOpen] = useState(false);

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-16 md:space-y-32 pb-32">
        <HeroSection onOpenCV={() => setIsCVOpen(true)} />
        <AboutSection />
        <ExperienceFragment onOpenCV={() => setIsCVOpen(true)} />
        <PortfolioSection />
        <BlogFragment />
        <ContactSection />
      </main>
      <Footer />
      <CVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
    </div>
  );
};

export default HomeLayout;
