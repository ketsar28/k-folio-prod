/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/EnhancedThemeContext";
import EnhancedThemeToggle from "./components/EnhancedThemeToggle";
import CustomCursor from "./components/common/CustomCursor";
import MusicPlayer from "./components/common/MusicPlayer";
import ScrollProgress from "./components/common/ScrollProgress";
import BackToTop from "./components/common/BackToTop";
import AnimatedBackground from "./components/common/AnimatedBackground";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Theme Toggle */}
        <EnhancedThemeToggle />

        {/* Music Player */}
        <MusicPlayer />

        {/* Back to Top Button */}
        <BackToTop />

        {/* Toast Notifications */}
        <Toaster position="bottom-right" />

        {/* Routes */}
        <Routes>
          <Route exact path={"home"} element={<Navigate to="/" />} />
          <Route exact path={"/"} element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
