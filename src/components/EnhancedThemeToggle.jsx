import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaDesktop, FaPalette } from "react-icons/fa";
import { useTheme } from "../context/EnhancedThemeContext";

const EnhancedThemeToggle = () => {
  const { themeMode, toggleTheme, primaryColor, setPrimaryColor, colors } = useTheme();
  const [showPalette, setShowPalette] = useState(false);

  const icons = {
    light: <FaSun className="text-yellow-500 text-lg" />,
    dark: <FaMoon className="text-purple-400 text-lg" />,
    system: <FaDesktop className="text-blue-500 text-lg" />,
  };

  const labels = {
    light: "Light",
    dark: "Dark",
    system: "Auto",
  };

  return (
    <div className="fixed top-6 right-6 z-[9990] flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        {/* Color Palette Button */}
        <motion.button
          onClick={() => setShowPalette(!showPalette)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-premium p-3 rounded-full flex items-center justify-center cursor-pointer group hover:bg-[var(--bg-card)] transition-colors duration-300 relative"
          aria-label="Change Color Theme"
        >
          <FaPalette className="text-[var(--primary)] text-lg" />
          {/* Active Color Indicator */}
          <div className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-card)]" style={{ backgroundColor: colors[primaryColor].primary }} />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-premium px-4 py-2 rounded-full flex items-center gap-3 cursor-pointer group hover:bg-[var(--bg-card)] transition-colors duration-300"
          aria-label={`Switch to ${themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light'} mode`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={themeMode}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {icons[themeMode]}
            </motion.div>
          </AnimatePresence>

          <span className="text-sm font-medium text-[var(--text-primary)] min-w-[3rem] text-left">
            {labels[themeMode]}
          </span>
        </motion.button>
      </div>

      {/* Color Palette Dropdown */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="glass-premium p-3 rounded-2xl grid grid-cols-5 gap-2"
          >
            {Object.keys(colors).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => {
                  setPrimaryColor(colorKey);
                  setShowPalette(false);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  primaryColor === colorKey ? "border-[var(--text-primary)] scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: colors[colorKey].primary }}
                aria-label={`Select ${colorKey} theme`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedThemeToggle;
