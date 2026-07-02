import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// The `base` is set for GitHub Pages project sites (served from /<repo>/).
// Override at build time with: VITE_BASE=/your-repo/ npm run build
const base = process.env.VITE_BASE ?? '/avinga/'

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    // Turns the app into an installable PWA: generates the web manifest and an
    // offline service worker that precaches the built assets. Paths inherit the
    // Vite `base`, so everything resolves correctly under /avinga/.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Sweaty Week',
        short_name: 'Sweaty Week',
        description: 'A cozy weekly & monthly workout tracker for Aviv & Inga.',
        theme_color: '#F4E8DE',
        background_color: '#F4E8DE',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['health', 'fitness', 'lifestyle'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
