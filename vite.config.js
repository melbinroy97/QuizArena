import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use Vite's defineConfig and the official React plugin.
// Tailwind should be handled by PostCSS (postcss.config.cjs), not a non-standard vite plugin.
export default defineConfig({
  plugins: [react()],
})
