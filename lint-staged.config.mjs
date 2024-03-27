/**
 * @type {import("lint-staged").Config}
 */
export default {
	'src/**/*.{astro,ts,js,tsx,jsx}': ['eslint', 'prettier --check'],
	'!src/db/xata.ts': false,
}
