import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import TodoApp from "../components/dashboard/TodoApp";
import Resolutions from "../components/dashboard/Resolutions";
import FocusTimer from "../components/dashboard/FocusTimer";
import ReadingList from "../components/dashboard/ReadingList";
import FinanceTracker from "../components/dashboard/FinanceTracker";
import ProjectBoard from "../components/dashboard/ProjectBoard";
import UnifiedCalendar from "../components/dashboard/UnifiedCalendar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Task01Icon,
  Target01Icon,
  Clock01Icon,
  BookOpen01Icon,
  MoneyBag02Icon,
  KanbanIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Initialize activeTab from localStorage, fallback to "tasks"
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("dashboardActiveTab");
    return saved || "tasks";
  });

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);

  const tabs = [
    { id: "tasks", label: "Tasks", icon: Task01Icon },
    { id: "resolutions", label: "Resolutions", icon: Target01Icon },
    { id: "focus", label: "Focus", icon: Clock01Icon },
    { id: "library", label: "Library", icon: BookOpen01Icon },
    { id: "projects", label: "Projects", icon: KanbanIcon },
    { id: "calendar", label: "Calendar", icon: Calendar03Icon },
    { id: "finance", label: "Finance", icon: MoneyBag02Icon },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-[var(--primary)] selection:text-white pb-20">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] text-sm sm:text-base"
          >
            Welcome back, {user?.displayName || "User"}! Let&apos;s be productive today.
          </motion.p>
        </div>

        {/* Tab Navigation - Grid on mobile, flex on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                id={tab.id}
                className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 sm:px-6 py-3.5 sm:py-3 rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${
                  isActive
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xl shadow-[var(--primary)]/30"
                    : "bg-[var(--bg-card)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
                }`}
              >
                <HugeiconsIcon icon={tab.icon} size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[400px]"
            >
              {activeTab === "tasks" && <TodoApp />}
              {activeTab === "resolutions" && <Resolutions />}
              {activeTab === "focus" && <FocusTimer />}
              {activeTab === "library" && <ReadingList />}
              {activeTab === "finance" && <FinanceTracker />}
              {activeTab === "projects" && <ProjectBoard />}
              {activeTab === "calendar" && <UnifiedCalendar />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
