/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-scroll";
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent"
          >
            {headData.title}
          </motion.h1>
        )}

        {headData.role && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl sm:text-2xl font-semibold text-[var(--text-secondary)]"
          >
            {headData.role}
          </motion.h2>
        )}
      </div>

      {/* Description */}
      {headData.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[var(--text-secondary)] text-lg leading-relaxed"
        >
          {headData.description}
        </motion.p>
      )}

      {/* Contact/Social Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 pt-4"
      >
        <a href="mailto:muhammadketsar2@gmail.com" className="btn-primary">
          Contact Me
        </a>
        <Link
          to="project"
          smooth={true}
          duration={800}
          className="px-6 py-2 cursor-pointer rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
        >
          View Projects
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HeadFragment;
