import cloudflare from '@astrojs/cloudflare'
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
	output: 'server',
	adapter: cloudflare(),
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		build: {
			cssMinify: 'lightningcss',
		},
		ssr: {
			noExternal: true,
			external: ['node:buffer', 'node:crypto'],
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
