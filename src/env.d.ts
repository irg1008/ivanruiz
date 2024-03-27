/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly XATA_API_KEY: string
	readonly XATA_BRANCH: string
	readonly API_KEY: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
