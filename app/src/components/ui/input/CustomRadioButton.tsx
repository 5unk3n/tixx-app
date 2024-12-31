import { styled } from 'nativewind'
import React, { createContext, useContext, ReactNode } from 'react'
import { View, ViewStyle, TextStyle } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

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

interface RadioButtonProps {
	value: string
	label: string
	style?: ViewStyle
	textStyle?: TextStyle
}

function RadioButton({ value, label, style, textStyle }: RadioButtonProps) {
	const context = useContext(RadioGroupContext)
	if (!context) {
		throw new Error('RadioButton must be used within a RadioGroup')
	}

	const { value: groupValue, onChange } = context
	const isSelected = value === groupValue

	return (
		<TouchableRipple onPress={() => onChange(value)}>
			<View className="flex-row px-7 py-3" style={style}>
				<CustomText
					className="flex-1"
					variant="headline2MediumLarge"
					style={textStyle}
				>
					{label}
				</CustomText>
				<CustomIcon
					name={
						isSelected ? 'checkboxMinimalChecked' : 'checkboxMinimalUnchecked'
					}
				/>
			</View>
		</TouchableRipple>
	)
}

export const CustomRadioButton = {
	Group: RadioGroup,
	Button: styled(RadioButton, { props: { textStyle: true } })
}
