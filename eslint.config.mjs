import eslintPluginAstro from 'eslint-plugin-astro';
export default [
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    plugins: ['jsx-a11y'],
    extends: ['plugin:jsx-a11y/recommended'],
    rules: {
      // "astro/no-set-html-directive": "error"
    },
  },
];
