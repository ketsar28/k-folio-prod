import { motion } from "framer-motion";
import { useTheme } from "../../context/EnhancedThemeContext";
import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Gradient Mesh - Simplified for performance */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Floating Orbs - Reduced for better performance */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-2xl"
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/15 to-orange-400/15 rounded-full blur-2xl"
      />

      {/* Grid Pattern Overlay - Reduced opacity */}
      <div className="absolute inset-0 grid-pattern opacity-5" />
    </div>
  );
};

export default AnimatedBackground;
