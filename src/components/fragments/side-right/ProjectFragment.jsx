/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { getImageUrl } from "../../../utils/getAsset";
import { projectData } from "../../../data/side-right/project";
import PropTypes from "prop-types";

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { image, position, location, description, technologies, pathUrl } =
    project;

  return (
    <motion.div
      className="group relative h-[400px] rounded-2xl overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          src={getImageUrl(image)}
          alt={position}
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />
        {/* Enhanced gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      </div>

      {/* Content Container */}
      <motion.a
        href={pathUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0 w-full h-full p-6 flex flex-col justify-end group-hover:bg-black/20 transition-colors duration-300"
      >
        {/* Project Info */}
        <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.slice(0, 3).map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-3 py-1 text-xs font-medium rounded-full 
                         bg-white/10 text-white 
                         backdrop-blur-sm group-hover:bg-[var(--primary)] 
                         group-hover:text-white transition-all duration-300"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span
                className="px-3 py-1 text-xs font-medium rounded-full 
                           bg-white/10 text-white
                           backdrop-blur-sm group-hover:bg-[var(--primary)]
                           group-hover:text-white transition-all duration-300"
              >
                +{technologies.length - 3}
              </span>
            )}
          </div>

          {/* Title & Location */}
          <h3
            className="text-2xl font-bold text-white mb-2 
                      group-hover:text-[var(--primary)] transition-colors duration-300"
          >
            {position}
          </h3>
          <p
            className="text-white/80 mb-4 
                     group-hover:text-white transition-colors duration-300"
          >
            {location}
          </p>

          {/* Description */}
          <p
            className="text-white/70 line-clamp-2 mb-4 
                     group-hover:text-white/90 transition-colors duration-300"
          >
            {description}
          </p>

          {/* View Project Button */}
          <motion.div
            className="inline-flex items-center gap-2 text-gray-50 
                     font-medium group-hover:text-white transition-colors duration-300
                     bg-white/20 group-hover:bg-blue-500 px-4 py-2 rounded-lg backdrop-blur-sm"
            initial={{ x: 0 }}
            animate={{ x: isHovered ? 2 : 0 }}
          >
            View Project
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.div>
        </div>
      </motion.a>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    image: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    pathUrl: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const ProjectFragment = () => {
  return (
    <Element name="project" className="min-h-screen py-16" id="project">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-left mb-8">
          <motion.h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Featured Projects
          </motion.h2>
          {/* <motion.p
            className="text-[var(--text-secondary)] max-w-2xl mx-auto"
            
          >
            Explore some of my recent work and personal projects
          </motion.p> */}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectData.length > 0 &&
            projectData.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
        </div>

        {/* View More Projects Link */}
        <div className="pt-16 text-center">
          <motion.a
            href="https://github.com/ketsar28?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full
                     bg-[var(--primary)] text-white font-medium
                     hover:bg-[var(--primary-dark)] transition-all duration-300
                     hover:shadow-lg hover:shadow-[var(--primary)]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View More Projects
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </div>
      </div>
    </Element>
  );
};

export default ProjectFragment;
