import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The `base` is set for GitHub Pages project sites (served from /<repo>/).
// Override at build time with: VITE_BASE=/your-repo/ npm run build
const base = process.env.VITE_BASE ?? '/avinga/'

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
