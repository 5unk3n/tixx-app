module.exports = {
	root: true,
	extends: [
		'@react-native',
		'prettier',
		'plugin:@tanstack/eslint-plugin-query/recommended'
	],
	plugins: ['prettier', 'import'],
	rules: {
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
		'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'internal',
					['parent', 'sibling'],
					'index',
					'object',
					'type'
				],
				pathGroups: [
					{
						pattern: '@/**',
						group: 'internal',
						position: 'after'
					}
				],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true
				}
			}
		]
	}
}
