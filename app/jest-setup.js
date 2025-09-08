import 'react-native-gesture-handler/jestSetup'
import { setUpTests } from 'react-native-reanimated'

setUpTests()

import { jest } from '@jest/globals'
import { NativeModules } from 'react-native'

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

global.console = {
	...console,
	log: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
	info: jest.fn()
}

jest.useFakeTimers()

jest.mock('react-native-splash-screen', () => ({
	hide: jest.fn()
}))

// SettingsManager 모킹
NativeModules.SettingsManager = {
	settings: {
		AppleLocale: 'en_US',
		AppleLanguages: ['en']
	},
	getConstants: jest.fn(() => ({
		settings: {
			AppleLocale: 'en_US',
			AppleLanguages: ['en']
		}
	}))
}

jest.mock('@notifee/react-native', () => ({
	displayNotification: jest.fn(),
	createChannel: jest.fn(),
	AndroidImportance: {
		HIGH: 'high'
	}
}))

jest.mock('react-native-webview', () => {
	const { View } = require('react-native')
	return {
		WebView: View
	}
})

jest.mock('@react-native-community/blur', () => {
	const { View } = jest.requireActual('react-native')
	return {
		BlurView: View
	}
})

jest.mock('react-native-linear-gradient', () => {
	const { View } = jest.requireActual('react-native')
	return View
})

jest.mock('@react-native-masked-view/masked-view', () => {
	const { View } = jest.requireActual('react-native')
	return View
})

jest.mock('@react-native-community/geolocation', () => ({
	getCurrentPosition: jest.fn(),
	watchPosition: jest.fn(),
	clearWatch: jest.fn()
}))

jest.mock('@react-native-google-signin/google-signin', () => ({
	GoogleSignin: {
		configure: jest.fn(),
		hasPlayServices: jest.fn(() => Promise.resolve(true)),
		signIn: jest.fn(() =>
			Promise.resolve({
				idToken: 'mockIdToken',
				user: { email: 'test@example.com', name: 'Test User' }
			})
		),
		getCurrentUser: jest.fn()
	},
	statusCodes: {}
}))

jest.mock('react-native-otp-verify', () => ({
	getHash: jest.fn(),
	removeListener: jest.fn()
}))

jest.mock('react-native-device-info', () => ({
	getVersion: () => '1.0.0'
}))

jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('react-native-localize', () => ({
	getLocales: () => [
		{
			countryCode: 'US',
			languageTag: 'en-US',
			languageCode: 'en',
			isRTL: false
		}
	],
	findBestAvailableLanguage: () => ({
		languageTag: 'en-US',
		isRTL: false
	})
}))

jest.mock('@react-native-firebase/messaging', () => ({
	__esModule: true,
	default: jest.fn(() => ({
		hasPermission: jest.fn(() => Promise.resolve(true)),
		subscribeToTopic: jest.fn(),
		unsubscribeFromTopic: jest.fn(),
		requestPermission: jest.fn(() => Promise.resolve(true)),
		getToken: jest.fn(() => Promise.resolve('myMockToken')),
		onMessage: jest.fn(),
		onNotificationOpenedApp: jest.fn(),
		getInitialNotification: jest.fn(() => Promise.resolve(null))
	}))
}))

jest.mock('react-native-appsflyer', () => ({
	onDeepLink: jest.fn(),
	initSdk: jest.fn(),
	setAppInviteOneLinkID: jest.fn()
}))

jest.mock('@sentry/react-native', () => ({
	init: jest.fn()
}))

jest.mock('react-native-permissions', () =>
	require('react-native-permissions/mock')
)

jest.mock('@gorhom/bottom-sheet', () => {
	const React = require('react')
	const { View } = require('react-native')
	const BottomSheetModal = React.forwardRef(({ children }, ref) => {
		React.useImperativeHandle(ref, () => ({
			present: jest.fn(),
			dismiss: jest.fn()
		}))
		return <View>{children}</View>
	})

	return {
		__esModule: true,
		BottomSheetModal,
		BottomSheetView: View,
		BottomSheetBackdrop: View
	}
})
