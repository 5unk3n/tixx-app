import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AgreementForm from '@/components/auth/AgreementForm'
import { CustomText } from '@/components/ui/display/CustomText'
import { AuthStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<AuthStackParamList, 'Agreement'>

export default function AgreementScreen({}: Props) {
	const { t } = useTranslation()

	return (
		<View className="flex-1 pb-2 pt-[88]">
			<CustomText variant="h1Semibold" className="mb-10 px-5 text-grayscale-0">
				{t('auth.terms.title')}
			</CustomText>
			<AgreementForm />
		</View>
	)
}
