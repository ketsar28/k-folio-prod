import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import { projectData } from "../../data/side-right/project";

// Dynamically import all images from the assets folder
const images = import.meta.glob('../../assets/images/*', { eager: true });

const PortfolioSection = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Web App", "AI/ML", "Mobile", "API"];

  const getCategory = (project) => {
    const techString = project.technologies.join(" ").toLowerCase();
    if (techString.includes("python") || techString.includes("machine learning") || techString.includes("ai")) return "AI/ML";
    if (techString.includes("react") || techString.includes("streamlit")) return "Web App";
    if (techString.includes("figma") || techString.includes("mobile")) return "Mobile";
    if (techString.includes("api") || techString.includes("spring")) return "API";
    return "Web App"; // Default
  };

  const filteredProjects = projectData.filter((project) => {
    const matchesCategory = filter === "All" || getCategory(project) === filter;
    const matchesSearch = 
      project.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Helper to get image source
  const getImageSrc = (imageName) => {
    // Try to find the image in the imported glob
    // The keys are relative paths like "../../assets/images/filename.jpg"
    const path = `../../assets/images/${imageName}`;
    const module = images[path];
    return module ? module.default : "https://via.placeholder.com/400x400?text=No+Image";
  };

  return (
    <section id="portfolio" className="py-20 relative">
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <div className="w-20 h-1 bg-[var(--primary)] rounded-full mx-auto" />
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            A selection of my recent work, ranging from AI/ML models to complex web applications.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col items-center gap-6">
          {/* Search Bar */}
          <div className="relative w-full max-w-[90vw] md:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] z-10" />
            <input
              type="text"
              placeholder="Search projects (e.g., Python, QA, API)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-full glass-premium bg-[var(--bg-main)]/50 border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all placeholder:text-[var(--text-secondary)]/50 text-[var(--text-primary)]"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
                    : "glass-premium hover:bg-[var(--bg-card)] text-[var(--text-secondary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.position + index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-[450px] rounded-2xl overflow-hidden cursor-pointer glass-card border-0 p-0"
                  data-cursor-text="View Details"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-[var(--bg-card)]">
                     <img 
                       src={getImageSrc(project.image)}
                       alt={project.position}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       loading="lazy"
                     />
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/80 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="space-y-3">
                      <span className="text-[var(--accent)] text-xs font-bold tracking-wider uppercase bg-[var(--bg-main)]/50 px-2 py-1 rounded backdrop-blur-md inline-block">
                        {project.location}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
                        {project.position}
                      </h3>
                      
                      <p className="text-[var(--text-secondary)] text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {project.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] px-2 py-1 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/20 cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(tech);
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[10px] px-2 py-1 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/20">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="pt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                        <a
                          href={project.pathUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
                          title="View Project"
                        >
                          View Project <FaExternalLinkAlt size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20 text-[var(--text-secondary)]"
              >
                <p className="text-xl">No projects found matching "{searchQuery}"</p>
                <button 
                  onClick={() => {setSearchQuery(""); setFilter("All");}}
                  className="mt-4 text-[var(--primary)] hover:underline"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
