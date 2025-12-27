import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../ui/ConfirmModal";
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
  Delete02Icon,
  Clock01Icon,
  TimerIcon,
} from "@hugeicons/core-free-icons";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
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
  
  // Session tracking for history
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentSessionStart, setCurrentSessionStart] = useState(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [hadPauses, setHadPauses] = useState(false);
  
  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mode Switch Confirmation State
  const [pendingMode, setPendingMode] = useState(null);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

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
    
    const titleToRestore = originalTitle.current;
    
    return () => {
      document.title = titleToRestore;
    };
  }, []);

  // Subscribe to session history from Firestore
  useEffect(() => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "users", user.uid, "focus_sessions"),
      orderBy("completedAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate()
      }));
      setSessionHistory(sessions);
      
      // Count today's sessions
      const todaySessions = sessions.filter(s => 
        s.completedAt && s.completedAt >= today
      );
      setSessions(todaySessions.length);
    });

    return () => unsubscribe();
  }, [user]);

  // Update document title with timer
  useEffect(() => {
    if (isActive) {
      const status = isBreak ? "☕ Istirahat" : "🎯 Fokus";
      document.title = `${formatTime(timeLeft)} | ${status}`;
    } else {
      document.title = originalTitle.current;
    }
  }, [timeLeft, isActive, isBreak]);

  // Reset timer when mode changes (only if not running and not paused mid-session)
  useEffect(() => {
    if (!isActive && !isBreak && !currentSessionStart) {
      setTimeLeft(mode.work * 60);
      setProgress(100);
    }
  }, [mode, isActive, isBreak, currentSessionStart]);

  // Timer countdown
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
      // Work session completed - LOG TO HISTORY
      sendNotification(
        "🎉 Sesi Fokus Selesai!",
        `Kerja bagus! Kamu sudah menyelesaikan sesi fokus ${mode.work} menit. Waktunya istirahat ${mode.break} menit.`
      );
      
      // Log to Firestore
      if (user && currentSessionStart) {
        try {
          await addDoc(collection(db, "users", user.uid, "focus_sessions"), {
            mode: mode.id,
            modeLabel: mode.label,
            duration: mode.work,
            startedAt: currentSessionStart,
            completedAt: serverTimestamp(),
            hadPauses: hadPauses,
            totalPausedSeconds: Math.round(totalPausedTime / 1000),
          });
        } catch (error) {
          console.error("Error logging session:", error);
        }
      }

      // Reset session tracking
      setCurrentSessionStart(null);
      setTotalPausedTime(0);
      setHadPauses(false);

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
    
    if (!isActive) {
      // Starting or Resuming
      if (!currentSessionStart && !isBreak) {
        // Fresh start
        setCurrentSessionStart(new Date());
        setTotalPausedTime(0);
        setHadPauses(false);
      } else if (pauseStartTime) {
        // Resuming from pause
        const pauseDuration = Date.now() - pauseStartTime;
        setTotalPausedTime(prev => prev + pauseDuration);
        setPauseStartTime(null);
      }
      setIsActive(true);
    } else {
      // Pausing
      setHadPauses(true);
      setPauseStartTime(Date.now());
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(mode.work * 60);
    setProgress(100);
    clearInterval(timerRef.current);
    
    // Reset session tracking (do NOT log incomplete session)
    setCurrentSessionStart(null);
    setTotalPausedTime(0);
    setHadPauses(false);
    setPauseStartTime(null);
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

  const confirmDelete = (sessionId) => {
    setDeleteId(sessionId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteSession(deleteId);
      setDeleteId(null);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "focus_sessions", sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleModeClick = (newModeTemplate) => {
    // If clicking the current mode, just toggle custom settings if it's custom
    if (newModeTemplate.id === mode.id) {
       if (newModeTemplate.id === "custom") {
         setShowCustomSettings(!showCustomSettings);
       }
       return;
    }

    // Check if session is in progress (active or paused)
    if (currentSessionStart || isActive || hadPauses) {
      setPendingMode(newModeTemplate);
      setShowSwitchModal(true);
    } else {
      // Safe to switch immediately
      applyMode(newModeTemplate);
    }
  };

  const confirmSwitchMode = () => {
    if (pendingMode) {
      applyMode(pendingMode);
      setPendingMode(null);
      setShowSwitchModal(false);
    }
  };

  const applyMode = (targetMode) => {
    resetTimer(); // Ensure everything is reset first
    
    if (targetMode.id === "custom") {
      setShowCustomSettings(true);
      setMode({ ...targetMode, work: customWork, break: customBreak });
    } else {
      setShowCustomSettings(false);
      setMode(targetMode);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSessionTime = (date) => {
    if (!date) return "-";
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const circleRadius = 120;
  const circumference = 2 * Math.PI * circleRadius;

  // Today's stats
  const todayStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessionHistory.filter(s => 
      s.completedAt && s.completedAt >= today
    );
    
    const totalMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    return {
      count: todaySessions.length,
      totalMinutes,
      sessions: todaySessions,
    };
  }, [sessionHistory]);

  // Calculate streak (consecutive days with sessions)
  const streak = useMemo(() => {
    if (sessionHistory.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentDate = new Date(today);
    let streakCount = 0;
    
    while (true) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const hasSession = sessionHistory.some(s => 
        s.completedAt && s.completedAt >= dayStart && s.completedAt < dayEnd
      );
      
      if (hasSession) {
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streakCount;
  }, [sessionHistory]);

  return (
    <div className="flex flex-col items-center justify-start space-y-4 sm:space-y-6 py-2 sm:py-4">
      {/* How to Use Guide */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md p-4 rounded-2xl bg-slate-800/80 border border-[var(--glass-border)] mb-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-[var(--primary)]" />
                Cara Menggunakan
              </h4>
              <button onClick={() => setShowGuide(false)} className="text-[var(--text-secondary)] hover:text-white">
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2">
              <li>1. Pilih teknik fokus (Pomodoro, Deep Work, dll)</li>
              <li>2. Tekan <span className="text-[var(--primary)]">▶️ Play</span> untuk memulai</li>
              <li>3. Tekan <span className="text-amber-400">⏸️ Pause</span> untuk jeda (waktu tersimpan)</li>
              <li>4. Tekan <span className="text-red-400">⏹️ Stop</span> untuk reset total</li>
              <li>5. Sesi tercatat di history setelah selesai</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Toggle */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="text-[var(--text-secondary)] hover:text-white transition-colors"
      >
        <HugeiconsIcon icon={InformationCircleIcon} size={20} />
      </button>

      {/* Mode Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {TIMER_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeClick(m)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              mode.id === m.id
                ? "text-white shadow-lg"
                : "bg-slate-800/50 text-[var(--text-secondary)] hover:bg-slate-700"
            }`}
            style={mode.id === m.id ? { backgroundColor: m.color } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Custom Settings Panel */}
      <AnimatePresence>
        {showCustomSettings && mode.id === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-sm p-4 rounded-2xl bg-slate-800/80 border border-[var(--glass-border)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-white text-sm">Pengaturan Custom</h4>
              <button 
                onClick={() => setShowCustomSettings(false)}
                className="text-[var(--text-secondary)] hover:text-white"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] block mb-1">Fokus (menit)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customWork}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setCustomWork(val);
                    setMode(prev => ({ ...prev, work: val }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] block mb-1">Istirahat (menit)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setCustomBreak(val);
                    setMode(prev => ({ ...prev, break: val }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Description */}
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm"
        style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
      >
        <span className="font-semibold">{mode.label}</span>
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        <span>{formatMinutesToTime(mode.work)} → {formatMinutesToTime(mode.break)} istirahat</span>
      </div>

      {/* Timer Circle */}
      <motion.div
        key={mode.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-64 h-64 sm:w-72 sm:h-72"
      >
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            fill="none"
            stroke={isBreak ? "#10b981" : mode.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            initial={false}
            animate={{ 
              strokeDashoffset: circumference - (progress / 100) * circumference 
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1 flex items-center gap-1">
            <HugeiconsIcon icon={isBreak ? Moon02Icon : Sun01Icon} size={14} />
            {isBreak ? "ISTIRAHAT" : "FOKUS"}
          </span>
          <span className="text-4xl sm:text-5xl font-bold text-white tracking-wider">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-[var(--text-secondary)] mt-2">
            Sesi #{sessions + 1}
          </span>
          {currentSessionStart && !isBreak && (
            <span className="text-[10px] text-amber-400 mt-1">
              {hadPauses ? "• Ada jeda" : "• Sedang berjalan"}
            </span>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
          style={{ backgroundColor: isActive ? "#f59e0b" : "var(--primary)" }}
        >
          <HugeiconsIcon icon={isActive ? PauseIcon : PlayIcon} size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
        >
          <HugeiconsIcon icon={StopIcon} size={20} />
        </motion.button>

        {isBreak && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipBreak}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
          >
            Skip Istirahat
          </motion.button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-800/50 border border-[var(--glass-border)] text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{todayStats.count}</div>
          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Sesi Hari Ini</div>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-800/50 border border-[var(--glass-border)] text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{formatMinutesToTime(todayStats.totalMinutes)}</div>
          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Total Fokus</div>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-800/50 border border-[var(--glass-border)] text-center">
          <div className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-1">
            🔥 {streak}
          </div>
          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Streak</div>
        </div>
      </div>

      {/* Session History */}
      {/* Session History (Always Visible) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-4 rounded-2xl bg-slate-800/50 border border-[var(--glass-border)]"
      >
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <HugeiconsIcon icon={TimerIcon} size={18} className="text-[var(--primary)]" />
          History Hari Ini
        </h4>

        {todayStats.sessions.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {todayStats.sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 group hover:border-[var(--primary)]/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: TIMER_MODES.find(m => m.id === session.mode)?.color || "#6b7280" }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {session.modeLabel || session.mode}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} size={10} />
                        {formatSessionTime(session.completedAt)}
                      </span>
                      <span>•</span>
                      <span>{session.duration} menit</span>
                      {session.hadPauses && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400">Jeda: {Math.round((session.totalPausedSeconds || 0) / 60)}m</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => confirmDelete(session.id)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-700/20 rounded-xl border border-dashed border-slate-700">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3 text-slate-500">
              <HugeiconsIcon icon={TimerIcon} size={24} />
            </div>
            <p className="text-sm text-slate-400 font-medium">Belum ada sesi fokus</p>
            <p className="text-xs text-slate-500 mt-1">Ayo mulai fokus produktif hari ini!</p>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Hapus Sesi?"
        message="Sesi ini akan dihapus permanen dari riwayat kamu."
        confirmText="Hapus"
        type="danger"
      />

      {/* Mode Switch Confirmation Modal */}
      <ConfirmModal
        isOpen={showSwitchModal}
        onClose={() => {
          setShowSwitchModal(false);
          setPendingMode(null);
        }}
        onConfirm={confirmSwitchMode}
        title="Ganti Mode Fokus?"
        message={`Sesi "${mode.label}" sedang berjalan. Mengganti mode akan mereset progress saat ini.`}
        confirmText="Reset & Ganti"
        cancelText="Lanjut Fokus"
        type="warning"
      />

      {/* Notification Permission */}
      {notificationPermission === "default" && (
        <button
          onClick={requestNotificationPermission}
          className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <HugeiconsIcon icon={Notification01Icon} size={14} />
          Aktifkan Notifikasi
        </button>
      )}
    </div>
  );
};

export default FocusTimer;
