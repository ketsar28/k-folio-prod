import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiHuggingface, SiStreamlit } from "react-icons/si";
import profileImage from "../../assets/images/me.jpeg";

const HeroSection = () => {
  const socials = [
    { icon: <FaGithub />, href: "https://github.com/ketsar28/", color: "hover:text-gray-400" },
    { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/ketsarali/", color: "hover:text-blue-500" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/ketsar.aaw/", color: "hover:text-pink-500" },
    { icon: <SiHuggingface />, href: "https://huggingface.co/ketsar", color: "hover:text-yellow-400" },
    { icon: <SiStreamlit />, href: "https://share.streamlit.io/user/ketsar28", color: "hover:text-red-500" },
    { icon: <FaWhatsapp />, href: "https://api.whatsapp.com/send/?phone=6285155343380&text=Hi%20Ketsar!", color: "hover:text-green-500" },
  ];

  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center relative pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left order-2 lg:order-1"
        >
          <div className="inline-block px-4 py-2 rounded-full glass-premium text-sm font-medium text-[var(--accent)] mb-4">
            Available for Collaboration
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Hi, I'm <span className="text-gradient">Ketsar Ali</span>
          </h1>
          
          <div className="text-2xl lg:text-3xl font-medium text-[var(--text-secondary)] h-[80px] lg:h-[60px]">
            I am <br className="lg:hidden" />
            <TypeAnimation
              sequence={[
                "a Data Scientist",
                2000,
                "transforming data into insights",
                2000,
                "hunting bugs and ensuring quality",
                2000,
                "building robust ML models",
                2000,
                "optimizing business strategies",
                2000,
              ]}
              wrapper="span"
              speed={50}
              className="text-[var(--primary)] font-bold"
              repeat={Infinity}
            />
          </div>

          <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Transforming Data into Actionable Business Strategy and High-Impact Solutions.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 justify-center lg:justify-start pt-4 flex-wrap">
            {socials.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-full glass-premium text-xl transition-all duration-300 hover:scale-110 ${social.color}`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                data-cursor-text="Connect"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          <motion.div 
            className="pt-8 flex gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a 
              href="#contact" 
              className="px-8 py-3 rounded-full bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-lg hover:shadow-[var(--primary)]/50"
              data-cursor-text="Let's Talk"
            >
              Contact Me
            </a>
            <a 
              href="#portfolio" 
              className="px-8 py-3 rounded-full glass-premium text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-card)] transition-all"
              data-cursor-text="View Work"
            >
              View Portfolio
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image / 3D Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative order-1 lg:order-2 flex justify-center"
        >
          <div className="relative w-72 h-72 lg:w-96 lg:h-96">
            {/* Abstract Shapes behind */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] rounded-full blur-[80px] opacity-40 animate-pulse-glow" />
            
            {/* Profile Card / Image Placeholder */}
            <motion.div 
              className="w-full h-full relative overflow-hidden border-4 border-[var(--primary)]/30 shadow-2xl shadow-[var(--primary)]/20"
              style={{ 
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
              animate={{
                borderRadius: [
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                  "30% 60% 70% 40% / 50% 60% 30% 60%",
                  "60% 40% 30% 70% / 60% 30% 70% 40%"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
               <img 
                 src={profileImage} 
                 alt="Ketsar Ali" 
                 className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-700"
               />
               
               {/* Shine effect */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[var(--text-secondary)] flex justify-center p-1">
          <div className="w-1 h-2 bg-[var(--text-secondary)] rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
