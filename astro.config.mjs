import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import AstroPWA from '@vite-pwa/astro'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  devToolbar: {
    enabled: false,
  },
  integrations: [
    tailwind({
      nesting: true,
      applyBaseStyles: true,
    }),
    react(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      injectRegister: 'auto',
      workbox: {
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
        navigateFallback: null,
      },
    }),
  ],
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
    ssr: {
      external: ['node:buffer', 'node:crypto'],
    },
  },
})
