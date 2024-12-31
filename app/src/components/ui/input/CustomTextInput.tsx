import React, { useRef } from 'react'
import {
	Pressable,
	TextInput,
	StyleSheet,
	View,
	TextInputProps
} from 'react-native'
import { HelperText } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

import { CustomText } from '../display/CustomText'

interface CustomTextInputProps extends TextInputProps {
	className?: string
	label?: string
	style?: any
	errorMessage?: string
	disabled?: boolean
	right?: JSX.Element
}

export default function CustomTextInput({
	style,
	label,
	errorMessage,
	right,
	disabled,
	numberOfLines,
	...props
}: CustomTextInputProps) {
	const ref = useRef<TextInput>(null)
	const { colors, fonts } = useCustomTheme()

	return (
		<View style={style}>
			{label && (
				<Pressable className="pl-2 pb-2" onPress={() => ref.current?.focus()}>
					<CustomText variant="caption1Regular" className="text-grayscale-4">
						{label}
					</CustomText>
				</Pressable>
			)}
			<View
				className={`${numberOfLines ? 'h-full' : 'h-12'} flex-row bg-surfaceVariant rounded-lg`}
			>
				<TextInput
					className={`flex-1 px-5 font-medium text-base leading-md tracking-tight ${disabled ? 'text-grayscale-5' : 'text-onPrimary'} ${numberOfLines ? 'py-4' : 'py-2'}`}
					placeholderTextColor={colors.grayscale[3]}
					editable={!disabled}
					numberOfLines={numberOfLines}
					{...props}
				/>
				{right && (
					<View className="grow-0 items-center justify-center py-2 px-2">
						{right}
					</View>
				)}
			</View>
			<HelperText
				type="error"
				visible={!!errorMessage}
				style={[styles.text, fonts.caption1Regular, { color: colors.error }]}
			>
				{errorMessage}
			</HelperText>
		</View>
	)
}

const styles = StyleSheet.create({
	text: {
		textAlign: 'right',
		position: 'absolute',
		paddingHorizontal: 8,
		paddingVertical: 0,
		right: 0,
		bottom: -27
	}
})
