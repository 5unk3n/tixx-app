module.exports = {
	preset: 'react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transform: {
		'^.+.(js|jsx|ts|tsx)$': 'babel-jest'
	},
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|@gorhom/bottom-sheet|react-native-country-codes-picker|react-native-permissions|react-native-splash-screen|react-native-stallion|react-native-toast-message|@invertase/react-native-apple-authentication|@react-native-seoul/kakao-login|@react-native-seoul/naver-login|@react-native-firebase/messaging|@sentry/react-native|react-native-appsflyer|react-native-gesture-handler|react-native-react-query-devtools|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-webview))/'
	],
	setupFilesAfterEnv: ['./jest-setup.js'],
	moduleNameMapper: {
		'^@env$': '<rootDir>/__mocks__/react-native-dotenv.js',
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/fileMock.js'
	}
}
