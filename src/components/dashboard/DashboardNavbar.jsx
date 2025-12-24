import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Logout01Icon, 
  Home01Icon,
  SparklesIcon
} from "@hugeicons/core-free-icons";

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--glass-border)]">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between max-w-7xl">
        {/* Logo/Brand */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group transition-all duration-300"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 group-hover:scale-110 transition-transform">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            My <span className="text-[var(--primary)]">Workspace</span>
          </span>
        </Link>

        {/* User Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Home Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium"
          >
            <HugeiconsIcon icon={Home01Icon} size={18} />
            <span>Beranda</span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-6 border-l border-[var(--glass-border)]">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                {user?.displayName || "Creator"}
              </p>
              <p className="text-[10px] text-[var(--primary)] uppercase tracking-wider font-bold">
                PRO Member
              </p>
            </div>
            
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--primary)]/30 flex items-center justify-center bg-[var(--bg-card)] text-[var(--primary)] font-bold text-xs sm:text-sm overflow-hidden shadow-inner">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 sm:p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Logout"
            >
              <HugeiconsIcon icon={Logout01Icon} size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
