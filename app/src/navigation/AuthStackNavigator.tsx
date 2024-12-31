import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import CustomHeader from '@/components/ui/navigation/CustomHeader'
import { NAVIGATION } from '@/constants/navigation'
import AgreementScreen from '@/screens/auth/AgreementScreen'
import CheckProfileScreen from '@/screens/auth/CheckProfileScreen'
import LoginScreen from '@/screens/auth/LoginScreen'
import TermsDetailScreen from '@/screens/auth/TermsDetailScreen'
import { AuthStackParamList } from '@/types/navigation'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

export default function AuthStackNavigator() {
	return (
		<AuthStack.Navigator initialRouteName="Login">
			<AuthStack.Screen
				name="Login"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<AuthStack.Screen
				name="Agreement"
				component={AgreementScreen}
				options={{ headerShown: false }}
			/>
			<AuthStack.Screen name="TermsDetail" component={TermsDetailScreen} />
			<AuthStack.Screen
				name="CheckProfile"
				component={CheckProfileScreen}
				options={{
					header: (props) => (
						<CustomHeader {...props} title={NAVIGATION.CHECK_PROFILE} hasBack />
					)
				}}
			/>
		</AuthStack.Navigator>
	)
}
