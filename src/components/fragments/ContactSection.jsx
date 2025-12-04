import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    purpose: "Collab",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateMessage = () => {
    return `Halo Mas Ketsar,

Perkenalkan saya ${formData.user_name || "[Nama Saya]"}.
Saya menghubungi Anda untuk keperluan: ${formData.purpose}.

Detail Pesan:
${formData.message}

Email saya: ${formData.user_email}

Terima kasih.

---
*Pesan ini dikirim melalui Website Portfolio Anda (k-folio)*`;
  };

  const handleWhatsApp = () => {
    if (!formData.user_name || !formData.message) {
      toast.error("Mohon isi Nama dan Pesan terlebih dahulu.");
      return;
    }
    
    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send/?phone=6285155343380&text=${encodedMessage}`;
    
    window.open(waUrl, "_blank");
    toast.success("Membuka WhatsApp...");
  };

  const handleEmail = () => {
    if (!formData.user_name || !formData.message) {
      toast.error("Mohon isi Nama dan Pesan terlebih dahulu.");
      return;
    }

    const subject = `[Portfolio Contact] - ${formData.purpose} from ${formData.user_name}`;
    const body = generateMessage();
    const mailtoUrl = `mailto:muhammadketsar2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    toast.success("Membuka Email Client...");
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
              className="flex items-center gap-6 p-6 rounded-2xl glass-premium hover:bg-[var(--bg-card)] transition-all group"
              data-cursor-text="Chat on WA"
            >
              <div className="p-4 rounded-full bg-green-500/10 text-green-500 text-2xl group-hover:scale-110 transition-transform">
                <FaWhatsapp />
              </div>
              <div>
                <h4 className="text-xl font-bold">WhatsApp</h4>
                <p className="text-[var(--text-secondary)]">+62 851-5534-3380</p>
              </div>
            </a>

            <a
              href="mailto:muhammadketsar2@gmail.com"
              className="flex items-center gap-6 p-6 rounded-2xl glass-premium hover:bg-[var(--bg-card)] transition-all group"
              data-cursor-text="Send Email"
            >
              <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 text-2xl group-hover:scale-110 transition-transform">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="text-xl font-bold">Email</h4>
                <p className="text-[var(--text-secondary)]">muhammadketsar2@gmail.com</p>
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
                <label className="text-sm font-medium text-[var(--text-secondary)]">Nama Lengkap</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
                  placeholder="Nama Anda"
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
                  placeholder="email@contoh.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Keperluan / Purpose</label>
                <div className="relative">
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Collab">Kolaborasi Proyek</option>
                    <option value="Hiring">Hiring / Penawaran Kerja</option>
                    <option value="Consultation">Konsultasi Data/AI</option>
                    <option value="Other">Lainnya</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Pesan Detail</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all resize-none"
                  placeholder="Tuliskan detail pesan Anda di sini..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                  data-cursor-text="Kirim WA"
                >
                  <FaWhatsapp className="text-xl" /> Kirim via WA
                </button>
                
                <button
                  onClick={handleEmail}
                  className="w-full py-3 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2"
                  data-cursor-text="Kirim Email"
                >
                  <FaEnvelope className="text-xl" /> Kirim via Email
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
