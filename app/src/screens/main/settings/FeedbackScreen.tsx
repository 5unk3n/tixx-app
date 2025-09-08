import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import CustomTextInput from '@/components/ui/input/CustomTextInput'
import { useCreateAppFeedback } from '@/hooks/queries/inquirys/useCreateAppFeedback'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Feedback'>

export default function FeedbackScreen(_props: Props) {
	const { t } = useTranslation()
	const navigation = useNavigation()
	const [content, setContent] = useState('')
	const { mutateAsync: createFeedback, isPending } = useCreateAppFeedback()

	const handleSubmit = async () => {
		if (!content.trim()) {
			Toast.show({
				type: 'error',
				text1: '피드백을 입력해주세요.'
			})
			return
		}

		try {
			await createFeedback({ content })
			Toast.show({
				type: 'success',
				text1: '피드백이 제출되었습니다.'
			})
			navigation.goBack()
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: '피드백 제출에 실패했습니다.'
			})
		}
	}

	return (
		<View className="flex-1 px-5 pb-2">
			<CustomText variant="h1Semibold" className="mt-12">
				{t('common.settings.feedbackTitle')}
			</CustomText>
			<CustomTextInput
				placeholder={t('common.settings.feedbackPlaceholder')}
				className="mt-6 h-36"
				numberOfLines={6}
				textAlignVertical="top"
				multiline
				value={content}
				onChangeText={setContent}
			/>
			<CustomButton
				onPress={handleSubmit}
				className="mt-auto"
				loading={isPending}
			>
				{t('common.actions.submit')}
			</CustomButton>
		</View>
	)
}
