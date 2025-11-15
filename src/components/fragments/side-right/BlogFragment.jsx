import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Element } from "react-scroll";
import { FaSearch, FaClock, FaTag, FaArrowRight } from "react-icons/fa";
import { blogArticles, categories } from "../../../data/blogArticles";

const BlogFragment = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = blogArticles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = filteredArticles.filter((article) => article.featured);
  const regularArticles = filteredArticles.filter((article) => !article.featured);

  return (
    <Element className="min-h-screen flex items-center py-20" id="blog" name="blog">
      <div className="w-full space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Blog & Articles
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            Insights, tutorials, and thoughts on Data Science, Machine Learning, and Optimization
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search articles by title, tags, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-light)] backdrop-blur-lg border border-[var(--primary)]/20 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "bg-[var(--bg-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-dark)]"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Featured Articles</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {featuredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    className="group bg-[var(--bg-light)] backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-[var(--primary)]/20 transition-all duration-300"
                  >
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-4">
                      {/* Category & Read Time */}
                      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <FaTag className="text-[var(--primary)]" />
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[var(--primary)]" />
                          {article.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-[var(--text-secondary)] line-clamp-3">{article.excerpt}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[var(--bg-dark)] rounded-full text-xs text-[var(--text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <button className="flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-4 transition-all">
                        Read Article
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">All Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {regularArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    className="group bg-[var(--bg-light)] backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-[var(--primary)]/20 transition-all duration-300"
                  >
                    <div className="p-6 space-y-4">
                      {/* Category & Read Time */}
                      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <FaTag className="text-[var(--primary)]" />
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[var(--primary)]" />
                          {article.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[var(--bg-dark)] rounded-full text-xs text-[var(--text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <button className="flex items-center gap-2 text-[var(--primary)] font-semibold text-sm group-hover:gap-3 transition-all">
                        Read More
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-[var(--text-secondary)]">
              No articles found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </Element>
  );
};

export default BlogFragment;
