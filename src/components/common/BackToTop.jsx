import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[9970] p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group md:bottom-8 md:right-8"
          aria-label="Back to top"
        >
          <FaArrowUp className="text-xl group-hover:translate-y-[-2px] transition-transform" />

          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-75 animate-ping" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
