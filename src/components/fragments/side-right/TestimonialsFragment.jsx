import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Element } from "react-scroll";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { testimonials } from "../../../data/testimonials";

const TestimonialsFragment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <Element className="min-h-screen flex items-center py-20" id="testimonials" name="testimonials">
      <div className="w-full space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Client Testimonials
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            What people say about working with me
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-[var(--bg-light)] rounded-full shadow-lg hover:shadow-xl text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all z-10"
            >
              <FaChevronLeft className="text-xl" />
            </motion.button>

            {/* Testimonial Card */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="bg-[var(--bg-light)] backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-[var(--primary)]/20"
                >
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full">
                      <FaQuoteLeft className="text-3xl text-white" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-xl" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg md:text-xl text-[var(--text-secondary)] text-center mb-8 leading-relaxed italic">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Client Info */}
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-bold text-[var(--text-primary)]">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-[var(--text-secondary)]">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-sm text-[var(--primary)] font-semibold">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-[var(--bg-light)] rounded-full shadow-lg hover:shadow-xl text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all z-10"
            >
              <FaChevronRight className="text-xl" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-[var(--primary)]"
                    : "w-3 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid (Optional - Hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer bg-[var(--bg-light)] backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl border transition-all ${
                index === currentIndex
                  ? "border-[var(--primary)] scale-105"
                  : "border-[var(--primary)]/20"
              }`}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 text-sm" />
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4 italic">
                "{testimonial.text}"
              </p>
              <div>
                <h5 className="text-sm font-bold text-[var(--text-primary)]">
                  {testimonial.name}
                </h5>
                <p className="text-xs text-[var(--text-secondary)]">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Element>
  );
};

export default TestimonialsFragment;
