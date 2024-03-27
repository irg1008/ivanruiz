import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import { VitePWA } from 'vite-plugin-pwa'

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
	],
	build: {
		inlineStylesheets: 'always',
	},
	output: 'server',
	vite: {
		build: {
			cssMinify: 'lightningcss',
		},
		plugins: [
			VitePWA({
				registerType: 'autoUpdate',
				workbox: {
					globDirectory: 'dist',
					globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
					navigateFallback: null,
				},
			}),
		],
	},
})
