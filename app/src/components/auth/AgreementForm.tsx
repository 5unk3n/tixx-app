import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View } from 'react-native'

import { TERMS_DATA, TermsKey } from '@/constants/terms'
import { UI } from '@/constants/ui'
import { useSignUpStore } from '@/stores/signUpStore'

import CustomButton from '../ui/input/CustomButton'
import CustomCheckbox from '../ui/input/CustomCheckbox'

export default function AgreementForm() {
	const setOAuthData = useSignUpStore((state) => state.setOAuthData)
	const navigation = useNavigation()

	const initialCheckedItems = TERMS_DATA.reduce(
		(acc, term) => ({ ...acc, [term.key]: false }),
		{} as Record<TermsKey, boolean>
	)
	const [checkedItems, setCheckedItems] = useState(initialCheckedItems)
	const isAllChecked = Object.values(checkedItems).every(Boolean)
	const isAllRequiredChecked = TERMS_DATA.filter((item) => item.required).every(
		(item) => checkedItems[item.key]
	)

	const toggleCheckbox = (key: TermsKey) => {
		setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
	}

	const toggleAllCheckboxes = () => {
		const newValue = !isAllChecked
		setCheckedItems(
			Object.keys(checkedItems).reduce(
				(acc, key) => ({
					...acc,
					[key]: newValue
				}),
				{} as Record<TermsKey, boolean>
			)
		)
	}

	const handleSubmit = () => {
		const marketingOptIn = checkedItems.MARKETING_AGREEMENT ? 1 : 0
		setOAuthData({ marketingOptIn })
		navigation.navigate('VerifyIdentity', { mode: 'signUp' })
	}

	return (
		<View className="flex-1">
			<CustomCheckbox
				checked={isAllChecked}
				onChange={toggleAllCheckboxes}
				label="약관 전체 동의"
				labelSize="lg"
				iconType="square"
				className="mb-1 py-2 px-5"
			/>
			{TERMS_DATA.map((item) => (
				<View key={item.key} className="flex-row">
					<CustomCheckbox
						checked={checkedItems[item.key]}
						onChange={() => toggleCheckbox(item.key)}
						label={item.label}
						className="py-2 px-5"
					/>
				</View>
			))}
			<CustomButton
				mode="contained"
				className="mt-auto mx-5 rounded-lg"
				onPress={handleSubmit}
				disabled={!isAllRequiredChecked}
			>
				{UI.COMMON.NEXT}
			</CustomButton>
		</View>
	)
}
