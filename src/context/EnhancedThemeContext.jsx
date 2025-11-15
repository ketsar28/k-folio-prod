import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || "system"; // "light", "dark", or "system"
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

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

      if (shouldBeDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
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
    <ThemeContext.Provider value={{ themeMode, isDarkMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
