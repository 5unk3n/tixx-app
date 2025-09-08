import { APPSFLYER_DEV_KEY } from '@env'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import messaging from '@react-native-firebase/messaging'
import {
	NavigationContainer,
	createNavigationContainerRef
} from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { StatusBar } from 'react-native'
import appsFlyer from 'react-native-appsflyer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Portal } from 'react-native-paper'
import { requestNotifications } from 'react-native-permissions'
import { DevToolsBubble } from 'react-native-react-query-devtools'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { restart, useStallionUpdate, withStallion } from 'react-native-stallion'
import Toast from 'react-native-toast-message'
import z from 'zod'

import GlobalErrorFallback from './components/error/GlobalErrorFallback'
import DismissKeyboardView from './components/ui/display/DismissKeyboardView'
import RootNavigator from './navigation/RootNavigator'
import { theme } from './theme/defaultTheme'
import { customNavigationTheme } from './theme/navigationTheme'
import { displayNotification } from './utils/displayNotification'
import { queryClient } from './utils/queryClient'
import { customErrorMap } from './utils/schemas'
import { toastConfig } from './utils/toastConfig'

Sentry.init({
	dsn: 'https://63d4017a178ccb4badb6a276e3463125@o4508407635247104.ingest.us.sentry.io/4508407636295680',
	debug: false,
	maxBreadcrumbs: 50,
	enableAutoSessionTracking: true,
	sendDefaultPii: false
	// FIXME: Stack trace, Breadcrumbs에서 민감한 정보 제거
})

z.setErrorMap(customErrorMap)

function App() {
	const { newReleaseBundle } = useStallionUpdate()
	const navigationRef = createNavigationContainerRef()

	// 딥링크로 진입시 초기 스택 설정
	const initialState = {
		routes: [
			{
				name: 'Main'
			}
		]
	}

	useEffect(() => {
		const onDeepLinkCanceller = appsFlyer.onDeepLink((res) => {
			if (res?.deepLinkStatus !== 'NOT_FOUND') {
				const DLValue = res?.data.deep_link_value
				const deepLinkSub1 = res?.data.deep_link_sub1 // get up to 10 custom OneLink params

				if (navigationRef.isReady()) {
					if (DLValue === 'host' && deepLinkSub1) {
						navigationRef.navigate('HostDetail', {
							hostId: Number(deepLinkSub1)
						})
					} else if (DLValue === 'event') {
						navigationRef.navigate('EventDetail', {
							eventId: Number(deepLinkSub1)
						})
					}
				}
			}
		})

		appsFlyer.setAppInviteOneLinkID('b0Kl', (result) => {
			console.info('OneLink ID 설정 성공', result)
		})

		appsFlyer.initSdk(
			{
				devKey: APPSFLYER_DEV_KEY,
				isDebug: false,
				appId: '6737306169',
				onInstallConversionDataListener: true,
				onDeepLinkListener: true, //Optional
				timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
			},
			(result) => {
				console.info('AppsFlyer SDK 초기화 성공', result)
			},
			(error) => {
				console.error('AppsFlyer SDK 초기화 실패', error)
			}
		)

		requestNotifications(['alert', 'sound', 'badge'])

		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			displayNotification(remoteMessage)
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		})

		setTimeout(() => {
			SplashScreen.hide()
		}, 1000)

		return () => {
			unsubscribe()
			onDeepLinkCanceller()
		}
	}, [navigationRef])

	useEffect(() => {
		if (__DEV__) {
			return
		}

		if (newReleaseBundle?.isMandatory) {
			restart()
		}
	}, [newReleaseBundle])

	return (
		<SafeAreaProvider>
			<StatusBar
				barStyle={'light-content'}
				backgroundColor={theme.dark.colors.background}
			/>
			<GestureHandlerRootView className="flex-1">
				<SafeAreaView
					className="flex-1 bg-background"
					edges={['top', 'left', 'right']}
				>
					<NavigationContainer
						ref={navigationRef}
						theme={customNavigationTheme.dark}
						initialState={initialState}
					>
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

export default withStallion(App)
