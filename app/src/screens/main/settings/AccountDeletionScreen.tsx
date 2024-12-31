import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import DeletionSurveyForm from '@/components/settings/Feedback'
import { CustomText } from '@/components/ui/display/CustomText'
import { useDeleteAccount } from '@/hooks/queries/auth/useDeleteAccount'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'AccountDeletion'>

export default function AccountDeletionScreen(_props: Props) {
	const { mutate: deleteAccount } = useDeleteAccount()

	const handleNext = () => {
		// TODO: 피드백 api 추가하기
		deleteAccount()
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<CustomText variant="h1Semibold" className="mt-12 mb-[59]">
				탈퇴하는 이유가 무엇인가요?
			</CustomText>
			<DeletionSurveyForm onSubmit={handleNext} submitText="다음" />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		minHeight: '100%',
		paddingHorizontal: 20,
		paddingBottom: 8
	}
})
