import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import ContactForm from "../../common/ContactForm";
import SocialLinks from "../../common/SocialLinks";
import { contactInfo } from "../../../data/socialLinks";

const ContactFragment = () => {
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${contactInfo.whatsapp.number}&text=${contactInfo.whatsapp.message}`;

  return (
    <Element className="min-h-screen flex items-center py-20" id="contact" name="contact">
      <div className="w-full space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Get In Touch
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                Contact Information
              </h3>

              {/* Email */}
              <motion.a
                href={`mailto:${contactInfo.email}`}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-6 bg-[var(--bg-light)] backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl border border-[var(--primary)]/20 transition-all group"
              >
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white">
                  <FaEnvelope className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Email</p>
                  <p className="text-[var(--text-primary)] font-semibold group-hover:text-[var(--primary)] transition-colors">
                    {contactInfo.email}
                  </p>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-6 bg-[var(--bg-light)] backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl border border-[var(--primary)]/20 transition-all group"
              >
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">WhatsApp</p>
                  <p className="text-[var(--text-primary)] font-semibold group-hover:text-[var(--primary)] transition-colors">
                    Chat with me instantly
                  </p>
                </div>
              </motion.a>

              {/* Location */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-6 bg-[var(--bg-light)] backdrop-blur-lg rounded-xl shadow-lg border border-[var(--primary)]/20"
              >
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-white">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Location</p>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {contactInfo.location}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                Connect With Me
              </h3>
              <div className="bg-[var(--bg-light)] backdrop-blur-lg rounded-xl p-8 shadow-lg border border-[var(--primary)]/20">
                <SocialLinks orientation="horizontal" />
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-500/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="text-green-700 dark:text-green-300 font-semibold">
                  Available for Freelance
                </p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                I'm currently available for new projects and collaborations. Let's create something
                amazing together!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Element>
  );
};

export default ContactFragment;
