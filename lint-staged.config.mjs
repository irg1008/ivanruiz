/**
 * @type {import("lint-staged").Config}
 */
export default {
	'src/**/*.{astro,ts,js,tsx,jsx},!src/lib/db/xata.ts': ['eslint', 'prettier --check'],
}
