import eslintPluginAstro from 'eslint-plugin-astro';

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    plugins: ['jsx-a11y'],
    extends: ['plugin:jsx-a11y/recommended', 'eslint-config-prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // "astro/no-set-html-directive": "error"
    },
  },
];
