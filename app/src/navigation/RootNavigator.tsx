import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { VerifyIdentityHeader } from '@/components/ui/navigation/StackHeader'
import { useAppVersion } from '@/hooks/useAppVersion'
import { useAuth } from '@/hooks/useAuth'
import VerifyIdentityScreen from '@/screens/auth/VerifyIdentityScreen'
import { RootStackParamList } from '@/types/navigation'

import AuthNavigator from './AuthStackNavigator'
import MainStackNavigator from './MainStackNavigator'

const RootStack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
	const { t } = useTranslation()
	const { isAuthenticated, initializeAuth } = useAuth()
	const [isReady, setIsReady] = useState(false)
	const insets = useSafeAreaInsets()
	useAppVersion(true)

	useEffect(() => {
		initializeAuth().then(() => {
			setIsReady(true)
		})
	}, [initializeAuth])

	if (!isReady) return

	return (
		<RootStack.Navigator
			screenOptions={{
				headerShown: false,
				contentStyle: { paddingBottom: insets.bottom }
			}}
		>
			{isAuthenticated ? (
				<RootStack.Screen
					name="Main"
					component={MainStackNavigator}
					options={{ contentStyle: { paddingBottom: 0 } }}
				/>
			) : (
				<RootStack.Screen name="Auth" component={AuthNavigator} />
			)}
			<RootStack.Screen
				name="VerifyIdentity"
				component={VerifyIdentityScreen}
				options={{
					headerShown: true,
					header: VerifyIdentityHeader,
					title: t('navigation.verifyIdentity')
				}}
			/>
		</RootStack.Navigator>
	)
}
