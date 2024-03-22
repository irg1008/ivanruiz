import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {},
	},
	...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
	eslintConfigPrettier,
]
