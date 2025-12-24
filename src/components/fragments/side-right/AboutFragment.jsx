/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { aboutData } from "../../../data/side-right/detail";
import { Element } from "react-scroll";

const AboutFragment = () => {
  return (
    <Element className="min-h-screen flex items-center" id="about" name="about">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          About Me
        </h2>

        <div className="space-y-6">
          {aboutData.paragraph.length > 0 &&
            aboutData.paragraph.map((item, index) => (
              <p
                key={index}
                className="text-lg text-justify text-[var(--text-secondary)] leading-relaxed"
              >
                {item}
              </p>
            ))}
        </div>

        {/* Skills Section */}
        <div className="pt-8">
          <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Python",
              "Machine Learning",
              "Deep Learning",
              "Optimization",
              "Docker",
              "Streamlit",
              "Data Version Control",
              "FastAPI",
              "MLflow",
              "Manual Testing",
              "Postman API",
              "Katalon Studio",
              "Selenium",
              "HTML/CSS",
              "JavaScript",
              "Java",
              "Spring Boot",
              "MySQL",
            ].map((skill, index) => (
              <motion.div
                key={index}
                className="card bg-[var(--bg-light)] p-3 text-center rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-[var(--text-secondary)]">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Element>
  );
};

export default AboutFragment;
