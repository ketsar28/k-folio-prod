import { useState } from "react";
import { motion } from "framer-motion";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration
      // Replace with your actual EmailJS credentials
      const serviceId = "YOUR_SERVICE_ID"; // Replace with your EmailJS service ID
      const templateId = "YOUR_TEMPLATE_ID"; // Replace with your EmailJS template ID
      const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your EmailJS public key

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: "Ketsar",
        },
        publicKey
      );

      toast.success("Message sent successfully! I'll get back to you soon.", {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "var(--bg-light)",
          color: "var(--text-primary)",
          border: "2px solid var(--primary)",
        },
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send message. Please try again or contact me directly.", {
        duration: 5000,
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

      {/* Subject Field */}
      <div className="space-y-2">
        <label htmlFor="subject" className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
          <FaCommentAlt className="text-[var(--primary)]" />
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--primary)]/20 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
        >
          <option>General Inquiry</option>
          <option>Project Collaboration</option>
          <option>Consultation Request</option>
          <option>Job Opportunity</option>
          <option>Data Science Discussion</option>
          <option>Other</option>
        </select>
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
