import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import * as importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{ ignores: ['dist'] },
	{
		extends: [
			importPlugin.flatConfigs.recommended,
			importPlugin.flatConfigs.typescript
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier: prettier
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true }
			],
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
			'import/order': [
				'warn',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling'],
						'index',
						'type'
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			],
			// https://typescript-eslint.io/troubleshooting/typed-linting/performance/#eslint-plugin-import
			// 중복 규칙 비활성화
			'import/named': 'off',
			'import/namespace': 'off',
			'import/default': 'off',
			'import/no-named-as-default-member': 'off',
			'import/no-unresolved': 'off'
		}
	},
	prettierConfig
)
