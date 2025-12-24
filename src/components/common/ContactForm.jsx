import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { FaPaperPlane, FaUser, FaEnvelope, FaCommentAlt } from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = [
    "General Inquiry",
    "Project Collaboration",
    "Consultation Request",
    "Job Opportunity",
    "Data Science Discussion",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (option) => {
    setFormData({ ...formData, subject: option });
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration
      const serviceId = "service_jd9c5x5";
      const contactTemplateId = "template_py7cmyj";  // Email to you
      const autoReplyTemplateId = "template_vycdlpq"; // Auto-reply to visitor
      const publicKey = "FXX2RU8htzBtGiKH4";

      // Append branding to message
      const brandedMessage = `${formData.message}\n\n--\nSent from Ketsar Ali Website`;

      // 1. Send email to you (Ketsar)
      await emailjs.send(
        serviceId,
        contactTemplateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: brandedMessage,
          to_name: "Ketsar",
        },
        publicKey
      );

      // 2. Send auto-reply to visitor
      await emailjs.send(
        serviceId,
        autoReplyTemplateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          to_name: "Ketsar",
          reply_to: formData.email, // Important for auto-reply
        },
        publicKey
      );

      toast.success(
        "✅ Message sent successfully! Check your email for confirmation. I'll respond within 24-48 hours.",
        {
          duration: 6000,
          position: "bottom-right",
          style: {
            background: "var(--bg-light)",
            color: "var(--text-primary)",
            border: "2px solid var(--primary)",
          },
        }
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      // More detailed error message
      const errorMessage = error.text
        ? `Failed to send message: ${error.text}`
        : "Failed to send message. Please try again or contact me directly via WhatsApp.";

      toast.error(errorMessage, {
        duration: 7000,
        position: "bottom-right",
        style: {
          background: "var(--bg-light)",
          color: "var(--text-primary)",
          border: "2px solid #ef4444",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-[var(--bg-light)] backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[var(--primary)]/20"
    >
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
          <FaUser className="text-[var(--primary)]" />
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--primary)]/20 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          placeholder="Your name"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
          <FaEnvelope className="text-[var(--primary)]" />
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--primary)]/20 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          placeholder="your.email@example.com"
        />
      </div>

      {/* Purpose Field (Custom Dropdown) */}
      <div className="space-y-2 relative z-50">
        <label className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
          <FaCommentAlt className="text-[var(--primary)]" />
          Purpose
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--primary)]/20 rounded-lg text-[var(--text-primary)] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-left"
          >
            {formData.subject}
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-2 bg-[var(--bg-card)] border border-[var(--primary)]/20 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar"
              >
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-white cursor-pointer transition-colors"
                  >
                    {option}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
          <FaCommentAlt className="text-[var(--primary)]" />
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--primary)]/20 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
          placeholder="Tell me about your project or inquiry..."
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <FaPaperPlane />
            Send Message
          </>
        )}
      </motion.button>

      {/* Note */}
      <p className="text-sm text-[var(--text-secondary)] text-center">
        I typically respond within 24-48 hours. For urgent matters, feel free to contact me via{" "}
        <a
          href="https://wa.me/6285155343380"
          className="text-[var(--primary)] hover:underline font-medium"
        >
          WhatsApp
        </a>
        .
      </p>
    </motion.form>
  );
};

export default ContactForm;
