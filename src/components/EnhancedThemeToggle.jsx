import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaDesktop, FaCog, FaPalette, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/EnhancedThemeContext";

const EnhancedThemeToggle = () => {
  const { themeMode, toggleTheme, primaryColor, setPrimaryColor, colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const icons = {
    light: <FaSun className="text-yellow-500 text-lg" />,
    dark: <FaMoon className="text-purple-400 text-lg" />,
    system: <FaDesktop className="text-blue-500 text-lg" />,
  };

  return (
    <div 
      ref={containerRef}
      className="fixed top-1/2 right-0 -translate-y-1/2 z-[9999] flex items-center"
    >
      {/* Toggle Button (Always Visible) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-premium p-3 rounded-l-xl border-r-0 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isOpen ? "bg-[var(--bg-card)]" : "bg-[var(--glass-bg)]/80"
        }`}
        whileHover={{ x: -2 }}
        aria-label="Theme Settings"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes className="text-[var(--primary)]" /> : <FaCog className="text-[var(--text-secondary)]" />}
        </motion.div>
      </motion.button>

      {/* Expanded Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-full mr-2 glass-premium p-4 rounded-xl flex flex-col gap-4 min-w-[200px]"
          >
            {/* Theme Mode Toggle */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Theme</h4>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-main)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {icons[themeMode]}
                  <span className="text-sm font-medium capitalize">{themeMode}</span>
                </div>
                <div className="text-[var(--text-secondary)] text-xs">Tap to switch</div>
              </button>
            </div>

            <div className="h-[1px] bg-[var(--glass-border)]" />

            {/* Color Palette */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                <FaPalette /> Accent Color
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(colors).map((colorKey) => (
                  <button
                    key={colorKey}
                    onClick={() => setPrimaryColor(colorKey)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      primaryColor === colorKey ? "border-[var(--text-primary)] scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: colors[colorKey].primary }}
                    aria-label={`Select ${colorKey} theme`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedThemeToggle;
