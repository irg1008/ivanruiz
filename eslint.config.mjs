import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'

/**
 * @type {import("eslint").Linter.FlatConfig} F
 */
export default [
	...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
	eslintConfigPrettier,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {},
	},
]
