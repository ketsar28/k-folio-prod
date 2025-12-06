import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMusic, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward } from "react-icons/fa";
import music1 from "../../assets/music/music-1.mp3";
import music2 from "../../assets/music/music-2.mp3";
import music3 from "../../assets/music/music-3.mp3";
import music4 from "../../assets/music/music 4.mp3";

// eslint-disable-next-line react/prop-types
const MusicPlayer = ({ canShowModal = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const audioRef = useRef(null);

  // Show modal only when allowed (after preloader)
  useEffect(() => {
    if (canShowModal) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [canShowModal]);

  // Playlist Configuration
  const playlist = [
    {
      title: "Treat You Better",
      artist: "Shawn Mendes",
      src: music1,
    },
    {
      title: "Game Time",
      artist: "Flo Rida",
      src: music2,
    },
    {
      title: "Adderall & Coffee",
      artist: "Jakey Krumm",
      src: music3,
    },
    {
      title: "Constellations",
      artist: "Keenan Te",
      src: music4,
    }
  ];

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle track ending - auto play next
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentTrackIndex]); // Re-bind when index changes

  // Auto-play when track changes if already playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Playback failed:", e));
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.log("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleAcceptMusic = () => {
    setShowModal(false);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Playback failed:", e));
    }
    // Show controls briefly to indicate location
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  const handleDeclineMusic = () => {
    setShowModal(false);
    setIsPlaying(false);
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.src} loop={false} />

      {/* Welcome Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-6 md:p-8 max-w-md w-[90%] text-center space-y-6 border border-[var(--primary)]/30 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto text-[var(--primary)] text-3xl animate-pulse">
                <FaMusic />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  Experience the Vibe?
                </h3>
                <p className="text-[var(--text-secondary)]">
                  This website features a curated lofi playlist for an immersive experience. Would you like to turn it on?
                </p>
              </div>

              <div className="flex gap-2 sm:gap-4 justify-center">
                <button
                  onClick={handleDeclineMusic}
                  className="px-4 py-2 sm:px-6 text-xs sm:text-base rounded-full border border-[var(--text-secondary)] text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/10 transition-all font-medium whitespace-nowrap"
                >
                  No, thanks
                </button>
                <button
                  onClick={handleAcceptMusic}
                  className="px-4 py-2 sm:px-6 text-xs sm:text-base rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all font-bold shadow-lg shadow-[var(--primary)]/30 flex items-center gap-2 whitespace-nowrap"
                >
                  <FaPlay className="text-xs sm:text-sm" /> Yes, Play Music
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Music Control */}
      <motion.div
        className="fixed bottom-6 left-6 z-[90]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div 
          className="relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Main Icon */}
          <motion.button
            onClick={() => setShowControls(!showControls)}
            className={`w-12 h-12 rounded-full flex items-center justify-center glass-premium border border-[var(--primary)]/30 text-[var(--primary)] shadow-lg transition-all ${
              isPlaying ? "animate-spin-slow" : ""
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMusic />
          </motion.button>

          {/* Expanded Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 16, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                className="absolute left-full bottom-0 ml-4 glass-premium p-4 rounded-2xl flex flex-col gap-3 min-w-[200px]"
              >
                {/* Track Info */}
                <div className="flex items-center gap-3 border-b border-[var(--text-secondary)]/20 pb-2">
                  <div className={`w-10 h-10 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] ${isPlaying ? 'animate-pulse' : ''}`}>
                    <FaMusic className="text-sm" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-[var(--text-primary)]">{currentTrack.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={handlePrev}
                    className="p-2 rounded-full hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <FaStepBackward />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary-hover)] transition-colors shadow-lg"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                  </button>

                  <button 
                    onClick={handleNext}
                    className="p-2 rounded-full hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <FaStepForward />
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={toggleMute}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-[var(--bg-card)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--primary)]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
