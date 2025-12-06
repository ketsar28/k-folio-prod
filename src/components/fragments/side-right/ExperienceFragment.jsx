/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { experienceData } from "../../../data/side-right/experience";

// eslint-disable-next-line react/prop-types
const ExperienceFragment = ({ onOpenCV }) => {
  // Helper to parse "Role, Company" string
  const getRoleAndCompany = (positionString) => {
    const parts = positionString.split(",");
    if (parts.length > 1) {
      return {
        role: parts[0].trim(),
        company: parts.slice(1).join(",").trim(),
      };
    }
    return { role: positionString, company: "" };
  };

  return (
    <Element name="experience" className="min-h-screen py-16" id="experience">
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Professional Journey
          </h2>
          <div className="w-20 h-1 bg-[var(--primary)] rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experienceData.length > 0 &&
            experienceData.map(
              ({ date, position, description, technologies }, index) => {
                const { role, company } = getRoleAndCompany(position);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-premium p-6 rounded-xl hover:bg-[var(--bg-card)] transition-all group border-l-4 border-l-[var(--primary)] shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold group-hover:text-[var(--primary)] transition-colors">
                        {role}
                      </h4>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] whitespace-nowrap border border-[var(--primary)]/20">
                        {date}
                      </span>
                    </div>
                    {company && (
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                        {company}
                      </p>
                    )}
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 text-justify">
                      {description}
                    </p>

                    {/* Tech Stack Pills - Optional but nice for detail */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--glass-border)]">
                      {technologies.length > 0 &&
                        technologies.slice(0, 4).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-light)] text-[var(--text-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      {technologies.length > 4 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-light)] text-[var(--text-secondary)]">
                          +{technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              }
            )}
        </div>

        {/* Premium Resume Button */}
        <div className="pt-12 flex justify-center">
          <button
            onClick={onOpenCV}
            className="group relative px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-[var(--primary)]/50 hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            type="button"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">View Full Resume</span>
            <svg
              className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>
    </Element>
  );
};

export default ExperienceFragment;
