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
      // Improved centering: inset-x-0 mx-auto w-max ensures it stays in the middle without weird transforms
      className="fixed top-6 inset-x-0 mx-auto z-[999] w-max max-w-[90%]"
    >
      <div className={`glass-premium rounded-full px-6 py-3 flex items-center justify-between gap-8 transition-all duration-300 ${
        scrolled ? "shadow-2xl bg-[var(--glass-bg)]/90" : "bg-[var(--glass-bg)]/50"
      }`}>
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="font-bold text-lg tracking-tight group-hover:text-[var(--primary)] transition-colors">
            Ketsar.AI
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

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 p-4 glass-premium rounded-2xl md:hidden flex flex-col gap-2 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                smooth={true}
                duration={800}
                offset={-100}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-center font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-card)] transition-all cursor-pointer"
                activeClass="!text-[var(--primary)] !bg-[var(--primary)]/10"
                spy={true}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
