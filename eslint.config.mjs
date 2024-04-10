import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginTailwind from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat()

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.config({ settings: { react: { version: 'detect' } } }),
  ...compat.config({
    overrides: [
      {
        files: './src/**/*.{txs,jsx}',
        ...eslintPluginReact.configs['recommended'],
      },
    ],
  }),
  ...compat.config(eslintPluginReact.configs['jsx-runtime']),
  ...compat.config(eslintPluginReactHooks.configs.recommended),
  ...compat.config(eslintPluginTailwind.configs.recommended),
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
  eslintPluginPrettierRecommended,
  {
    ignores: ['./src/lib/db/xata.ts', './src/pages/es/**'],
    rules: {
      'no-console': 'warn',
      'no-extend-native': 'error',
      'no-implicit-coercion': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
    },
  },
]
