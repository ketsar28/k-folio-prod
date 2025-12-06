import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'vendor-ui': ['framer-motion', 'react-icons', 'react-hot-toast', 'react-scroll', 'react-type-animation'],
          'vendor-utils': ['@emailjs/browser', 'html2canvas', 'jspdf'],
        },
      },
    },
  },
})
