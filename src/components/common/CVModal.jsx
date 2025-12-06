import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaTimes, FaDownload, FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaGlobe } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";

// eslint-disable-next-line react/prop-types
const CVModal = ({ isOpen, onClose }) => {
  const componentRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  const generatePdf = async () => {
    if (!componentRef.current) return;
    setIsDownloading(true);

    try {
      // 1. Create a clone of the element to render it fully without scrollbars
      const element = componentRef.current;
      const clone = element.cloneNode(true);

      // 2. Style the clone to ensure full visibility and correct width for A4-like ratio
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      clone.style.width = "794px"; // Standard A4 width at 96 DPI
      clone.style.height = "auto";
      clone.style.overflow = "visible";
      clone.style.maxHeight = "none";
      
      // Remove any dark mode classes from clone if needed, or ensure white bg
      clone.classList.remove("dark:bg-slate-900");
      clone.style.backgroundColor = "#ffffff";
      clone.style.color = "#0f172a"; // slate-900

      document.body.appendChild(clone);

      // 3. Capture the clone
      const canvas = await html2canvas(clone, {
        scale: 2, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794 // Match the clone width
      });

      // 4. Clean up the clone
      document.body.removeChild(clone);

      // 5. Generate PDF with custom page size matching the content
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create PDF with exact dimensions of the canvas (in points or pixels)
      // orientation: p, unit: px, format: [width, height]
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("CV_Muhammad_Ketsar_Ali_Abi_Wahid.pdf");

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl my-8 scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Actions */}
          <div className="absolute top-0 right-0 p-4 flex gap-2 z-50">
            <button
              type="button"
              onClick={generatePdf}
              disabled={isDownloading}
              className="p-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-lg flex items-center gap-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Download CV as PDF"
            >
              <FaDownload /> 
              <span className="hidden sm:inline">
                {isDownloading ? "Generating..." : "Download PDF"}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Printable Content */}
          <div ref={componentRef} className="p-8 md:p-12 bg-white text-slate-900">
            {/* Header */}
            <header className="border-b-2 border-slate-200 pb-8 mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Muhammad Ketsar Ali Abi Wahid</h1>
              <h2 className="text-xl md:text-2xl text-[var(--primary)] font-semibold mb-6">Data Scientist & AI Enthusiast</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[var(--primary)]" />
                  <span>Jl. KH. Abdul Karim, Pabuaran, Bojonggede, Kab. Bogor</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-[var(--primary)]" />
                  <span>muhammadketsar2@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="text-[var(--primary)]" />
                  <span>+62 851-5534-3380</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-[var(--primary)]" />
                  <span>ketsarali.netlify.app</span>
                </div>
              </div>

              {/* Social Links (Print Friendly) */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                <a href="https://github.com/ketsar28/" className="flex items-center gap-1 hover:text-[var(--primary)] text-slate-600"><FaGithub /> github.com/ketsar28</a>
                <a href="https://www.linkedin.com/in/ketsarali/" className="flex items-center gap-1 hover:text-[var(--primary)] text-slate-600"><FaLinkedin /> linkedin.com/in/ketsarali</a>
                <a href="https://huggingface.co/ketsar" className="flex items-center gap-1 hover:text-[var(--primary)] text-slate-600"><SiHuggingface /> huggingface.co/ketsar</a>
              </div>
            </header>

            {/* Professional Summary */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Professional Summary</h3>
              <p className="text-slate-700 leading-relaxed text-justify">
                Dedicated IT professional transitioning into Data Science and AI, leveraging a strong background in Quality Assurance and Software Engineering. Experienced in building machine learning models and optimizing algorithms (GA/PSO). My QA foundation ensures a rigorous approach to model validation and data integrity, while my development skills enable seamless integration of AI solutions into production environments.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Experience & Projects */}
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Experience</h3>
                  
                  {/* Experience Item 1 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800">Data Scientist</h4>
                      <span className="text-sm text-slate-500 font-medium">Jul 2025 - Present</span>
                    </div>
                    <p className="text-[var(--primary)] font-medium text-sm mb-2">PT. Epam Digital Mandiri</p>
                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                      <li>Executed large-scale data preprocessing and cleaning, including missing data imputation (numeric & categorical), multivariate imputation, outlier handling, discretization, feature scaling, and feature selection to ensure high-quality datasets for analysis.</li>
                      <li>Designed and evaluated regression and classification models with cross-validation, and developed clustering models for customer segmentation and behavioral analysis.</li>
                      <li>Implemented deep learning models for complex data processing and performed time-series forecasting to predict business trends and operational demands.</li>
                      <li>Deployed machine learning models to production environments, ensuring seamless integration with company systems and usability across teams.</li>
                      <li>Analyzed production expectations for the Kuwait Petroleum Corporation (KPC) project, visualizing monthly predictions based on well status, decline rates, and expected oil gain/restore (BOPD).</li>
                      <li>Calculated cumulative monthly BOPD, analyzed new vs. old well contributions, and assessed production loss ratios to optimize field targets.</li>
                    </ul>
                  </div>

                  {/* Experience Item 2 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800">QA Manual Tester</h4>
                      <span className="text-sm text-slate-500 font-medium">Jul 2024 - Mei 2025</span>
                    </div>
                    <p className="text-[var(--primary)] font-medium text-sm mb-2">Green Technology</p>
                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                      <li>Gained in-depth knowledge of QA principles, Software Development Life Cycle (SDLC), and various testing methodologies.</li>
                      <li>Conducted thorough manual testing on sample projects, focusing on meticulous bug detection and detailed bug reporting.</li>
                      <li>Performed comprehensive API testing using Postman to ensure functionality, reliability, and performance of APIs.</li>
                      <li>Executed web application testing across multiple browsers and devices to ensure compatibility and responsiveness.</li>
                      <li>Conducted mobile application testing on Android platforms to ensure optimal performance and user experience.</li>
                      <li>Developed detailed test cases, test plans, and test scripts to ensure thorough coverage of all application functionalities.</li>
                      <li>Used bug tracking tools to document, track, and manage defects found during testing processes.</li>
                    </ul>
                  </div>

                  {/* Experience Item 3 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800">QA Automation Tester</h4>
                      <span className="text-sm text-slate-500 font-medium">Sep 2023 - Jan 2024</span>
                    </div>
                    <p className="text-[var(--primary)] font-medium text-sm mb-2">PT. Enigma Cipta Humanika</p>
                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                      <li>Created and executed detailed automated test cases using Katalon Studio to ensure software stability.</li>
                      <li>Performed comprehensive API testing using Postman, validating endpoints, response codes, and data integrity.</li>
                      <li>Developed, tested, and maintained automation scripts for various test scenarios.</li>
                      <li>Conducted automation testing on internal company projects to improve efficiency.</li>
                      <li>Documented and tracked bugs systematically to ensure timely resolution.</li>
                    </ul>
                  </div>

                  {/* Experience Item 4 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800">Java Talent</h4>
                      <span className="text-sm text-slate-500 font-medium">Apr - Agu 2023</span>
                    </div>
                    <p className="text-[var(--primary)] font-medium text-sm mb-2">PT. Enigma Cipta Humanika</p>
                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                      <li>Developed RESTful APIs based on provided specifications using Java Spring Boot.</li>
                      <li>Implemented unit testing using JUnit 5 and Mockito for Java Spring Boot projects.</li>
                      <li>Collaborated effectively with teams on projects using GitHub and GitLab version control.</li>
                      <li>Applied SOLID design principles and Design Patterns (Singleton, Builder, Factory) to API development.</li>
                      <li>Utilized relational databases and implemented application security using Spring Security.</li>
                      <li>Acquired a deep understanding of Dependency Injection and Inversion of Control (IoC).</li>
                      <li>Managed project dependencies using Maven or Gradle build tools.</li>
                    </ul>
                  </div>

                  {/* Experience Item 5 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-800">Frontend Web Developer</h4>
                      <span className="text-sm text-slate-500 font-medium">Sep - Nov 2022</span>
                    </div>
                    <p className="text-[var(--primary)] font-medium text-sm mb-2">Persatuan Wartawan Indonesia</p>
                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                      <li>Developed web page interfaces for Persatuan Wartawan Indonesia (PWI) using HTML, SCSS, and Bootstrap.</li>
                      <li>Conducted testing and quality assurance for the developed web page interfaces to ensure optimal user experience.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Education</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-lg font-bold text-slate-800">Asia Cyber University</h4>
                      <span className="text-sm text-slate-500">2023 - 2027</span>
                    </div>
                    <p className="text-slate-700">Bachelor of Computer Science</p>
                    <p className="text-sm text-[var(--primary)] font-medium">GPA: 4.00 / 4.00</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-lg font-bold text-slate-800">SMK Al-Basyariah</h4>
                      <span className="text-sm text-slate-500">2020 - 2023</span>
                    </div>
                    <p className="text-slate-700">Software Engineering</p>
                    <p className="text-sm text-[var(--primary)] font-medium">Final Score: 90.00</p>
                  </div>
                </section>
              </div>

              {/* Right Column: Skills */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Technical Skills</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Data Science & AI</h5>
                      <div className="flex flex-wrap gap-2">
                        {["Python", "Machine Learning", "Deep Learning", "Optimization (GA/PSO)", "JupyterLab", "Google Colab", "Hugging Face"].map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Development</h5>
                      <div className="flex flex-wrap gap-2">
                        {["Java", "Spring Boot", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Streamlit", "MySQL", "PostgreSQL"].map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Tools & QA</h5>
                      <div className="flex flex-wrap gap-2">
                        {["Git/GitHub", "Docker", "Postman API", "Katalon Studio", "Jira", "Trello", "Figma", "Canva"].map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Languages</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex justify-between"><span>Indonesian</span> <span className="font-medium text-slate-900">Native</span></li>
                    <li className="flex justify-between"><span>English</span> <span className="font-medium text-slate-900">Intermediate</span></li>
                  </ul>
                </section>
              </div>
            </div>
            
            {/* Footer for Print */}
            <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 hidden print:block">
              <p>© {new Date().getFullYear()} Ketsar Ali. Generated from ketsar-ali.vercel.app</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CVModal;
