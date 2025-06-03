/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { aboutData } from "../../../data/side-right/detail";
import { Element } from "react-scroll";

const AboutFragment = () => {
  return (
    <Element className="min-h-screen flex items-center" id="about" name="about">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold text-[var(--text-primary)] mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          About Me
        </motion.h2>

        <div className="space-y-6">
          {aboutData.paragraph.length > 0 &&
            aboutData.paragraph.map((item, index) => (
              <motion.p
                key={index}
                className="text-lg text-justify text-[var(--text-secondary)] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                {item}
              </motion.p>
            ))}
        </div>

        {/* Skills Section */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Web Development",
              "React.js",
              "JavaScript",
              "Java",
              "Quality Assurance",
              "Manual Testing",
              "Automation Testing",
              "Selenium",
              "API Testing",
              "Data Analysis",
              "Statistics",
              "R",
              "Python",
              "Machine Learning",
              "Deep Learning",
            ].map((skill, index) => (
              <motion.div
                key={index}
                className="card bg-[var(--bg-light)] p-3 text-center rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-[var(--text-secondary)]">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Element>
  );
};

export default AboutFragment;
