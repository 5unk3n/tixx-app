import { styled } from 'nativewind'
import React, { createContext, useContext, ReactNode } from 'react'
import { View, ViewStyle, TextStyle } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomIcon from '../display/CustomIcon'
import { CustomText } from '../display/CustomText'

interface RadioGroupContextType {
	value: string
	onChange: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null)

interface RadioGroupProps extends RadioGroupContextType {
	style?: ViewStyle
	children: ReactNode
}

function RadioGroup({ children, value, onChange, style }: RadioGroupProps) {
	return (
		<RadioGroupContext.Provider value={{ value, onChange }}>
			<View style={style}>{children}</View>
		</RadioGroupContext.Provider>
	)
}

const iconMap = {
	minimalChecked: 'checkboxMinimalChecked',
	minimalUnchecked: 'checkboxMinimalUnchecked',
	roundedChecked: 'radioCheckedPrimary',
	roundedUnchecked: 'radioUncheckedPrimary'
} as const

interface RadioButtonProps {
	value: string
	label: string
	iconType?: 'minimal' | 'rounded'
	style?: ViewStyle
	textStyle?: TextStyle
}

function RadioButton({
	value,
	label,
	iconType = 'minimal',
	style,
	textStyle
}: RadioButtonProps) {
	const { colors } = useCustomTheme()
	const context = useContext(RadioGroupContext)
	if (!context) {
		throw new Error('RadioButton must be used within a RadioGroup')
	}

	const { value: groupValue, onChange } = context
	const isSelected = value === groupValue

	return (
		<TouchableRipple
			onPress={() => onChange(value)}
			rippleColor={'transparent'}
		>
			<View
				className={`flex-row ${iconType === 'rounded' ? 'p-1' : 'px-7 py-3'}`}
				style={style}
			>
				<CustomText
					className="flex-1"
					variant="headline2MediumLarge"
					style={textStyle}
				>
					{label}
				</CustomText>
				<CustomIcon
					name={
						iconType === 'minimal'
							? isSelected
								? iconMap.minimalChecked
								: iconMap.minimalUnchecked
							: isSelected
								? iconMap.roundedChecked
								: iconMap.roundedUnchecked
					}
					color={colors.primary}
				/>
			</View>
		</TouchableRipple>
	)
}

export const CustomRadioButton = {
	Group: RadioGroup,
	Button: styled(RadioButton, { props: { textStyle: true } })
}
