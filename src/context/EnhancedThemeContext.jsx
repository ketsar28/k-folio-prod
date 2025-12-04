import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || "system"; // "light", "dark", or "system"
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || "indigo";
  });

  const colors = {
    indigo: { primary: "#4f46e5", hover: "#4338ca", accent: "#8b5cf6" },
    emerald: { primary: "#10b981", hover: "#059669", accent: "#34d399" },
    rose: { primary: "#f43f5e", hover: "#e11d48", accent: "#fb7185" },
    amber: { primary: "#f59e0b", hover: "#d97706", accent: "#fbbf24" },
    cyan: { primary: "#06b6d4", hover: "#0891b2", accent: "#22d3ee" },
  };

  useEffect(() => {
    const root = document.documentElement;
    // Safety check: if primaryColor is invalid, fallback to 'indigo'
    const colorKey = colors[primaryColor] ? primaryColor : "indigo";
    const color = colors[colorKey];

    root.style.setProperty("--primary", color.primary);
    root.style.setProperty("--primary-hover", color.hover);
    root.style.setProperty("--accent", color.accent);
    
    localStorage.setItem("primaryColor", colorKey);
  }, [primaryColor]);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      let shouldBeDark = false;

      if (themeMode === "system") {
        shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        shouldBeDark = themeMode === "dark";
      }

      setIsDarkMode(shouldBeDark);
      console.log(`Theme Update: Mode=${themeMode}, ShouldBeDark=${shouldBeDark}`);

      if (shouldBeDark) {
        root.classList.add("dark");
        console.log("Added 'dark' class to html");
      } else {
        root.classList.remove("dark");
        console.log("Removed 'dark' class from html");
      }
    };

    applyTheme();
    localStorage.setItem("themeMode", themeMode);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [themeMode]);

  const setTheme = (mode) => {
    setThemeMode(mode);
  };

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system
    if (themeMode === "light") {
      setThemeMode("dark");
    } else if (themeMode === "dark") {
      setThemeMode("system");
    } else {
      setThemeMode("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, setTheme, toggleTheme, primaryColor, setPrimaryColor, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
