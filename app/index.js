/**
 * @format
 */

import messaging from '@react-native-firebase/messaging'
import { AppRegistry } from 'react-native'
import {
	configureReanimatedLogger,
	ReanimatedLogLevel
} from 'react-native-reanimated'

import { name as appName } from './app.json'
import App from './src/App'

// HACK: reanimate 경고 임시 제거
configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false // Reanimated runs in strict mode by default
})

function HeadlessCheck({ isHeadless }) {
	if (isHeadless) {
		// App has been launched in the background by iOS, ignore
		return null
	}

	// Render the app component on foreground launch
	return <App />
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	// TODO: 핸들링 추가하기
})

AppRegistry.registerComponent(appName, () => HeadlessCheck)
