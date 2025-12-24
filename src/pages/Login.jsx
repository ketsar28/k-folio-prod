import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  LockPasswordIcon, 
  Mail01Icon, 
  Login01Icon,
  SparklesIcon,
  ArrowLeft01Icon,
  ViewIcon,
  ViewOffIcon
} from "@hugeicons/core-free-icons";

const Login = () => {
  const { user, loginWithEmail, loginWithGoogle, error, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    try {
      await loginWithEmail(email, password);
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setLocalError(null);

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-main)] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Portfolio */}
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors mb-6 group text-sm"
          whileHover={{ x: -5 }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          <span className="hidden sm:inline">Kembali ke Portfolio</span>
          <span className="sm:hidden">Kembali</span>
        </motion.button>

        {/* Login Card */}
        <div className="bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg"
            >
              <HugeiconsIcon icon={SparklesIcon} size={28} color="white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Private Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 text-xs sm:text-sm">
              Akses khusus untuk pemilik portfolio
            </p>
          </div>

          {/* Error Message */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm text-center"
            >
              {displayError}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                <HugeiconsIcon icon={Mail01Icon} size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                <HugeiconsIcon icon={LockPasswordIcon} size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={18} />
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[var(--primary)]/20 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <HugeiconsIcon icon={Login01Icon} size={18} />
                  <span>Masuk</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5 sm:my-6">
            <div className="flex-1 h-px bg-[var(--glass-border)]" />
            <span className="text-[var(--text-secondary)] text-xs">atau</span>
            <div className="flex-1 h-px bg-[var(--glass-border)]" />
          </div>

          {/* Google Login */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={isSubmitting || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 sm:py-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] hover:border-[var(--primary)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-2 sm:gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="hidden sm:inline">Masuk dengan Google</span>
            <span className="sm:hidden">Google</span>
          </motion.button>

          {/* Footer Note */}
          <p className="text-center text-[10px] sm:text-xs text-[var(--text-secondary)] mt-5 sm:mt-6">
            Halaman ini hanya untuk admin portfolio
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
