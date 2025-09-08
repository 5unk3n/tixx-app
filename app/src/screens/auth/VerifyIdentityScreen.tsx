import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native'

import VerifyPhoneForm from '@/components/auth/VerifyPhoneForm'
import { useSignUpStore } from '@/stores/signUpStore'
import { RootStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyIdentity'>

export default function VerifyIdentityScreen({ route }: Props) {
	const navigation = useNavigation()
	const { mode } = route.params
	const setAuthData = useSignUpStore((state) => state.setOAuthData)

	const handleSubmit = (phone: string, verified: number) => {
		if (mode === 'signUp') {
			setAuthData({ phone, verified })
			navigation.navigate('CheckProfile')
			return
		}
		if (mode === 'edit') {
			// TODO: 회원 정보 수정 로직 추가
			return
		}
	}

	return (
		<View className="flex-1 px-5 pt-12 pb-2">
			<VerifyPhoneForm onSubmit={handleSubmit} />
		</View>
	)
}
