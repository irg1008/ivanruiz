import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import { VitePWA } from 'vite-plugin-pwa'

import vercel from '@astrojs/vercel/static'

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
	output: 'server',
	adapter: vercel({
		webAnalytics: {
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
			noExternal: ['path-to-regexp'],
		},
		plugins: [
			VitePWA({
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
	},
})
