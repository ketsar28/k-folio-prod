import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "../../context/EnhancedThemeContext";
import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  const { isDarkMode } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [particles, setParticles] = useState([]);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX / innerWidth;
      const y = clientY / innerHeight;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Generate random particles
  useEffect(() => {
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[var(--bg-main)] transition-colors duration-500">
      {/* Dynamic Gradient Mesh */}
      <div className="absolute inset-0 animated-gradient-bg opacity-30 dark:opacity-20 transition-opacity duration-500" />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[var(--primary)] opacity-10 dark:opacity-20 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Interactive Orbs */}
      <motion.div
        style={{
          x: useSpring(useMotionValue(0), { stiffness: 50, damping: 20 }),
          y: useSpring(useMotionValue(0), { stiffness: 50, damping: 20 }),
          willChange: "transform", // Optimize performance
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full blur-[100px] opacity-20 mix-blend-screen dark:mix-blend-screen transition-all duration-500"
      />

      <motion.div
        style={{
          x: springX, // Reacts to mouse
          y: springY,
          willChange: "transform", // Optimize performance
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-l from-[var(--secondary)] to-[var(--primary)] rounded-full blur-[120px] opacity-20 mix-blend-screen dark:mix-blend-screen transition-all duration-500"
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03] dark:opacity-[0.05] transition-opacity duration-500" />
      
      {/* Noise Texture for Texture */}
      <div className="absolute inset-0 noise-bg opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};

export default AnimatedBackground;
