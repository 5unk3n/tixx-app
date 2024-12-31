import React from 'react'
import { View, ViewProps } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import CustomIcon from '../display/CustomIcon'
import { CustomText } from '../display/CustomText'

interface CustomCheckboxProps extends ViewProps {
	checked: boolean
	label: string
	onChange: (checked: boolean) => void
	labelSize?: 'md' | 'lg'
	iconType?: 'square' | 'minimal'
	iconPosition?: 'left' | 'right'
}

export default function CustomCheckbox({
	checked,
	label,
	onChange,
	labelSize = 'md',
	iconType = 'minimal',
	iconPosition = 'left',
	...props
}: CustomCheckboxProps) {
	const iconPrefix =
		iconType === 'square' ? 'checkboxSquare' : 'checkboxMinimal'
	const iconSuffix = checked ? 'Checked' : 'Unchecked'

	return (
		<TouchableRipple onPress={() => onChange(!checked)} className="w-full">
			<View
				className={`${iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse justify-between'} items-center`}
				{...props}
			>
				<CustomIcon
					name={`${iconPrefix}${iconSuffix}`}
					className={`${iconPosition === 'left' ? `mr-4` : 'ml-auto'}`}
				/>
				<CustomText
					variant={labelSize === 'lg' ? 'headline1Semibold' : 'body1Medium'}
					className="text-grayscale-5"
				>
					{label}
				</CustomText>
			</View>
		</TouchableRipple>
	)
}
