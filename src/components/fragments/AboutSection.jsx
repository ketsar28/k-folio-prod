import { motion } from "framer-motion";
import { FaTools } from "react-icons/fa";

const AboutSection = () => {
  const skills = [
    "Python", "Machine Learning", "Deep Learning", "Optimization", "Docker", 
    "Streamlit", "Data Version Control", "FastAPI", "MLflow", "Manual Testing", 
    "Postman API", "Katalon Studio", "Selenium", "HTML/CSS", "JavaScript", 
    "Java", "Spring Boot", "MySQL"
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
                My journey began in Quality Assurance (QA), where I cultivated a keen analytical mindset and meticulous attention to detail. This foundation gives me a unique advantage in model validation, ensuring data integrity, and anticipating edge cases, which are all critical for building trustworthy machine learning models.
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

      </div>
    </section>
  );
};

export default AboutSection;
