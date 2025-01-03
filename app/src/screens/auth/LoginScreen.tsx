import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View, Platform } from 'react-native'

import LoginButton from '@/components/auth/LoginButton'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { AuthStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export default function LoginScreen({}: Props) {
	return (
		<View className="flex-1 px-5 pb-14">
			<View className="flex-1 justify-center items-center">
				<CustomIcon name="tixxLogo" width={119} height={36} />
			</View>
			<View className="gap-2">
				<LoginButton provider="naver" />
				{/* FIXME: 카카오 비즈앱 신청 심사 완료 후 다시 추가 */}
				{/* <LoginButton provider="kakao" /> */}
				{Platform.OS === 'ios' && <LoginButton provider="apple" />}
			</View>
		</View>
	)
}
