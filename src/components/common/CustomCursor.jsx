import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomCursor.css";

const CustomCursor = () => {
  // Use refs for high-frequency position updates (no re-renders)
  const cursorOuterRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // State only for low-frequency updates (hover state, text)
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if device is mobile/touch
  useEffect(() => {
    const checkMobile = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation loop using requestAnimationFrame for smooth 60fps updates
  const updateCursorPosition = useCallback(() => {
    const { x, y } = positionRef.current;

    if (cursorOuterRef.current) {
      cursorOuterRef.current.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
    }
    if (cursorInnerRef.current) {
      cursorInnerRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
    }

    rafRef.current = requestAnimationFrame(updateCursorPosition);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Start the animation loop
    rafRef.current = requestAnimationFrame(updateCursorPosition);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMobile, updateCursorPosition]);

  // Event handlers
  useEffect(() => {
    if (isMobile) return;

    const updateMousePosition = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;

      // Check for hoverable elements
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // Check for data-cursor-text attribute
      const textElement = target.closest("[data-cursor-text]");
      if (textElement) {
        setCursorText(textElement.getAttribute("data-cursor-text"));
      } else {
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile, isVisible]);

  // Don't render on mobile at all
  if (isMobile) return null;

  // Determine size and opacity based on state
  const getOuterStyles = () => {
    let size = 32;
    let opacity = isVisible ? 1 : 0;

    if (isClicking) {
      size = 24;
    } else if (isHovering) {
      size = 16;
    }

    return {
      width: size,
      height: size,
      opacity,
    };
  };

  const outerStyles = getOuterStyles();

  return (
    <>
      {/* Outer cursor (ring) */}
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{
          width: outerStyles.width,
          height: outerStyles.height,
          opacity: outerStyles.opacity,
          backgroundColor: "var(--primary)",
          mixBlendMode: isHovering ? "normal" : "difference",
          transition: "width 0.15s ease, height 0.15s ease, opacity 0.15s ease",
          willChange: "transform",
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
      </div>

      {/* Inner cursor (dot) */}
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full"
        style={{
          backgroundColor: "var(--accent)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.15s ease",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
