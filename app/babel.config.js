module.exports = {
	presets: ['module:@react-native/babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src'],
				extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
				alias: {
					'@': './src'
				}
			},
			'react-native-reanimated/plugin'
		],
		'nativewind/babel',
		[
			'module:react-native-dotenv',
			{
				moduleName: '@env' // import { VAR } from '@env'
			}
		],
		'react-native-reanimated/plugin'
	],
	env: {
		production: {
			plugins: ['react-native-paper/babel']
		}
	}
}
