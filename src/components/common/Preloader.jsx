import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "Data is the new oil.", author: "Clive Humby" },
  { text: "Artificial Intelligence is the new electricity.", author: "Andrew Ng" },
  { text: "Data really powers everything that we do.", author: "Jeff Weiner" },
  { text: "Without data, you're just another person with an opinion.", author: "W. Edwards Deming" },
  { text: "Errors using inadequate data are much less than those using no data at all.", author: "Charles Babbage" },
  { text: "Hiding within those mounds of data is knowledge that could change the world.", author: "Atul Gawande" },
  { text: "Torture the data, and it will confess to anything.", author: "Ronald Coase" },
  { text: "Predicting the future isn't magic, it's artificial intelligence.", author: "Dave Waters" },
  { text: "The goal is to turn data into information, and information into insight.", author: "Carly Fiorina" },
  { text: "In God we trust. All others must bring data.", author: "W. Edwards Deming" },
  { text: "Data beats emotions.", author: "Sean Rad" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Testing leads to failure, and failure leads to understanding.", author: "Burt Rutan" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
];

// eslint-disable-next-line react/prop-types
const Preloader = ({ isLoading }) => {
  const [currentQuote, setCurrentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--bg-main)] px-4 text-center"
        >
          {/* Animated Blob/Shape */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 33% 67% / 55% 27% 73% 45%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="w-24 h-24 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] mb-8 shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)]"
          />

          {/* Quote Container */}
          <div className="h-32 flex flex-col items-center justify-center max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] mb-3">
                  &quot;{currentQuote.text}&quot;
                </h2>
                <p className="text-[var(--text-secondary)] font-medium italic">
                  - {currentQuote.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar (Decorative) */}
          <div className="mt-6 w-48 h-1 bg-[var(--text-secondary)]/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-1/2 h-full bg-[var(--primary)] rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
