import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'

import CustomHeader from '@/components/ui/navigation/CustomHeader'
import { NAVIGATION } from '@/constants/navigation'
import { useAuth } from '@/hooks/useAuth'
import VerifyIdentityScreen from '@/screens/auth/VerifyIdentityScreen'
import { RootStackParamList } from '@/types/navigation'

import AuthNavigator from './AuthStackNavigator'
import MainStackNavigator from './MainStackNavigator'

const RootStack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
	const { isAuthenticated, initializeAuth } = useAuth()
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		initializeAuth().then(() => {
			setIsReady(true)
		})
	}, [initializeAuth])

	if (!isReady) return

	return (
		<RootStack.Navigator screenOptions={{ headerShown: false }}>
			{isAuthenticated ? (
				<RootStack.Screen name="Main" component={MainStackNavigator} />
			) : (
				<RootStack.Screen name="Auth" component={AuthNavigator} />
			)}
			<RootStack.Screen
				name="VerifyIdentity"
				component={VerifyIdentityScreen}
				options={{
					headerShown: true,
					header: (props) => (
						<CustomHeader
							{...props}
							title={NAVIGATION.VERIFY_IDENTITY}
							hasBack
						/>
					)
				}}
			/>
		</RootStack.Navigator>
	)
}
