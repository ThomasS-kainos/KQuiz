import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/game': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/lobby': 'http://localhost:3000',
    },
  },
})
