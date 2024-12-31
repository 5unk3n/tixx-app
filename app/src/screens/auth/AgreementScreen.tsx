import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native'

import AgreementForm from '@/components/auth/AgreementForm'
import { CustomText } from '@/components/ui/display/CustomText'
import { UI } from '@/constants/ui'
import { AuthStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<AuthStackParamList, 'Agreement'>

export default function AgreementScreen({}: Props) {
	return (
		<View className="flex-1 pb-2 pt-[88]">
			<CustomText variant="h1Semibold" className="mb-10 px-5 text-grayscale-w">
				{UI.AUTH.AGREE_TO_TERMS}
			</CustomText>
			<AgreementForm />
		</View>
	)
}
