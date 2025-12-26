import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Portfolio", to: "portfolio" },
    { name: "Article", to: "blog" },
    { name: "Contact", to: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      // Improved centering: fixed inset-x-0 flex justify-center ensures absolute centering
      className="fixed top-6 inset-x-0 z-[999] flex justify-center pointer-events-none"
    >
      <div className={`pointer-events-auto glass-premium rounded-full px-4 py-2 md:px-6 md:py-3 flex items-center justify-between gap-8 transition-all duration-300 ${
        scrolled ? "shadow-2xl bg-[var(--glass-bg)]/90" : "bg-[var(--glass-bg)]/50"
      }`}>
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="font-bold text-lg tracking-tight group-hover:text-[var(--primary)] transition-colors">
            Ketsar Ali
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.to}
                smooth={true}
                duration={800}
                offset={-100}
                className="px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all cursor-pointer relative group"
                activeClass="!text-[var(--primary)] !bg-[var(--primary)]/10"
                spy={true}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* Premium Owner Access - Desktop */}
          <li>
            <button
              onClick={() => navigate("/login")}
              className="group ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 transition-all duration-300"
              title="Owner Access"
            >
              <HugeiconsIcon icon={SparklesIcon} size={16} className="group-hover:animate-pulse" />
              <span className="hidden lg:inline">Owner</span>
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[var(--text-primary)] text-xl p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[998] bg-[var(--bg-main)]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center space-y-8 pointer-events-auto"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link
                  to={link.to}
                  smooth={true}
                  duration={800}
                  offset={-100}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                  activeClass="text-[var(--primary)]"
                  spy={true}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {/* Premium Owner Access Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="group relative px-8 py-4 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] rounded-2xl overflow-hidden shadow-2xl shadow-[var(--primary)]/30 cursor-pointer"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Content */}
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <HugeiconsIcon icon={SparklesIcon} size={22} className="text-white animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="block text-white font-bold text-lg">Owner Access</span>
                    <span className="block text-white/70 text-xs font-medium">Private Workspace</span>
                  </div>
                </div>
              </button>
            </motion.div>
            
            {/* Close Button (Optional, but good UX) */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute bottom-10 p-4 rounded-full bg-[var(--bg-card)] shadow-lg text-[var(--text-secondary)]"
            >
              <FaTimes size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
