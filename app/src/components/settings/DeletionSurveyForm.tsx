import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useCreateWithdrawalFeedback } from '@/hooks/queries/inquirys/useCreateWithdrawalFeedback'

import CustomButton from '../ui/input/CustomButton'
import CustomCheckbox from '../ui/input/CustomCheckbox'
import CustomTextInput from '../ui/input/CustomTextInput'

const DELETION_SURVEY_DATA = [
	'tooOften',
	'notEnough',
	'privacy',
	'tooManyNotifications',
	'support',
	'price',
	'other'
] as const

type DeletionReason = (typeof DELETION_SURVEY_DATA)[number]

interface DeletionSurveyFormProps {
	onSubmit: () => void
	submitText: string
}

export default function DeletionSurveyForm({
	onSubmit,
	submitText
}: DeletionSurveyFormProps) {
	const { t } = useTranslation()
	const navigation = useNavigation()
	// TODO: 회원탈퇴 API 연동
	const { mutateAsync: _createWithdrawalFeedback, isPending } =
		useCreateWithdrawalFeedback()

	const [checkedItems, setCheckedItems] = useState<
		Record<DeletionReason, boolean>
	>(
		DELETION_SURVEY_DATA.reduce(
			(acc, key) => ({ ...acc, [key]: false }),
			{} as Record<DeletionReason, boolean>
		)
	)
	const [otherReason, setOtherReason] = useState('')

	const toggleCheckbox = (id: DeletionReason) => {
		setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const handleSubmit = async () => {
		const selectedReasons = DELETION_SURVEY_DATA.filter(
			(reason) => checkedItems[reason]
		).map((reason) => t(`auth.deletionSurvey.${reason}`))

		if (selectedReasons.length === 0) {
			Toast.show({
				type: 'error',
				text1: '탈퇴 사유를 선택해주세요.'
			})
			return
		}

		const _content = [
			...selectedReasons,
			checkedItems.other && otherReason ? `기타: ${otherReason}` : ''
		]
			.filter(Boolean)
			.join('\n')

		try {
			// FIXME: 피드백 제출 기능 수정 시 주석 해제
			// await _createWithdrawalFeedback({ content: _content })
			onSubmit()
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: '피드백 제출에 실패했습니다.'
			})
		}
	}

	return (
		<View className="flex-1">
			<ScrollView>
				{DELETION_SURVEY_DATA.map((item) => (
					<View key={item} className="flex-row justify-between items-center">
						<CustomCheckbox
							checked={checkedItems[item]}
							onChange={() => toggleCheckbox(item)}
							label={t(`auth.deletionSurvey.${item}`)}
							iconPosition="right"
							className="w-full py-2 px-5"
						/>
					</View>
				))}
				{checkedItems.other && (
					<CustomTextInput
						value={otherReason}
						onChangeText={setOtherReason}
						placeholder={t('auth.accountDeletionPlaceholder')}
						className="mt-4 mb-4 px-5"
					/>
				)}
			</ScrollView>
			<View className="mt-auto mb-2 flex-row px-5">
				<CustomButton onPress={() => navigation.goBack()} flex className="mr-3">
					{t('common.cancel')}
				</CustomButton>
				<CustomButton
					onPress={handleSubmit}
					flex
					colorVariant="secondary"
					loading={isPending}
				>
					{submitText}
				</CustomButton>
			</View>
		</View>
	)
}
