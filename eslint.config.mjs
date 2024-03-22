import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat()

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
	eslint.configs.recommended,
	eslintPluginPrettierRecommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs['flat/recommended'],
	...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
	...compat.config({
		extends: ['plugin:tailwindcss/recommended'],
		rules: {
			'tailwindcss/no-custom-classname': 'warn',
			'tailwindcss/classnames-order': 'error',
		},
	}),
	{
		rules: {
			'no-console': 'warn',
			'no-extend-native': 'error',
			'no-implicit-coercion': 'error',
			'prefer-const': 'error',
			'no-var': 'error',
		},
	},
]
