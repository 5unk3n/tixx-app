import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View } from 'react-native'

import {
	DELETION_SURVEY_DATA,
	DeletionSurveyKeys
} from '@/constants/deletionSurvey'
import { UI } from '@/constants/ui'

import CustomButton from '../ui/input/CustomButton'
import CustomCheckbox from '../ui/input/CustomCheckbox'
import CustomTextInput from '../ui/input/CustomTextInput'

interface DeletionSurveyFormProps {
	onSubmit: () => void
	submitText: string
}

export default function DeletionSurveyForm({
	onSubmit,
	submitText
}: DeletionSurveyFormProps) {
	const navigation = useNavigation()

	const initialCheckedItems = DELETION_SURVEY_DATA.reduce(
		(acc, term) => ({ ...acc, [term.key]: false }),
		{} as Record<DeletionSurveyKeys, boolean>
	)
	const [checkedItems, setCheckedItems] = useState(initialCheckedItems)
	const toggleCheckbox = (key: DeletionSurveyKeys) => {
		setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
	}

	return (
		<>
			<View>
				{DELETION_SURVEY_DATA.map((item) => (
					<View
						key={item.key}
						className="flex-row justify-between items-center"
					>
						<CustomCheckbox
							checked={checkedItems[item.key]}
							onChange={() => toggleCheckbox(item.key)}
							label={item.label}
							iconPosition="right"
							className="w-full py-2"
						/>
					</View>
				))}
				{checkedItems.OTHER && (
					<CustomTextInput
						placeholder={UI.COMMON.ACCOUNT_DELETION_PLACEHOLDER}
						className="mt-4"
					/>
				)}
			</View>
			<View className="mt-auto flex-row mb-2">
				<CustomButton
					onPress={() => navigation.goBack()}
					className="flex-1 mr-3"
				>
					{UI.COMMON.CANCEL}
				</CustomButton>
				<CustomButton
					onPress={onSubmit}
					colorVariant="secondary"
					className="flex-1"
				>
					{submitText}
				</CustomButton>
			</View>
		</>
	)
}
