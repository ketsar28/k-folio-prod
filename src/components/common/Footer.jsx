import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { FaHeart, FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SiHuggingface, SiStreamlit, SiReact, SiTailwindcss, SiVite } from "react-icons/si";
import { socialLinks, contactInfo } from "../../data/socialLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: "About", to: "about" },
      { name: "Experience", to: "experience" },
      { name: "Projects", to: "project" },
      { name: "Blog", to: "blog" },
      { name: "Testimonials", to: "testimonials" },
      { name: "Contact", to: "contact" },
    ],
    social: [
      { name: "GitHub", url: "https://github.com/ketsar28/", icon: FaGithub },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/ketsarali/", icon: FaLinkedin },
      { name: "Instagram", url: "https://www.instagram.com/ketsar.aaw/", icon: FaInstagram },
      { name: "HuggingFace", url: "https://huggingface.co/ketsar", icon: SiHuggingface },
      { name: "Streamlit", url: "https://share.streamlit.io/user/ketsar28", icon: SiStreamlit },
    ],
    contact: [
      { name: contactInfo.email, icon: FaEnvelope, href: `mailto:${contactInfo.email}` },
      {
        name: "WhatsApp",
        icon: FaWhatsapp,
        href: `https://api.whatsapp.com/send/?phone=${contactInfo.whatsapp.number}&text=${contactInfo.whatsapp.message}`,
      },
      { name: contactInfo.location, icon: FaMapMarkerAlt, href: "#" },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-[var(--bg-dark)] to-[var(--bg-light)] border-t border-[var(--primary)]/20">
      {/* Animated Gradient Divider */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-gradient-x" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {/* About Me Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Muhammad Ketsar</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Data Scientist specializing in Machine Learning and Optimization. Transforming data into
              actionable business strategies and high-impact solutions.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="https://github.com/ketsar28/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <FaGithub className="text-xl" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/ketsarali/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/ketsar.aaw/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={800}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-4 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Social Media</h3>
            <ul className="space-y-2">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-3 group"
                    >
                      <Icon className="text-lg group-hover:scale-110 transition-transform" />
                      {social.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Contact</h3>
            <ul className="space-y-2">
              {footerLinks.contact.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.name}>
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-3 group"
                    >
                      <Icon className="text-lg group-hover:scale-110 transition-transform" />
                      <span className="truncate">{contact.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          {/* Copyright */}
          <p className="text-sm text-[var(--text-secondary)]">
            © {currentYear} Muhammad Ketsar Ali Abi Wahid. All rights reserved.
          </p>

          {/* Built With */}
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>Built with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>using</span>
            <div className="flex items-center gap-2">
              <SiReact className="text-[#61DAFB]" title="React.js" />
              <span>React.js,</span>
              <SiTailwindcss className="text-[#06B6D4]" title="Tailwind CSS" />
              <span>Tailwind CSS &</span>
              <SiVite className="text-[#646CFF]" title="Vite" />
              <span>Vite</span>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-[var(--text-secondary)]">
            Deployed on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline font-medium"
            >
              Vercel
            </a>
          </p>
        </motion.div>
      </div>

      {/* Gradient animation styles */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
