import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  Settings01Icon,
  Moon02Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const TIMER_MODES = [
  { id: "pomodoro", label: "Pomodoro", work: 25, break: 5, color: "#ef4444" },
  { id: "deepwork", label: "Deep Work", work: 90, break: 20, color: "#8b5cf6" },
  { id: "5217", label: "52/17", work: 52, break: 17, color: "#10b981" },
  { id: "custom", label: "Custom", work: 45, break: 15, color: "#f59e0b" },
];

const FocusTimer = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState(TIMER_MODES[0]);
  const [timeLeft, setTimeLeft] = useState(mode.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  const [sessions, setSessions] = useState(0);
  
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));

  useEffect(() => {
    // Reset timer when mode changes
    if (!isActive && !isBreak) {
      setTimeLeft(mode.work * 60);
      setProgress(100);
    }
  }, [mode, isActive, isBreak]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const totalTime = isBreak ? mode.break * 60 : mode.work * 60;
          setProgress((newTime / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, isBreak, mode]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    audioRef.current.play().catch(e => console.log("Audio play failed:", e));

    if (!isBreak) {
      // Work session completed
      const newSessions = sessions + 1;
      setSessions(newSessions);
      
      // Log to Firestore
      if (user) {
        try {
          await addDoc(collection(db, "users", user.uid, "focus_sessions"), {
            mode: mode.id,
            duration: mode.work,
            completedAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error logging session:", error);
        }
      }

      // Start break
      setIsBreak(true);
      setTimeLeft(mode.break * 60);
      setProgress(100);
    } else {
      // Break session completed, back to work
      setIsBreak(false);
      setTimeLeft(mode.work * 60);
      setProgress(100);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(mode.work * 60);
    setProgress(100);
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const circleRadius = 120;
  const circumference = 2 * Math.PI * circleRadius;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6">
      {/* Mode Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {TIMER_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m);
              setIsActive(false);
              setIsBreak(false);
              setTimeLeft(m.work * 60);
              setProgress(100);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode.id === m.id
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25"
                : "bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* SVG Ring */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 288 288">
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-[var(--bg-card)] opacity-50"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            stroke={isBreak ? "#10b981" : mode.color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        {/* Time Text */}
        <div className="text-center z-10">
          <div className="flex items-center justify-center gap-2 mb-2 text-[var(--text-secondary)]">
            <HugeiconsIcon icon={isBreak ? Moon02Icon : Sun01Icon} size={20} />
            <span className="uppercase tracking-widest text-sm font-medium">
              {isBreak ? "Break Time" : "Focus Time"}
            </span>
          </div>
          <div className="text-6xl font-bold tabular-nums tracking-tighter text-[var(--text-primary)]">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-4 text-sm text-[var(--text-secondary)] font-medium">
            Session #{sessions + 1}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <HugeiconsIcon icon={isActive ? PauseIcon : PlayIcon} size={32} fill="currentColor" />
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] flex items-center justify-center hover:text-white hover:bg-slate-700 transition-all"
        >
          <HugeiconsIcon icon={StopIcon} size={24} />
        </button>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
        <div className="p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{sessions}</div>
          <div className="text-xs text-[var(--text-secondary)]">Sesi Hari Ini</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {Math.round(sessions * mode.work / 60 * 10) / 10}h
          </div>
          <div className="text-xs text-[var(--text-secondary)]">Total Fokus</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">🔥</div>
          <div className="text-xs text-[var(--text-secondary)]">Streak</div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
