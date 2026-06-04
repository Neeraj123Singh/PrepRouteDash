import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const STAGING_API = 'https://admin-moderator-backend-staging.up.railway.app'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: STAGING_API,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: STAGING_API,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
