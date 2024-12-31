import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import messaging from '@react-native-firebase/messaging'
import { NavigationContainer } from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Portal } from 'react-native-paper'
import { requestNotifications } from 'react-native-permissions'
import { DevToolsBubble } from 'react-native-react-query-devtools'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'

import GlobalErrorFallback from './components/error/GlobalErrorFallback'
import DismissKeyboardView from './components/ui/display/DismissKeyboardView'
import RootNavigator from './navigation/RootNavigator'
import { theme } from './theme/defaultTheme'
import { customNavigationTheme } from './theme/navigationTheme'
import { displayNotification } from './utils/displayNotification'
import { queryClient } from './utils/queryClient'
import { toastConfig } from './utils/toastConfig'

Sentry.init({
	dsn: 'https://70a07229f3793321538f0265ea8b8657@o4508397491388416.ingest.us.sentry.io/4508397502595072',
	debug: true,
	maxBreadcrumbs: 150,
	enableAutoSessionTracking: true,
	sessionTrackingIntervalMillis: 5000
})

export default function App() {
	useEffect(() => {
		requestNotifications(['alert', 'sound', 'badge'])

		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			displayNotification(remoteMessage)
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		})

		SplashScreen.hide()
		return unsubscribe
	}, [])

	return (
		<SafeAreaProvider>
			<StatusBar
				barStyle={'light-content'}
				backgroundColor={theme.dark.colors.background}
			/>
			<GestureHandlerRootView className="flex-1">
				<SafeAreaView className="flex-1 bg-background">
					<NavigationContainer theme={customNavigationTheme.dark}>
						<PaperProvider theme={theme.dark}>
							<QueryClientProvider client={queryClient}>
								<ErrorBoundary FallbackComponent={GlobalErrorFallback}>
									<BottomSheetModalProvider>
										<Portal.Host>
											<DismissKeyboardView>
												<RootNavigator />
											</DismissKeyboardView>
										</Portal.Host>
										<Toast
											position="bottom"
											bottomOffset={92}
											config={toastConfig}
										/>
									</BottomSheetModalProvider>
								</ErrorBoundary>
								{__DEV__ && <DevToolsBubble />}
							</QueryClientProvider>
						</PaperProvider>
					</NavigationContainer>
				</SafeAreaView>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}
