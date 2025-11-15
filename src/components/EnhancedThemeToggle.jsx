import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { useTheme } from "../context/EnhancedThemeContext";

const EnhancedThemeToggle = () => {
  const { themeMode, toggleTheme } = useTheme();

  const icons = {
    light: <FaSun className="text-yellow-500" />,
    dark: <FaMoon className="text-purple-400" />,
    system: <FaDesktop className="text-blue-500" />,
  };

  const labels = {
    light: "Light Mode",
    dark: "Dark Mode",
    system: "System",
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="theme-toggle group relative"
      aria-label={`Switch to ${themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light'} mode`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={themeMode}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          {icons[themeMode]}
        </motion.div>
      </AnimatePresence>

      {/* Tooltip */}
      <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-[var(--bg-light)] text-[var(--text-primary)] px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none z-10">
        {labels[themeMode]}
      </span>

      {/* Glow effect */}
      <span className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg" />
    </motion.button>
  );
};

export default EnhancedThemeToggle;
