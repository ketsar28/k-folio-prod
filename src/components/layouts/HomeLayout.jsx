import React from "react";
import { motion } from "framer-motion";
import Navbar from "../common/Navbar";
import HeroSection from "../fragments/HeroSection";
import AboutSection from "../fragments/AboutSection";
import PortfolioSection from "../fragments/PortfolioSection";
import ContactSection from "../fragments/ContactSection";
import Footer from "../common/Footer";

const HomeLayout = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-32">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
