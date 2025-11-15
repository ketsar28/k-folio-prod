import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaTimes } from "react-icons/fa";
import { IoMusicalNotes } from "react-icons/io5";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load saved preferences
    const savedVolume = localStorage.getItem("musicVolume");
    const savedMuted = localStorage.getItem("musicMuted");
    const userConsent = localStorage.getItem("musicConsent");

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === "true");
    if (userConsent === "true") setShowWelcomeModal(false);

    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = savedVolume ? parseFloat(savedVolume) : 0.3;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("musicVolume", newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    localStorage.setItem("musicMuted", !isMuted);
  };

  const handleUserConsent = (consent) => {
    localStorage.setItem("musicConsent", consent);
    setShowWelcomeModal(false);
    if (consent && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setShowPlayer(false);
  };

  if (!showPlayer) return null;

  return (
    <>
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
            onClick={() => handleUserConsent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-light)] p-8 rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <IoMusicalNotes className="text-6xl text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 text-center">
                Welcome! 🎵
              </h2>
              <p className="text-[var(--text-secondary)] mb-6 text-center">
                Would you like to enjoy some chill background music while exploring the portfolio?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleUserConsent(true)}
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
                >
                  Yes, Play Music
                </button>
                <button
                  onClick={() => handleUserConsent(false)}
                  className="flex-1 bg-[var(--bg-dark)] hover:bg-[var(--secondary)] text-[var(--text-primary)] py-3 px-6 rounded-lg font-semibold transition-all duration-200"
                >
                  No, Thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed bottom-6 right-6 z-[9999] ${
          isMinimized ? "w-16 h-16" : "w-80"
        }`}
      >
        <div className="bg-[var(--bg-light)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--primary)]/20 overflow-hidden">
          {isMinimized ? (
            // Minimized View
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full flex items-center justify-center hover:bg-[var(--bg-dark)] transition-all"
            >
              <IoMusicalNotes
                className={`text-3xl ${
                  isPlaying ? "text-[var(--primary)] animate-pulse" : "text-[var(--text-secondary)]"
                }`}
              />
            </button>
          ) : (
            // Expanded View
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IoMusicalNotes className="text-[var(--primary)] text-xl" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Background Music
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <span className="text-lg">−</span>
                  </button>
                  <button
                    onClick={closePlayer}
                    className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  Lofi Study Beats
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Chill Background Music</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mb-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? <FaPause className="text-lg" /> : <FaPlay className="text-lg ml-1" />}
                </button>

                {/* Volume */}
                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-[var(--bg-dark)] rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Progress Bar (visual only for now) */}
              <div className="h-1 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-[var(--primary)] ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                  style={{ width: isPlaying ? "100%" : "0%" }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      >
        {/* Placeholder - You'll need to add your music file */}
        {/* <source src="/music/lofi-background.mp3" type="audio/mpeg" /> */}
        <source
          src="https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;
