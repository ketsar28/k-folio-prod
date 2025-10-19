/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { experienceData } from "../../../data/side-right/experience";

const ExperienceFragment = () => {
  return (
    <Element name="experience" className="min-h-screen py-16" id="experience">
      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12">
          Experience
        </h2>

        <div className="space-y-12">
          {experienceData.length > 0 &&
            experienceData.map(
              (
                { date, position, location, description, technologies },
                index
              ) => (
                <div
                  key={index}
                  className="relative pl-8 border-l-2 border-[var(--bg-light)] group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--bg-light)] border-2 border-[var(--primary)] group-hover:bg-[var(--primary)] transition-colors duration-300" />

                  <div className="card group-hover:border-[var(--primary)] border border-transparent transition-all duration-300 shadow-lg">
                    {/* Date */}
                    <p className="text-sm font-medium text-[var(--primary)] mb-2">
                      {date}
                    </p>

                    {/* Position & Location */}
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors duration-300">
                      {position}
                      <span className="text-[var(--text-secondary)] text-lg ml-2">
                        • {location}
                      </span>
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                      {description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {technologies.length > 0 &&
                        technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 text-sm rounded-full text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )
            )}
        </div>

        {/* Resume Link */}
        <div className="pt-8">
          <a
            target="_blank"
            href="https://drive.google.com/file/d/1SotOUrNdH8M1EAnylLl84432654vvZRe/view?usp=sharing"
            className="btn-primary inline-flex items-center group"
            rel="noreferrer"
          >
            View Full Resume
            <svg
              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </Element>
  );
};

export default ExperienceFragment;
