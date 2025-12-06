import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCalendar, FaClock, FaTag, FaUser } from "react-icons/fa";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";

const ArticleModal = ({ isOpen, onClose, article }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!article) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99998] cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 top-20 bottom-24 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            {/* Modal Content */}
            <div className="bg-[var(--bg-card)] w-full max-w-4xl h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-[var(--primary)]/20 relative">
              
              {/* Header Image (Optional) / Gradient */}
              <div className="h-48 sm:h-64 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 relative shrink-0">
                 {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all z-10 group"
                >
                    <FaTimes size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
                
                <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-[var(--bg-card)] to-transparent">
                    <div className="space-y-4 max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full shadow-lg">
                            {article.category}
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight">
                            {article.title}
                        </h2>
                    </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                
                {/* Meta Data */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-secondary)] mb-8 border-b border-[var(--primary)]/10 pb-6">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-[var(--primary)]" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendar className="text-[var(--primary)]" />
                        <span>{article.publishedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-[var(--primary)]" />
                        <span>{article.readTime}</span>
                    </div>
                </div>

                {/* Markdown Body */}
                <div className="prose prose-lg prose-invert max-w-none text-[var(--text-secondary)]">
                   <ReactMarkdown
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[var(--text-primary)] mt-8 mb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4 border-l-4 border-[var(--primary)] pl-4" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[var(--text-primary)] mt-6 mb-3" {...props} />,
                        p: ({node, ...props}) => <p className="leading-relaxed mb-4" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-[var(--primary)] font-bold" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[var(--accent)] pl-4 italic bg-[var(--bg-light)]/50 p-4 rounded-r-lg my-6" {...props} />,
                    }}
                   >
                       {article.content}
                   </ReactMarkdown>
                </div>

                 {/* Tags Footer */}
                 <div className="mt-12 pt-6 border-t border-[var(--primary)]/10">
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[var(--bg-light)] text-[var(--text-secondary)] rounded-full text-xs font-medium border border-[var(--primary)]/10">
                                # {tag}
                            </span>
                        ))}
                    </div>
                 </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArticleModal;
