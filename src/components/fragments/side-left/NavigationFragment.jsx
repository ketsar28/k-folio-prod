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
      className="space-y-2 py-4 sticky top-8"
    >
      {navigationData.length > 0 &&
        navigationData.map((item, index) => (
          <div key={index}>
            <Link
              activeClass="active"
              to={item.href}
              smooth={true}
              duration={800}
              offset={-100}
              spy={true}
              onSetActive={handleSetActive}
              className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-[var(--bg-light)]"
            >
              {/* Indicator */}
              <motion.div
                className={`h-2 w-2 rounded-full ${
                  activeLink === item.href
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--secondary)]"
                }`}
                layoutId="indicator"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.5,
                }}
              />

              {/* Label */}
              <span
                className={`text-lg font-medium transition-colors duration-200 ${
                  activeLink === item.href
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          </div>
        ))}
    </motion.nav>
  );
};

export default NavigationFragment;
