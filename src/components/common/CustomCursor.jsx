import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");

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

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "var(--primary)",
      mixBlendMode: "difference",
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "var(--accent)",
      mixBlendMode: "difference",
    },
    clicking: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      height: 24,
      width: 24,
      scale: 0.8,
      backgroundColor: "var(--primary-dark)",
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
      
      {/* Trailing dot */}
      <motion.div 
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-2 h-2 bg-[var(--accent)] rounded-full"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
          mass: 0.8
        }}
      />
    </>
  );
};

export default CustomCursor;
