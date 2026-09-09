import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Типографика лежит в ../../shared, за пределами корня приложения.
  server: { fs: { allow: ['../..'] }, port: 5181 },
})
