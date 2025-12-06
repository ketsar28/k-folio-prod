import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    purpose: "General Inquiry",
    message: "",
  });
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (option) => {
    setFormData({ ...formData, purpose: option });
    setIsDropdownOpen(false);
  };

  const generateMessage = () => {
    return `Hi Ketsar,

My name is ${formData.user_name || "[Name]"}.
I am contacting you regarding: ${formData.purpose}.

Message Detail:
${formData.message}

My Email: ${formData.user_email}

Thank you.

--
Sent from Ketsar Ali Website`;
  };

  const handleWhatsApp = () => {
    if (!formData.user_name || !formData.message) {
      toast.error("Please fill in your Name and Message first.");
      return;
    }
    
    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send/?phone=6285155343380&text=${encodedMessage}`;
    
    window.open(waUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleEmail = () => {
    if (!formData.user_name || !formData.message) {
      toast.error("Please fill in your Name and Message first.");
      return;
    }

    const subject = `[Website Contact] - ${formData.purpose} from ${formData.user_name}`;
    const body = generateMessage();
    const mailtoUrl = `mailto:muhammadketsar2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    toast.success("Opening Email Client...");
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Let's Connect</h2>
            <div className="w-20 h-1 bg-[var(--primary)] rounded-full" />
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Interested in collaborating or hiring me for your next project? 
              I'm always open to discussing new opportunities and innovative ideas.
            </p>
          </div>

          <div className="space-y-6">
            <a
              href="https://api.whatsapp.com/send/?phone=6285155343380&text=Hi%20Ketsar!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl glass-premium hover:bg-[var(--bg-card)] transition-all group"
              data-cursor-text="Chat on WA"
            >
              <div className="p-3 sm:p-4 rounded-full bg-green-500/10 text-green-500 text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                <FaWhatsapp />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-lg sm:text-xl font-bold">WhatsApp</h4>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] truncate">+62 851-5534-3380</p>
              </div>
            </a>

            <a
              href="mailto:muhammadketsar2@gmail.com"
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl glass-premium hover:bg-[var(--bg-card)] transition-all group"
              data-cursor-text="Send Email"
            >
              <div className="p-3 sm:p-4 rounded-full bg-blue-500/10 text-blue-500 text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                <FaEnvelope />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-lg sm:text-xl font-bold">Email</h4>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] truncate">muhammadketsar2@gmail.com</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="glass-card p-8 relative z-10">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Name</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Purpose</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all text-left"
                  >
                    {formData.purpose}
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
                        className="absolute w-full mt-2 bg-[var(--bg-card)] border border-[var(--primary)]/20 rounded-xl shadow-xl overflow-hidden z-[50] max-h-60 overflow-y-auto custom-scrollbar"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                  data-cursor-text="Send WA"
                >
                  <FaWhatsapp className="text-xl" /> WhatsApp
                </button>
                
                <button
                  onClick={handleEmail}
                  className="w-full py-3 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2"
                  data-cursor-text="Send Email"
                >
                  <FaEnvelope className="text-xl" /> Email
                </button>
              </div>
            </form>
          </div>
          
          {/* Decorative Blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)] rounded-full blur-[60px] opacity-20" />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
