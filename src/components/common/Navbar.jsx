import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import { useTheme } from "../../context/EnhancedThemeContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { primaryColor } = useTheme();

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
