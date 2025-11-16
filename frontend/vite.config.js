import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // 🔥 Render uchun muhim bo‘lim
  preview: {
    port: 10000,
    allowedHosts: ['moongift-frontend.onrender.com'], // <-- bu joy shart
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
