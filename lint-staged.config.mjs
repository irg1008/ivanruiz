/**
 * @type {import("lint-staged").Config}
 */
export default {
  'src/**/*.{astro,ts,js,tsx,jsx}': ['eslint --ext', 'prettier --check'],
};
