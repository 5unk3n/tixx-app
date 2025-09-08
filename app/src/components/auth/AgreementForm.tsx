import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useSignUpStore } from '@/stores/signUpStore'

import CustomButton from '../ui/input/CustomButton'
import CustomCheckbox from '../ui/input/CustomCheckbox'

export default function AgreementForm() {
	const navigation = useNavigation()
	const { t } = useTranslation()
	const setOAuthData = useSignUpStore((state) => state.setOAuthData)

	const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
	const isAllChecked = termsData.every((item) => checkedItems[item.id])
	const isAllRequiredChecked = termsData
		.filter((item) => item.required)
		.every((item) => checkedItems[item.id])

	const toggleCheckbox = (id: string) => {
		setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const toggleAllCheckboxes = () => {
		const newValue = !isAllChecked
		setCheckedItems(
			termsData.reduce((acc, cur) => ({ ...acc, [cur.id]: newValue }), {})
		)
	}

	const handleSubmit = () => {
		const marketingOptIn = checkedItems.marketingAgreement ? 1 : 0
		setOAuthData({ marketingOptIn })
		navigation.navigate('VerifyIdentity', { mode: 'signUp' })
	}

	return (
		<View className="flex-1">
			<View className="flex-row">
				<CustomCheckbox
					checked={isAllChecked}
					onChange={toggleAllCheckboxes}
					label={t('auth.terms.agreeAll')}
					labelSize="lg"
					iconType="square"
					className="mb-1 py-2 px-5"
				/>
			</View>
			{termsData.map((item) => (
				<View key={item.id} className="flex-row pr-2">
					<CustomCheckbox
						checked={checkedItems[item.id]}
						onChange={() => toggleCheckbox(item.id)}
						label={t(`auth.terms.${item.id}`)}
						className="py-2 px-5"
					/>
				</View>
			))}
			<CustomButton
				className="mt-auto mx-5 rounded-lg"
				onPress={handleSubmit}
				disabled={!isAllRequiredChecked}
				testID="next-button"
			>
				{t('common.next')}
			</CustomButton>
		</View>
	)
}

const termsData = [
	{
		id: 'ageVerification',
		required: true
	},
	{
		id: 'serviceAgreement',
		required: true
	},
	{
		id: 'privacyPolicy',
		required: true
	},
	{
		id: 'marketingAgreement',
		required: false
	}
] as const
