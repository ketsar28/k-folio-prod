import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/EnhancedThemeContext";
import { AuthProvider } from "./context/AuthContext";
import EnhancedThemeToggle from "./components/EnhancedThemeToggle";
import CustomCursor from "./components/common/CustomCursor";
import MusicPlayer from "./components/common/MusicPlayer";
import ScrollProgress from "./components/common/ScrollProgress";
import BackToTop from "./components/common/BackToTop";
import AnimatedBackground from "./components/common/AnimatedBackground";
import Preloader from "./components/common/Preloader";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., 2.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen w-full overflow-x-hidden relative">
            {/* Preloader */}
            <Preloader isLoading={isLoading} />

            {/* Animated Background */}
            <AnimatedBackground />

            {/* Custom Cursor */}
            <CustomCursor />

            {/* Scroll Progress Bar */}
            {!isLoading && <ScrollProgress />}

            {/* Theme Toggle */}
            <EnhancedThemeToggle />

            {/* Music Player (Waits for loading to finish) */}
            <MusicPlayer canShowModal={!isLoading} />

            {/* Back to Top Button */}
            {!isLoading && <BackToTop />}

            {/* Toast Notifications */}
            <Toaster position="bottom-right" />

            {/* Routes */}
            {!isLoading && (
              <Routes>
                <Route exact path={"home"} element={<Navigate to="/" />} />
                <Route exact path={"/"} element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            )}
          </div>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
