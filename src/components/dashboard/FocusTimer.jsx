import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  Moon02Icon,
  Sun01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
  Cancel01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const TIMER_MODES = [
  { id: "pomodoro", label: "Pomodoro", work: 25, break: 5, color: "#ef4444", desc: "25 menit kerja, 5 menit istirahat" },
  { id: "deepwork", label: "Deep Work", work: 90, break: 20, color: "#8b5cf6", desc: "90 menit kerja mendalam, 20 menit istirahat" },
  { id: "5217", label: "52/17", work: 52, break: 17, color: "#10b981", desc: "52 menit kerja, 17 menit istirahat (teknik ilmiah)" },
  { id: "custom", label: "Custom", work: 45, break: 15, color: "#f59e0b", desc: "45 menit kerja, 15 menit istirahat" },
];

// Format minutes to jam:menit display
const formatMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}j ${mins}m`;
  if (hours > 0) return `${hours} jam`;
  return `${mins} menit`;
};

const FocusTimer = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState(TIMER_MODES[0]);
  const [timeLeft, setTimeLeft] = useState(mode.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  const [sessions, setSessions] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [customWork, setCustomWork] = useState(45);
  const [customBreak, setCustomBreak] = useState(15);
  const [notificationPermission, setNotificationPermission] = useState("default");
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const originalTitle = useRef(document.title);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audioRef.current.volume = 0.7;
    
    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
    
    return () => {
      document.title = originalTitle.current;
    };
  }, []);

  // Update document title with timer
  useEffect(() => {
    if (isActive) {
      const status = isBreak ? "☕ Istirahat" : "🎯 Fokus";
      document.title = `${formatTime(timeLeft)} | ${status}`;
    } else {
      document.title = originalTitle.current;
    }
  }, [timeLeft, isActive, isBreak]);

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

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const sendNotification = (title, body) => {
    // Play audio
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Vibrate if supported (mobile)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/k-logo.svg",
        badge: "/k-logo.svg",
        vibrate: [200, 100, 200],
        tag: "focus-timer",
        requireInteraction: true,
      });
    }
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);

    if (!isBreak) {
      // Work session completed
      const newSessions = sessions + 1;
      setSessions(newSessions);
      
      sendNotification(
        "🎉 Sesi Fokus Selesai!",
        `Kerja bagus! Kamu sudah menyelesaikan sesi fokus ${mode.work} menit. Waktunya istirahat ${mode.break} menit.`
      );
      
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
      sendNotification(
        "⚡ Waktu Istirahat Berakhir!",
        "Istirahat sudah selesai. Siap untuk sesi fokus berikutnya?"
      );
      
      setIsBreak(false);
      setTimeLeft(mode.work * 60);
      setProgress(100);
    }
  };

  const toggleTimer = () => {
    // Request notification permission on first start
    if (!isActive && notificationPermission === "default") {
      requestNotificationPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(mode.work * 60);
    setProgress(100);
    clearInterval(timerRef.current);
  };

  const skipBreak = () => {
    if (isBreak) {
      setIsBreak(false);
      setIsActive(false);
      setTimeLeft(mode.work * 60);
      setProgress(100);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const circleRadius = 120;
  const circumference = 2 * Math.PI * circleRadius;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4 sm:py-6">
      {/* How to Use Guide */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg p-4 sm:p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <HugeiconsIcon icon={InformationCircleIcon} size={20} className="text-blue-400" />
                Cara Menggunakan Focus Timer
              </h3>
              <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-white">
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>
            <ol className="text-sm text-[var(--text-secondary)] space-y-2 list-decimal list-inside">
              <li>Pilih mode timer sesuai kebutuhan (Pomodoro = 25/5 menit)</li>
              <li>Tekan tombol <span className="text-[var(--primary)]">▶ Play</span> untuk memulai</li>
              <li>Fokus bekerja sampai timer selesai (akan ada suara & notifikasi)</li>
              <li>Istirahat sesuai waktu yang ditentukan</li>
              <li>Ulangi sesi untuk produktivitas maksimal!</li>
            </ol>
            <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-300">
                💡 <strong>Tip:</strong> Aktifkan notifikasi browser agar kamu tahu kapan waktu selesai, bahkan saat tab tidak aktif!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header with Help Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className={`p-2 rounded-xl transition-all ${showGuide ? "bg-blue-500/20 text-blue-400" : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white"}`}
          title="Cara menggunakan"
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={20} />
        </button>
        
        {/* Notification Permission Button */}
        {notificationPermission !== "granted" && (
          <button
            onClick={requestNotificationPermission}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
          >
            <HugeiconsIcon icon={Notification01Icon} size={16} />
            <span className="hidden sm:inline">Aktifkan Notifikasi</span>
          </button>
        )}
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {TIMER_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              if (m.id === "custom") {
                setShowCustomSettings(true);
                // Create custom mode with user-defined times
                const customMode = { ...m, work: customWork, break: customBreak, desc: `${customWork} menit kerja, ${customBreak} menit istirahat (Kustom)` };
                setMode(customMode);
                setTimeLeft(customWork * 60);
              } else {
                setShowCustomSettings(false);
                setMode(m);
                setTimeLeft(m.work * 60);
              }
              setIsActive(false);
              setIsBreak(false);
              setProgress(100);
            }}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              mode.id === m.id
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25"
                : "bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title={m.desc}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Custom Timer Settings */}
      <AnimatePresence>
        {showCustomSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-xl border border-amber-500/30 rounded-2xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                ⚙️ Atur Waktu Kustom
              </h4>
              <button
                onClick={() => setShowCustomSettings(false)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-all flex items-center gap-1"
              >
                ✓ Selesai
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">🎯 Fokus</label>
                <input
                  type="number"
                  min={1}
                  max={480}
                  value={customWork}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(480, parseInt(e.target.value) || 1));
                    setCustomWork(value);
                    if (!isActive && !isBreak) {
                      setMode(prev => ({ ...prev, work: value, desc: `${formatMinutesToTime(value)} kerja, ${formatMinutesToTime(customBreak)} istirahat (Kustom)` }));
                      setTimeLeft(value * 60);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-amber-500/30 focus:border-amber-500 outline-none text-white text-lg text-center font-bold appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <p className="text-xs text-center text-[var(--text-secondary)] mt-1">
                  = {formatMinutesToTime(customWork)}
                </p>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">☕ Istirahat</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={customBreak}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(120, parseInt(e.target.value) || 1));
                    setCustomBreak(value);
                    if (!isActive && !isBreak) {
                      setMode(prev => ({ ...prev, break: value, desc: `${formatMinutesToTime(customWork)} kerja, ${formatMinutesToTime(value)} istirahat (Kustom)` }));
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-amber-500/30 focus:border-amber-500 outline-none text-white text-lg text-center font-bold appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <p className="text-xs text-center text-[var(--text-secondary)] mt-1">
                  = {formatMinutesToTime(customBreak)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Mode Description - Visual Badge */}
      <motion.div 
        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        key={mode.id}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
          style={{ backgroundColor: mode.color }}
        >
          {isBreak ? "☕" : "🎯"}
        </div>
        <div>
          <span className="text-xs text-[var(--text-secondary)]">{mode.label}</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white font-medium">{formatMinutesToTime(mode.work)}</span>
            <span className="text-[var(--text-secondary)]">→</span>
            <span className="text-emerald-400 font-medium">{formatMinutesToTime(mode.break)} istirahat</span>
          </div>
        </div>
      </motion.div>

      {/* Timer Display */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* SVG Ring */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 288 288">
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-[var(--bg-card)] opacity-50"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            stroke={isBreak ? "#10b981" : mode.color}
            strokeWidth="10"
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
            <HugeiconsIcon icon={isBreak ? Moon02Icon : Sun01Icon} size={18} />
            <span className="uppercase tracking-widest text-xs sm:text-sm font-medium">
              {isBreak ? "Istirahat" : "Fokus"}
            </span>
          </div>
          <div className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tighter text-[var(--text-primary)]">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-3 text-sm text-[var(--text-secondary)] font-medium">
            Sesi #{sessions + 1}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleTimer}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <HugeiconsIcon icon={isActive ? PauseIcon : PlayIcon} size={28} fill="currentColor" />
        </button>
        <button
          onClick={resetTimer}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] flex items-center justify-center hover:text-white hover:bg-slate-700 transition-all"
        >
          <HugeiconsIcon icon={StopIcon} size={20} />
        </button>
        
        {/* Skip Break Button */}
        {isBreak && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={skipBreak}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2 hover:bg-emerald-500/30 transition-all"
          >
            <span>Skip</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </motion.button>
        )}
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md">
        <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)] text-center">
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{sessions}</div>
          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Sesi Hari Ini</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)] text-center">
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {Math.round(sessions * mode.work / 60 * 10) / 10}h
          </div>
          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Total Fokus</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--glass-border)] text-center">
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">🔥</div>
          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Streak</div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
