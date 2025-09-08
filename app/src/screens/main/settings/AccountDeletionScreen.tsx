import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform } from 'react-native'

import DeletionSurveyForm from '@/components/settings/DeletionSurveyForm'
import { CustomText } from '@/components/ui/display/CustomText'
import { useDeleteAccount } from '@/hooks/queries/auth/useDeleteAccount'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'AccountDeletion'>

export default function AccountDeletionScreen(_props: Props) {
	const { t } = useTranslation()
	const { mutate: deleteAccount } = useDeleteAccount()

	const handleNext = () => {
		deleteAccount()
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 132 : 0}
			className="flex-1"
		>
			<CustomText variant="h1Semibold" className="mt-12 mb-[59] px-5">
				{t('auth.accountDeletionTitle')}
			</CustomText>
			<DeletionSurveyForm onSubmit={handleNext} submitText={t('common.next')} />
		</KeyboardAvoidingView>
	)
}
