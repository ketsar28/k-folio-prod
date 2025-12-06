import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Element } from "react-scroll";
import { FaSearch, FaClock, FaTag, FaArrowRight, FaUser } from "react-icons/fa";
import { blogArticles } from "../../../data/blogArticles";
import ArticleModal from "../../common/ArticleModal";

const BlogFragment = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showAll, setShowAll] = useState(false);

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
    <Element className="min-h-screen flex items-center py-20 relative z-10" id="blog" name="blog">
      <div className="w-full space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 overflow-hidden"
        >
          <div className="space-y-4 text-center xl:text-left">
            <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-300% animate-gradient">
              Articles
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mx-auto xl:mx-0">
              Insights, tutorials, and thoughts on technology, data, and the future.
              <span className="block mt-2 text-[var(--primary)] font-medium">Read. Understand. Be Inspired.</span>
            </p>
          </div>

            {/* Search Bar - Compact */}
            <div className="relative w-full md:w-80 mx-auto xl:mx-0">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--primary)]/20 rounded-full text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-sm"
              />
            </div>
        </motion.div>

        {/* BENTO GRID (Top 3 Featured/Latest) */}
        {!searchTerm && selectedCategory === 'All' && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                {/* Large Main Feature (Left) */}
                {featuredArticles[0] && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => setSelectedArticle(featuredArticles[0])}
                        className="lg:col-span-2 min-h-[400px] lg:min-h-[500px] relative rounded-3xl overflow-hidden cursor-pointer group border border-[var(--primary)]/10"
                    >
                        {/* Image Placeholder/Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-[var(--bg-card)] to-[var(--bg-card)] transition-transform duration-700 group-hover:scale-105" />
                        
                        <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent">
                            <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full mb-4 w-fit shadow-lg shadow-[var(--primary)]/20">
                                HOT TOPIC
                            </span>
                            <h3 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
                                {featuredArticles[0].title}
                            </h3>
                            <p className="text-[var(--text-secondary)] line-clamp-2 mb-4">
                                {featuredArticles[0].excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
                                <span className="flex items-center gap-1"><FaUser className="text-[var(--primary)]"/> {featuredArticles[0].author}</span>
                                <span className="flex items-center gap-1"><FaClock className="text-[var(--primary)]"/> {featuredArticles[0].readTime}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stacked Side Features (Right) */}
                <div className="lg:col-span-2 grid grid-rows-2 gap-6">
                    {featuredArticles.slice(1, 3).map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedArticle(article)}
                            className="relative rounded-3xl overflow-hidden cursor-pointer group border border-[var(--primary)]/10 bg-[var(--bg-card)]/30 backdrop-blur-sm flex flex-col justify-end p-6 min-h-[200px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                            
                             <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                     <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{article.category}</span>
                                     <FaArrowRight className="text-[var(--text-primary)] -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                                <h4 className="text-xl font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors mb-2">
                                    {article.title}
                                </h4>
                                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                                    <FaClock size={10} /> {article.readTime}
                                </span>
                             </div>
                        </motion.div>
                    ))}
                </div>
             </div>
        )}

        {/* SECTION DIVIDER */}
        <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {searchTerm || selectedCategory !== 'All' ? 'Search Results' : 'Latest Articles'}
            </h3>
            <div className="h-[1px] flex-1 bg-[var(--primary)]/20"></div>
        </div>

        {/* STANDARD GRID (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {(showAll ? regularArticles : regularArticles.slice(0, 6)).map((article, index) => (
                    <motion.div
                        key={article.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => setSelectedArticle(article)}
                        className="group bg-[var(--bg-card)]/50 border border-[var(--primary)]/10 hover:border-[var(--primary)]/30 rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--primary)]/5"
                    >
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md">
                                    {article.category}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)]">
                                    {article.publishedDate}
                                </span>
                            </div>
                            
                            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-3 line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
                                {article.title}
                            </h4>
                            
                            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-6 flex-1">
                                {article.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-[var(--primary)]/10 mt-auto">
                                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <FaUser className="text-[var(--primary)]" />
                                    <span>{article.author.split(' ')[0]}</span>
                                </div>
                                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Read <FaArrowRight size={10}/>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* VIEW ALL BUTTON */}
        {!showAll && regularArticles.length > 6 && (
            <div className="flex justify-center mt-12">
                 <motion.button 
                    onClick={() => setShowAll(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full border border-[var(--primary)]/30 text-[var(--text-primary)] font-bold hover:bg-[var(--primary)] hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-[var(--primary)]/10"
                >
                    View All Articles <FaArrowRight />
                </motion.button>
            </div>
        )}

        {/* No Results State */}
        {filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="text-6xl mb-4">🌪️</div>
             <h3 className="text-2xl font-bold text-[var(--text-primary)]">No articles found</h3>
             <p className="text-[var(--text-secondary)] mt-2">Try a different keyword!</p>
             <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 text-[var(--primary)] font-bold hover:underline"
             >
                Reset Search
             </button>
          </div>
        )}
      </div>
      
      {/* Article Modal */}
      <ArticleModal 
        isOpen={!!selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
        article={selectedArticle} 
      />
    </Element>
  );
};

export default BlogFragment;
