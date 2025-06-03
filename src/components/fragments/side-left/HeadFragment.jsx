/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { headData } from "../../../data/side-left/head";
import { getImageUrl } from "../../../utils/getAsset";

const HeadFragment = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Image */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--primary)] shadow-lg">
        <img
          src={getImageUrl(headData.image)}
          alt={headData.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Role */}
      <div className="space-y-3">
        {headData.title && (
          <motion.h1
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {headData.title}
          </motion.h1>
        )}

        {headData.role && (
          <motion.h2
            className="text-xl sm:text-2xl font-semibold text-[var(--text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {headData.role}
          </motion.h2>
        )}
      </div>

      {/* Description */}
      {headData.description && (
        <motion.p
          className="text-[var(--text-secondary)] text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {headData.description}
        </motion.p>
      )}

      {/* Contact/Social Links */}
      <motion.div
        className="flex gap-4 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <a href="mailto:muhammadketsar45@gmail.com" className="btn-primary">
          Contact Me
        </a>
        <a
          href="#projects"
          className="px-6 py-2 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
        >
          View Projects
        </a>
      </motion.div>
    </motion.div>
  );
};

export default HeadFragment;
