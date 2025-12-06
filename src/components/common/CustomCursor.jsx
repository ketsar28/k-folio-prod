import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const [isTouching, setIsTouching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || 
                     navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Particle System Logic
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => Date.now() - p.id < 1000));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const spawnParticles = (x, y, count = 1) => {
    const newParticles = Array.from({ length: count }).map(() => ({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? "var(--primary)" : "var(--accent)",
    }));
    setParticles((prev) => [...prev, ...newParticles].slice(-20)); // Limit max particles
  };

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Check for hoverable elements
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // Check for data-cursor-text attribute
      const textElement = target.closest('[data-cursor-text]');
      if (textElement) {
        setCursorText(textElement.getAttribute('data-cursor-text'));
      } else {
        setCursorText("");
      }
    };

    // Touch Event Handlers
    const handleTouchStart = (e) => {
      setIsTouching(true);
      setIsClicking(true);
      const touch = e.touches[0];
      setMousePosition({ x: touch.clientX, y: touch.clientY });
      spawnParticles(touch.clientX, touch.clientY, 5); // Burst on tap
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      setMousePosition({ x: touch.clientX, y: touch.clientY });
      
      // Spawn trail particles (throttled by random chance for performance)
      if (Math.random() > 0.7) {
        spawnParticles(touch.clientX, touch.clientY, 1);
      }
      
      // Check for hoverable elements under touch
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target) {
        handleMouseOver({ target });
      }
    };

    const handleTouchEnd = () => {
      setIsTouching(false);
      setIsClicking(false);
      setIsHovering(false);
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.addEventListener("mousemove", updateMousePosition);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mouseover", handleMouseOver);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      } else {
        window.removeEventListener("mousemove", updateMousePosition);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mouseover", handleMouseOver);
      }
    };
  }, [isMobile]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "var(--primary)",
      mixBlendMode: "difference",
      opacity: isMobile ? (isTouching ? 1 : 0) : 1,
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "var(--accent)",
      mixBlendMode: "difference",
      opacity: isMobile ? (isTouching ? 1 : 0) : 1,
    },
    clicking: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      height: 24,
      width: 24,
      scale: 0.8,
      backgroundColor: "var(--primary-dark)",
      opacity: isMobile ? (isTouching ? 1 : 0) : 1,
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center backdrop-blur-sm"
        variants={variants}
        animate={isClicking ? "clicking" : isHovering ? "hover" : "default"}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      >
        <AnimatePresence>
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="text-[10px] font-bold text-white whitespace-nowrap"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Trailing dot (Main Cursor) */}
      <motion.div 
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-2 h-2 bg-[var(--accent)] rounded-full"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: isMobile ? (isTouching ? 1 : 0) : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
          mass: 0.8
        }}
      />

      {/* Magic Dust Particles (Mobile Only) */}
      {isMobile && (
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
              animate={{ opacity: 0, scale: 0, y: particle.y - 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      )}
    </>
  );
};

export default CustomCursor;
