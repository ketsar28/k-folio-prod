# 🚀 K-Folio - Modern Data Science Portfolio

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Portfolio-Muhammad%20Ketsar-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**A high-class, modern portfolio website showcasing Data Science & Machine Learning projects**

[🌐 Live Demo](https://k-folio-prod.vercel.app/) • [📧 Contact](mailto:muhammadketsar45@gmail.com) • [💼 LinkedIn](https://www.linkedin.com/in/ketsarali/)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contact](#-contact)
- [License](#-license)

---

## 🎯 About

**K-Folio** is a cutting-edge portfolio website designed to showcase my journey as a **Data Scientist** specializing in Machine Learning, Deep Learning, and Optimization. This portfolio features:

- 🎨 **Modern Design** with glassmorphism effects and smooth animations
- 🎵 **Interactive Features** including background music, custom cursor, and scroll effects
- 📝 **Blog Section** with Data Science & ML articles
- 💬 **Testimonials** from clients and colleagues
- 📧 **Contact Form** with EmailJS integration
- 🌓 **Triple Theme Mode** (Light/Dark/System)
- ♿ **Fully Accessible** and responsive across all devices

### 👤 Portfolio Owner

**Muhammad Ketsar Ali Abi Wahid**
- 🎓 Data Scientist @ PT. Epam Digital Mandiri
- 🔬 Specializing in ML, Deep Learning & Optimization
- 🌍 Based in Jakarta, Indonesia
- 💼 2+ years of experience in Data Science & QA

---

## ✨ Features

### 🎨 **Visual & Design**
- ✅ Custom animated cursor with glow effects
- ✅ Animated gradient mesh background
- ✅ Glassmorphism UI components
- ✅ 3D card hover effects with tilt
- ✅ Smooth page transitions
- ✅ Scroll-triggered animations
- ✅ Responsive design (mobile, tablet, desktop)

### 🎵 **Interactive Elements**
- ✅ Background music player with controls
- ✅ Scroll progress bar
- ✅ Back to top button
- ✅ Toast notifications
- ✅ Theme toggle (Light/Dark/System)
- ✅ Animated social media icons

### 📄 **Content Sections**
- ✅ **About Me** - Professional bio and skills
- ✅ **Experience** - Work history with timeline
- ✅ **Projects** - 16+ featured projects
- ✅ **Blog** - 5 Data Science articles with search & filter
- ✅ **Testimonials** - Client feedback slider
- ✅ **Contact** - Form with EmailJS integration

### 🔧 **Technical Features**
- ✅ SEO optimized with meta tags
- ✅ Performance optimized (90+ Lighthouse score)
- ✅ WhatsApp integration
- ✅ Social media links
- ✅ Email contact form
- ✅ Comprehensive footer

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

### **Libraries & Tools**
- **Framer Motion** (11.0.8) - Advanced animations
- **React Router DOM** (6.25.1) - Navigation
- **React Scroll** (1.9.0) - Smooth scrolling
- **React Icons** (5.x) - Icon library
- **React Hot Toast** (2.x) - Notifications
- **@emailjs/browser** (4.x) - Email functionality
- **React Helmet Async** (2.x) - SEO meta tags
- **@giscus/react** (3.x) - Comments system

### **Development**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### **Deployment**
- **Vercel** - Hosting & deployment
- **Git** - Version control
- **GitHub** - Repository hosting

---

## 📁 Project Structure

```
k-folio/
├── public/                      # Static assets
│   ├── images/                  # Image files
│   └── music/                   # Background music (optional)
│
├── src/
│   ├── assets/                  # Dynamic assets
│   │   └── images/              # Component images
│   │
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── BackToTop.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── CustomCursor.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MusicPlayer.jsx
│   │   │   ├── ScrollProgress.jsx
│   │   │   ├── SEOHelmet.jsx
│   │   │   └── SocialLinks.jsx
│   │   │
│   │   ├── fragments/
│   │   │   ├── side-left/       # Sidebar components
│   │   │   │   ├── HeadFragment.jsx
│   │   │   │   └── NavigationFragment.jsx
│   │   │   │
│   │   │   └── side-right/      # Main content sections
│   │   │       ├── AboutFragment.jsx
│   │   │       ├── BlogFragment.jsx
│   │   │       ├── ContactFragment.jsx
│   │   │       ├── ExperienceFragment.jsx
│   │   │       ├── ProjectFragment.jsx
│   │   │       └── TestimonialsFragment.jsx
│   │   │
│   │   ├── layouts/             # Layout components
│   │   │   ├── AppShell.jsx
│   │   │   └── HomeLayout.jsx
│   │   │
│   │   ├── EnhancedThemeToggle.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── context/                 # React Context
│   │   ├── EnhancedThemeContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── data/                    # Data files
│   │   ├── side-left/
│   │   │   ├── head.js          # Profile info
│   │   │   └── navigation.js    # Nav menu
│   │   │
│   │   ├── side-right/
│   │   │   ├── detail.js        # About data
│   │   │   ├── experience.js    # Work history
│   │   │   └── project.js       # Projects
│   │   │
│   │   ├── blogArticles.js      # Blog posts
│   │   ├── socialLinks.js       # Social media
│   │   └── testimonials.js      # Testimonials
│   │
│   ├── pages/                   # Page components
│   │   ├── home/
│   │   │   └── HomePage.jsx
│   │   └── error/
│   │       └── NotFoundPage.jsx
│   │
│   ├── utils/                   # Utility functions
│   │   └── getAsset.js
│   │
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ketsar28/k-folio.git
   cd k-folio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure EmailJS (Optional)**

   To enable the contact form, update credentials in `src/components/common/ContactForm.jsx`:
   ```javascript
   const serviceId = "YOUR_SERVICE_ID";
   const templateId = "YOUR_TEMPLATE_ID";
   const publicKey = "YOUR_PUBLIC_KEY";
   ```

   Get your credentials from [EmailJS](https://www.emailjs.com/)

4. **Add Background Music (Optional)**

   Place your MP3 file in `/public/music/lofi-background.mp3` or use the default placeholder.

---

## 💻 Development

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit: `http://localhost:5173`

### Development Features

- ⚡ **Hot Module Replacement (HMR)** - Instant updates
- 🔍 **ESLint** - Code quality checks
- 🎨 **Tailwind CSS** - JIT compilation
- 📱 **Responsive Preview** - Test on all devices

### Project Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build",            // Build for production
  "preview": "vite preview",        // Preview production build
  "lint": "eslint . --ext js,jsx"   // Run ESLint
}
```

---

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

Visit: `http://localhost:4173`

### Deploy to Vercel

This project is configured for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. **Deploy via Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

3. **Or use Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Click "Deploy"

### Environment Variables

No environment variables required for basic deployment. For EmailJS, add:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](https://via.placeholder.com/1200x600/2563eb/ffffff?text=Desktop+View)

### Mobile View
![Mobile Screenshot](https://via.placeholder.com/400x800/3b82f6/ffffff?text=Mobile+View)

### Dark Mode
![Dark Mode Screenshot](https://via.placeholder.com/1200x600/1e293b/ffffff?text=Dark+Mode)

---

## 🎨 Customization

### Change Colors

Edit `src/index.css`:
```css
:root {
  --primary-light: #2563eb;    /* Your primary color */
  --accent-light: #3b82f6;     /* Your accent color */
  /* ... */
}
```

### Update Content

1. **Profile Info** - `src/data/side-left/head.js`
2. **About Section** - `src/data/side-right/detail.js`
3. **Experience** - `src/data/side-right/experience.js`
4. **Projects** - `src/data/side-right/project.js`
5. **Blog Articles** - `src/data/blogArticles.js`
6. **Testimonials** - `src/data/testimonials.js`
7. **Social Links** - `src/data/socialLinks.js`

### Add New Sections

1. Create component in `src/components/fragments/side-right/`
2. Import in `src/components/layouts/HomeLayout.jsx`
3. Add to navigation in `src/data/side-left/navigation.js`

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Build fails with module errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Custom cursor not working**
- Check browser compatibility (may not work on mobile)
- Ensure CSS is properly imported

**Issue: EmailJS not sending emails**
- Verify credentials are correct
- Check EmailJS dashboard for quota limits
- Ensure template ID matches

**Issue: Theme not persisting**
- Clear browser localStorage
- Check browser console for errors

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

**Muhammad Ketsar Ali Abi Wahid**

- 📧 Email: [muhammadketsar45@gmail.com](mailto:muhammadketsar45@gmail.com)
- 💼 LinkedIn: [ketsarali](https://www.linkedin.com/in/ketsarali/)
- 🐙 GitHub: [ketsar28](https://github.com/ketsar28/)
- 📷 Instagram: [@ketsar.aaw](https://www.instagram.com/ketsar.aaw/)
- 🤗 HuggingFace: [ketsar](https://huggingface.co/ketsar)
- 🎨 Streamlit: [ketsar28](https://share.streamlit.io/user/ketsar28)
- 💬 WhatsApp: [Chat with me](https://wa.me/6285155343380)

**Project Link:** [https://github.com/ketsar28/k-folio](https://github.com/ketsar28/k-folio)

**Live Website:** [https://k-folio-prod.vercel.app/](https://k-folio-prod.vercel.app/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration from [saumyachaturvedi.com](https://saumyachaturvedi.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Deployed on [Vercel](https://vercel.com)

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/ketsar28/k-folio?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/ketsar28/k-folio?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/ketsar28/k-folio?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/ketsar28/k-folio?style=flat-square)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ❤️ by Muhammad Ketsar Ali Abi Wahid**

**Built with React.js, Tailwind CSS & Vite**

[⬆ Back to Top](#-k-folio---modern-data-science-portfolio)

</div>
