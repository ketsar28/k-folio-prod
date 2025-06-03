/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import HeadFragment from "../fragments/side-left/HeadFragment";
import AboutFragment from "../fragments/side-right/AboutFragment";
import NavigationFragment from "../fragments/side-left/NavigationFragment";
import ExperienceFragment from "../fragments/side-right/ExperienceFragment";
import ProjectFragment from "../fragments/side-right/ProjectFragment";
import FooterFragment from "../fragments/side-right/FooterFragment";

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-dark)] to-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <motion.div
            className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start space-y-8"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeadFragment />
            <NavigationFragment />
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-8 space-y-16"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <AboutFragment />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ExperienceFragment />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ProjectFragment />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FooterFragment />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
