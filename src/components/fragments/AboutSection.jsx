import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaDatabase, FaTools, FaLaptopCode } from "react-icons/fa";

const AboutSection = () => {
  const skills = [
    "Python", "Machine Learning", "Deep Learning", "Optimization", "Docker", 
    "Streamlit", "Data Version Control", "FastAPI", "MLflow", "Manual Testing", 
    "Postman API", "Katalon Studio", "Selenium", "HTML/CSS", "JavaScript", 
    "Java", "Spring Boot", "MySQL"
  ];

  const experience = [
    {
      role: "Data Scientist",
      company: "PT. Epam Digital Mandiri",
      period: "Jul 2025 - Present",
      desc: "Developed end-to-end machine learning solutions, including large-scale data preprocessing, model design, evaluation, and production deployment."
    },
    {
      role: "QA Manual Tester",
      company: "Green Technology",
      period: "Jul 2024 - Mei 2025",
      desc: "Designed and executed test cases to identify bugs, sharpening analytical skills and attention to detail for data and model quality."
    },
    {
      role: "QA Talent",
      company: "Green Technology",
      period: "Jan - Jun 2024",
      desc: "Acquired QA methodology skills, performed testing procedures, and collaborated with developers to ensure product quality."
    },
    {
      role: "QA Automation Tester",
      company: "PT. Enigma Cipta Humanika",
      period: "Sep 2023 - Jan 2024",
      desc: "Developed robust automation scripts, conducted comprehensive testing, and documented bugs using Jira."
    },
    {
      role: "Java Talent",
      company: "PT. Enigma Cipta Humanika",
      period: "Apr - Agu 2023",
      desc: "Studied Java programming and Spring Boot, building a solid foundation in backend architecture."
    },
    {
      role: "Frontend Web Developer",
      company: "Persatuan Wartawan Indonesia",
      period: "Sep - Nov 2022",
      desc: "Collaborated on UI enhancements for digital platforms using HTML, CSS, and JavaScript."
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="space-y-20">
        {/* Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 rounded-full glass-premium text-sm font-medium text-[var(--primary)] mb-2">
              About Me
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Bridging the Gap Between <span className="text-gradient">Data</span> and <span className="text-gradient">Impact</span>
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-lg leading-relaxed">
              <p>
                As a Data Scientist specializing in Machine Learning and Optimization, I focus on translating complex business problems into high-impact, data-driven solutions. My passion lies in moving beyond mere prediction to discover the most efficient and robust outcomes through mathematical optimization techniques.
              </p>
              <p>
                My journey began in Quality Assurance (QA), where I cultivated a keen analytical mindset and meticulous attention to detail. This foundation gives me a unique advantage in model validation, ensuring data integrity, and anticipating edge cases—all critical for building trustworthy machine learning models.
              </p>
              <p>
                Complemented by hands-on experience in web and API development, I not only build predictive models but also understand the architecture required to integrate them into production systems effectively.
              </p>
            </div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaTools className="text-[var(--primary)]" /> Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--glass-border)] text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold">Professional Journey</h3>
            <div className="w-20 h-1 bg-[var(--primary)] rounded-full mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-premium p-6 rounded-xl hover:bg-[var(--bg-card)] transition-all group border-l-4 border-l-[var(--primary)]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold group-hover:text-[var(--primary)] transition-colors">
                    {exp.role}
                  </h4>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--primary)]/10 text-[var(--primary)] whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                  {exp.company}
                </p>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {exp.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
