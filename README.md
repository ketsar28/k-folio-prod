# 🚀 K-Folio - Professional Data Science Portfolio

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Portfolio-Muhammad%20Ketsar%20Ali%20Abi%20Wahid-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**A cutting-edge portfolio website showcasing Data Science, Machine Learning, and Optimization projects**

[🌐 Live Demo](https://k-folio-prod.vercel.app/) • [📧 Email](mailto:muhammadketsar45@gmail.com) • [💼 LinkedIn](https://www.linkedin.com/in/ketsarali/)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Build & Deployment](#️-build--deployment)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Connect With Me](#-connect-with-me)
- [License](#-license)
- [Copyright](#-copyright)

---

## 🎯 About

**K-Folio** is a modern, high-class portfolio website meticulously crafted to showcase professional expertise in **Data Science**, **Machine Learning**, **Deep Learning**, and **Optimization**. Built with cutting-edge technologies and featuring a stunning user interface, this portfolio demonstrates both technical prowess and design excellence.

### 👨‍💻 About the Developer

**Muhammad Ketsar Ali Abi Wahid**
- 🎓 **Data Scientist** @ PT. Epam Digital Mandiri
- 🔬 Specializing in **Machine Learning**, **Deep Learning** & **Optimization Algorithms**
- 🌍 Based in **Jakarta, Indonesia**
- 💼 **2+ years** of professional experience in Data Science & Quality Assurance
- 🎯 Passionate about leveraging data to drive insights and innovation

### 🎨 Design Philosophy

This portfolio embodies a perfect blend of aesthetics and functionality:
- **Modern glassmorphism** UI design for a premium feel
- **Smooth animations** powered by Framer Motion
- **Fully responsive** across all devices and screen sizes
- **Accessibility-first** approach for inclusive user experience
- **Performance-optimized** with 90+ Lighthouse score

---

## ✨ Features

### 🎨 **Visual & Design Excellence**
- ✅ **Custom Animated Cursor** with dynamic glow effects
- ✅ **Gradient Mesh Background** with smooth transitions
- ✅ **Glassmorphism UI Components** for modern aesthetic
- ✅ **3D Card Hover Effects** with tilt animations
- ✅ **Smooth Page Transitions** using Framer Motion
- ✅ **Scroll-Triggered Animations** for engaging UX
- ✅ **Fully Responsive Design** (mobile-first approach)

### 🎵 **Interactive Features**
- ✅ **Background Music Player** with playback controls
- ✅ **Scroll Progress Indicator** for navigation awareness
- ✅ **Back to Top Button** for easy navigation
- ✅ **Toast Notifications** for user feedback
- ✅ **Triple Theme Mode** (Light/Dark/System preference)
- ✅ **Animated Social Media Icons** with hover effects

### 📄 **Content Sections**
- ✅ **About Me** - Professional bio with comprehensive skills showcase
- ✅ **Experience** - Work history with interactive timeline
- ✅ **Projects** - 16+ featured projects across Data Science, ML, QA, and Web Development
- ✅ **Blog** - Data Science & ML articles with search and filter functionality
- ✅ **Testimonials** - Client feedback with carousel slider
- ✅ **Contact** - Integrated contact form with dual email system (notification + auto-reply)
- ✅ **Footer** - Comprehensive footer with navigation and social links

### 🔧 **Technical Features**
- ✅ **SEO Optimized** with dynamic meta tags
- ✅ **Performance Optimized** (90+ Lighthouse score)
- ✅ **WhatsApp Integration** for direct messaging
- ✅ **EmailJS Integration** for contact form functionality
- ✅ **Giscus Comments** for blog engagement
- ✅ **LocalStorage Persistence** for theme preferences
- ✅ **Error Boundaries** for graceful error handling

---

## 🛠️ Tech Stack

### **Frontend Framework**
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

### **Core Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library for building interactive interfaces |
| **Vite** | 7.2.2 | Lightning-fast build tool and dev server |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **React Router DOM** | 6.25.1 | Client-side routing and navigation |

### **UI & Animation Libraries**
| Library | Version | Purpose |
|---------|---------|---------|
| **Framer Motion** | 11.0.8 | Advanced animations and transitions |
| **React Type Animation** | 3.2.0 | Typing animation effects |
| **React Scroll** | 1.9.0 | Smooth scroll navigation |
| **React Icons** | 5.5.0 | Comprehensive icon library |

### **Integration & Features**
| Package | Version | Purpose |
|---------|---------|---------|
| **@emailjs/browser** | 4.4.1 | Email service integration |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **React Helmet Async** | 2.0.5 | SEO meta tags management |
| **@giscus/react** | 3.1.0 | GitHub discussions-based comments |

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and transformations
- **Autoprefixer** - Automatic vendor prefixing
- **PropTypes** - Runtime type checking for React props

### **Deployment & Hosting**
- **Vercel** - Cloud platform for static sites and serverless functions
- **Git** - Version control system
- **GitHub** - Code repository and collaboration

---

## 📁 Project Structure

```
k-folio/
├── public/                          # Static assets
│   ├── images/                      # Image files (logos, photos, etc.)
│   └── music/                       # Background music files
│
├── src/
│   ├── assets/                      # Dynamic assets
│   │   └── images/                  # Component-specific images
│   │
│   ├── components/
│   │   ├── common/                  # Reusable UI components
│   │   │   ├── AnimatedBackground.jsx    # Animated gradient mesh
│   │   │   ├── BackToTop.jsx            # Scroll to top button
│   │   │   ├── ContactForm.jsx          # EmailJS contact form
│   │   │   ├── CustomCursor.jsx         # Animated cursor effect
│   │   │   ├── Footer.jsx               # Site footer
│   │   │   ├── MusicPlayer.jsx          # Background music player
│   │   │   ├── ScrollProgress.jsx       # Scroll progress bar
│   │   │   ├── SEOHelmet.jsx            # SEO meta tags
│   │   │   └── SocialLinks.jsx          # Social media icons
│   │   │
│   │   ├── fragments/
│   │   │   ├── side-left/           # Sidebar components (sticky)
│   │   │   │   ├── HeadFragment.jsx      # Profile section
│   │   │   │   └── NavigationFragment.jsx # Navigation menu
│   │   │   │
│   │   │   └── side-right/          # Main content sections
│   │   │       ├── AboutFragment.jsx         # About me section
│   │   │       ├── BlogFragment.jsx          # Blog articles
│   │   │       ├── ContactFragment.jsx       # Contact section
│   │   │       ├── ExperienceFragment.jsx    # Work experience
│   │   │       ├── ProjectFragment.jsx       # Portfolio projects
│   │   │       └── TestimonialsFragment.jsx  # Client testimonials
│   │   │
│   │   ├── layouts/                 # Layout components
│   │   │   ├── AppShell.jsx             # App wrapper component
│   │   │   └── HomeLayout.jsx           # Two-column main layout
│   │   │
│   │   ├── EnhancedThemeToggle.jsx  # Advanced theme toggle
│   │   └── ThemeToggle.jsx          # Simple theme toggle
│   │
│   ├── context/                     # React Context providers
│   │   ├── EnhancedThemeContext.jsx     # Theme management (Light/Dark/System)
│   │   └── ThemeContext.jsx             # Basic theme context
│   │
│   ├── data/                        # Content data files
│   │   ├── side-left/
│   │   │   ├── head.js              # Profile information
│   │   │   └── navigation.js        # Navigation menu items
│   │   │
│   │   ├── side-right/
│   │   │   ├── detail.js            # About section content
│   │   │   ├── experience.js        # Work experience data
│   │   │   ├── project.js           # Portfolio projects
│   │   │   └── footer.js            # Footer data
│   │   │
│   │   ├── blogArticles.js          # Blog posts (5 articles)
│   │   ├── socialLinks.js           # Social media links
│   │   └── testimonials.js          # Client testimonials
│   │
│   ├── pages/                       # Page components
│   │   ├── home/
│   │   │   └── HomePage.jsx         # Main homepage
│   │   └── error/
│   │       └── NotFoundPage.jsx     # 404 error page
│   │
│   ├── utils/                       # Utility functions
│   │   └── getAsset.js              # Asset path resolver
│   │
│   ├── App.jsx                      # Root application component
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Global styles & CSS variables
│
├── .gitignore                       # Git ignore rules
├── .eslintrc.cjs                    # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.js                   # Vite build configuration
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (v2.0.0 or higher) - [Download](https://git-scm.com/)

Check your installations:
```bash
node --version
npm --version
git --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ketsar28/k-folio.git
   cd k-folio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or using yarn
   yarn install
   ```

3. **Configure EmailJS (Optional but recommended)**

   To enable the contact form functionality:

   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Create an email service
   - Create two email templates (notification + auto-reply)
   - Update credentials in `src/components/common/ContactForm.jsx`:

   ```javascript
   const serviceId = "YOUR_SERVICE_ID";
   const templateId = "YOUR_TEMPLATE_ID";
   const publicKey = "YOUR_PUBLIC_KEY";
   ```

4. **Add Background Music (Optional)**

   Place your MP3 file in `/public/music/` directory:
   ```bash
   # Example: lofi-background.mp3, chill-vibes.mp3, etc.
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**

   Navigate to: `http://localhost:5173`

---

## 💻 Development

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

The development server will start at `http://localhost:5173` with Hot Module Replacement (HMR) enabled.

### Development Features

- ⚡ **Instant Hot Module Replacement (HMR)** - See changes in real-time
- 🔍 **ESLint Integration** - Automatic code quality checks
- 🎨 **Tailwind CSS JIT** - Just-in-time compilation for faster builds
- 📱 **Responsive Preview** - Test across all device sizes
- 🐛 **Source Maps** - Easy debugging in development mode

### Available Scripts

```json
{
  "dev": "vite",                    // Start development server (http://localhost:5173)
  "build": "vite build",            // Build for production (output: dist/)
  "preview": "vite preview",        // Preview production build locally
  "lint": "eslint . --ext js,jsx"   // Run ESLint for code quality
}
```

### Code Quality

Run linting before committing:
```bash
npm run lint
# or
yarn lint
```

---

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

This will:
- Create an optimized production build in the `dist/` folder
- Minify JavaScript and CSS
- Optimize images and assets
- Generate source maps
- Tree-shake unused code

### Preview Production Build Locally

```bash
npm run preview
# or
yarn preview
```

Visit: `http://localhost:4173`

### Deploy to Vercel (Recommended)

#### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

#### Method 2: Using Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings (auto-detected)
6. Click "Deploy"

#### Method 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ketsar28/k-folio)

### Environment Variables (Optional)

For enhanced security, use environment variables for EmailJS:

Create `.env` file in root:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Update `ContactForm.jsx`:
```javascript
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
```

Add environment variables in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add each variable with its value
- Redeploy

---

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css` to customize color scheme:

```css
:root {
  /* Light Mode Colors */
  --primary-light: #2563eb;      /* Primary brand color */
  --accent-light: #3b82f6;       /* Accent color */
  --text-primary: #1e293b;       /* Primary text */
  --text-secondary: #64748b;     /* Secondary text */
  --bg-light: #ffffff;           /* Background */

  /* Dark Mode Colors */
  --primary-dark: #60a5fa;       /* Primary brand color (dark) */
  --accent-dark: #3b82f6;        /* Accent color (dark) */
  --text-primary-dark: #f1f5f9;  /* Primary text (dark) */
  --text-secondary-dark: #cbd5e1; /* Secondary text (dark) */
  --bg-dark: #0f172a;            /* Background (dark) */
}
```

### Update Content

All content is centralized in data files for easy management:

| Content | File Path |
|---------|-----------|
| **Profile Info** | `src/data/side-left/head.js` |
| **Navigation Menu** | `src/data/side-left/navigation.js` |
| **About Section** | `src/data/side-right/detail.js` |
| **Work Experience** | `src/data/side-right/experience.js` |
| **Portfolio Projects** | `src/data/side-right/project.js` |
| **Blog Articles** | `src/data/blogArticles.js` |
| **Testimonials** | `src/data/testimonials.js` |
| **Social Media Links** | `src/data/socialLinks.js` |
| **Footer Content** | `src/data/side-right/footer.js` |

### Add New Project

Edit `src/data/side-right/project.js`:

```javascript
{
  id: 17,
  title: "Your Project Title",
  category: "Data Science", // or "Web Development", "QA Testing", "Design"
  description: "Brief description of your project",
  technologies: ["Python", "TensorFlow", "React"],
  githubLink: "https://github.com/username/repo",
  liveLink: "https://your-project.com",
  image: "/images/projects/your-project.jpg"
}
```

### Add New Blog Article

Edit `src/data/blogArticles.js`:

```javascript
{
  id: 6,
  title: "Your Article Title",
  category: "Machine Learning", // or "Data Science", "Deep Learning", etc.
  excerpt: "Brief summary of your article",
  date: "2025-01-15",
  readTime: "8 min read",
  image: "/images/blog/your-article.jpg",
  content: "Full article content here..."
}
```

### Add New Section

1. **Create component** in `src/components/fragments/side-right/`:
   ```javascript
   // YourNewSection.jsx
   export default function YourNewSection() {
     return (
       <section id="your-section" className="mb-16">
         <h2>Your Section Title</h2>
         {/* Your content */}
       </section>
     );
   }
   ```

2. **Import in HomeLayout** (`src/components/layouts/HomeLayout.jsx`):
   ```javascript
   import YourNewSection from '../fragments/side-right/YourNewSection';

   // Add in the right column
   <YourNewSection />
   ```

3. **Add to navigation** (`src/data/side-left/navigation.js`):
   ```javascript
   {
     id: 8,
     name: "Your Section",
     link: "your-section"
   }
   ```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Build fails with module errors

```bash
# Solution: Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or with yarn
rm -rf node_modules yarn.lock
yarn install
```

#### Issue: Custom cursor not appearing

**Possible causes:**
- Browser compatibility (custom cursors may not work on mobile devices)
- CSS not properly imported
- JavaScript disabled

**Solution:**
```javascript
// Check if CustomCursor is imported in App.jsx
import CustomCursor from './components/common/CustomCursor';
```

#### Issue: EmailJS not sending emails

**Checklist:**
- ✅ Verify service ID, template ID, and public key are correct
- ✅ Check EmailJS dashboard for quota limits (free tier: 200 emails/month)
- ✅ Ensure template ID matches the template in EmailJS dashboard
- ✅ Check browser console for error messages
- ✅ Verify email addresses are valid

**Solution:**
```javascript
// Test EmailJS connection
import emailjs from '@emailjs/browser';

emailjs.send(
  'service_id',
  'template_id',
  { test: 'Hello' },
  'public_key'
).then(
  (response) => console.log('SUCCESS!', response),
  (error) => console.log('FAILED...', error)
);
```

#### Issue: Theme not persisting after refresh

**Possible causes:**
- LocalStorage blocked or disabled
- Browser privacy mode
- JavaScript errors

**Solution:**
```javascript
// Check localStorage in browser console
localStorage.getItem('theme');

// Clear and reset
localStorage.clear();
// Refresh page
```

#### Issue: Images not loading

**Checklist:**
- ✅ Verify image paths are correct
- ✅ Check if images exist in `/public/images/` or `/src/assets/images/`
- ✅ Ensure file extensions match (case-sensitive on Linux)

**Solution:**
```javascript
// For public folder images
<img src="/images/your-image.jpg" />

// For src/assets images
import yourImage from '../assets/images/your-image.jpg';
<img src={yourImage} />
```

#### Issue: Slow performance or animations lagging

**Solutions:**
- Reduce number of animated elements
- Optimize images (use WebP format, compress)
- Enable production mode for testing
- Check browser DevTools → Performance tab

```bash
# Build and test production version
npm run build
npm run preview
```

---

## 🌐 Connect With Me

<div align="center">

### Let's collaborate and create something amazing!

[![GitHub](https://img.shields.io/badge/GitHub-ketsar28-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ketsar28/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ketsarali-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ketsarali/)
[![Instagram](https://img.shields.io/badge/Instagram-ketsar.aaw-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ketsar.aaw/)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-ketsar-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/ketsar)
[![Streamlit](https://img.shields.io/badge/Streamlit-ketsar28-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://share.streamlit.io/user/ketsar28)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Chat-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://api.whatsapp.com/send/?phone=6285155343380&text=Hi%20Ketsar!)

**📧 Email:** [muhammadketsar45@gmail.com](mailto:muhammadketsar45@gmail.com)

**🌐 Portfolio:** [https://k-folio-prod.vercel.app/](https://k-folio-prod.vercel.app/)

**📦 Repository:** [https://github.com/ketsar28/k-folio](https://github.com/ketsar28/k-folio)

</div>

---

## 📄 License

This project is licensed under the **MIT License**.

### MIT License

```
Copyright (c) 2025 Muhammad Ketsar Ali Abi Wahid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgments

Special thanks to:

- **React Team** - For the amazing React library
- **Vercel** - For free hosting and excellent deployment experience
- **Tailwind Labs** - For the Tailwind CSS framework
- **Framer** - For the incredible Framer Motion animation library
- **EmailJS** - For simple and effective email integration
- **React Icons** - For the comprehensive icon library
- **Design Inspiration** - [saumyachaturvedi.com](https://saumyachaturvedi.com/)

---

## 📊 Project Statistics

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/ketsar28/k-folio?style=flat-square&logo=github)
![GitHub language count](https://img.shields.io/github/languages/count/ketsar28/k-folio?style=flat-square&logo=code)
![GitHub top language](https://img.shields.io/github/languages/top/ketsar28/k-folio?style=flat-square&logo=javascript)
![GitHub last commit](https://img.shields.io/github/last-commit/ketsar28/k-folio?style=flat-square&logo=git)
![GitHub stars](https://img.shields.io/github/stars/ketsar28/k-folio?style=flat-square&logo=star)
![GitHub forks](https://img.shields.io/github/forks/ketsar28/k-folio?style=flat-square&logo=fork)

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/ketsar28/k-folio/issues).

### How to Contribute

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

<div align="center">

## ⭐ Star This Repository

**If you found this project helpful or interesting, please consider giving it a star!**

[![GitHub stars](https://img.shields.io/github/stars/ketsar28/k-folio?style=social)](https://github.com/ketsar28/k-folio/stargazers)

---

### 💙 Made with passion and dedication

**Built using React.js, Tailwind CSS, Framer Motion & Vite**

---

[⬆ Back to Top](#-k-folio---professional-data-science-portfolio)

</div>

---

## © Copyright

**Copyright © 2025 Muhammad Ketsar Ali Abi Wahid. All Rights Reserved.**

This portfolio website and all its contents, including but not limited to code, design, text, images, and graphics, are the intellectual property of **Muhammad Ketsar Ali Abi Wahid**.

### Usage Rights

- ✅ **Personal Use**: You may use this code as inspiration for your own portfolio
- ✅ **Educational Use**: You may study the code for learning purposes
- ✅ **Modification**: You may modify the code for your own projects
- ❌ **Direct Copying**: Please do not copy this portfolio directly and claim it as your own
- ❌ **Commercial Use**: Commercial use requires explicit permission

### Attribution

If you use significant portions of this code or design, please provide attribution:

```
Based on K-Folio by Muhammad Ketsar Ali Abi Wahid
Repository: https://github.com/ketsar28/k-folio
```

### Contact for Permissions

For commercial use, collaborations, or any questions regarding usage rights, please contact:
- **Email**: muhammadketsar45@gmail.com
- **LinkedIn**: [linkedin.com/in/ketsarali](https://www.linkedin.com/in/ketsarali/)

---

<div align="center">

**Crafted with ❤️ by [Muhammad Ketsar Ali Abi Wahid](https://github.com/ketsar28/)**

**© 2025 K-Folio. All Rights Reserved.**

</div>
