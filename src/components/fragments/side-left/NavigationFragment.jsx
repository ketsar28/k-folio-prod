/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { navigationData } from "../../../data/side-left/navigation";
import { Link } from "react-scroll";

const NavigationFragment = () => {
  const [activeLink, setActiveLink] = useState(null);

  const handleSetActive = (to) => {
    setActiveLink(to);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-1 py-4 sticky top-8 bg-[var(--bg-light)]/50 backdrop-blur-lg rounded-2xl p-4 border border-[var(--primary)]/10 shadow-lg"
    >
      {navigationData.length > 0 &&
        navigationData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              activeClass="active"
              to={item.href}
              smooth={true}
              duration={800}
              offset={-100}
              spy={true}
              onSetActive={handleSetActive}
              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                activeLink === item.href
                  ? "bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/10 shadow-md"
                  : "hover:bg-[var(--bg-dark)]/50"
              }`}
            >
              {/* Left Border Indicator */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full transition-all duration-300 ${
                  activeLink === item.href
                    ? "bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/50"
                    : "bg-transparent group-hover:bg-[var(--secondary)]"
                }`}
              />

              {/* Dot Indicator */}
              <motion.div
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  activeLink === item.href
                    ? "bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/50 scale-125"
                    : "bg-[var(--secondary)]/50 group-hover:bg-[var(--secondary)] group-hover:scale-110"
                }`}
                animate={{
                  scale: activeLink === item.href ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: activeLink === item.href ? Infinity : 0,
                  repeatType: "reverse",
                }}
              />

              {/* Label */}
              <span
                className={`text-base font-semibold transition-all duration-300 ${
                  activeLink === item.href
                    ? "text-[var(--primary)] tracking-wide"
                    : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
              </span>

              {/* Hover Effect Line */}
              <div
                className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300 ${
                  activeLink === item.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </motion.div>
        ))}
    </motion.nav>
  );
};

export default NavigationFragment;
