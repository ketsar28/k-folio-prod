import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add hover effect for interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Initial setup
    addHoverListeners();

    // Re-add listeners when DOM changes (for dynamic content)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: 1,
    },
    hovering: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1.3,
    },
    clicking: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 0.7,
    },
  };

  const currentVariant = isClicking ? "clicking" : isHovering ? "hovering" : "default";

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        variants={cursorVariants}
        animate={currentVariant}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 35,
          mass: 0.3,
        }}
      />

      {/* Cursor glow/trail effect */}
      <motion.div
        className="custom-cursor-glow"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.15,
        }}
      />
    </>
  );
};

export default CustomCursor;
