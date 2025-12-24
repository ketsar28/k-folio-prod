import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiHuggingface, SiStreamlit } from "react-icons/si";
import { socialLinks, contactInfo } from "../../data/socialLinks";

const iconMap = {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  SiHuggingface,
  SiStreamlit,
};

const SocialLinks = ({ orientation = "horizontal" }) => {
  const isVertical = orientation === "vertical";

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
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${contactInfo.whatsapp.number}&text=${contactInfo.whatsapp.message}`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${
        isVertical ? "flex-col" : "flex-row flex-wrap"
      } gap-4 items-center justify-center`}
    >
      {socialLinks.map((social, index) => {
        const Icon = iconMap[social.icon];
        return (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
            whileTap={{ scale: 0.9 }}
            className="group relative p-4 bg-[var(--bg-light)] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, var(--bg-light) 0%, var(--bg-dark) 100%)`,
            }}
          >
            <Icon
              className="text-2xl text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors duration-300"
              style={{
                color: social.color,
              }}
            />

            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[var(--bg-light)] text-[var(--text-primary)] px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              {social.name}
            </span>

            {/* Glow effect */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl"
              style={{ background: social.color }}
            />
          </motion.a>
        );
      })}

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        variants={itemVariants}
        whileHover={{
          scale: 1.2,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 },
        }}
        whileTap={{ scale: 0.9 }}
        className="group relative p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <FaWhatsapp className="text-2xl text-white" />

        {/* Tooltip */}
        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[var(--bg-light)] text-[var(--text-primary)] px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
          WhatsApp
        </span>

        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl" />
      </motion.a>
    </motion.div>
  );
};

export default SocialLinks;
