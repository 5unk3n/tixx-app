import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonProps } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'
import { FontType } from '@/theme/defaultTheme'

export interface CustomButtonProps extends ButtonProps {
	size?: 'sm' | 'lg'
	colorVariant?: 'primary' | 'secondary'
	labelVariant?: FontType
	flex?: boolean // 테일윈드로 flex 속성이 안 먹힘
}

export default function CustomButton({
	mode = 'contained',
	size = 'lg',
	style,
	labelStyle,
	disabled,
	colorVariant = 'primary',
	labelVariant,
	flex = false,
	...props
}: CustomButtonProps) {
	const { colors, fonts } = useCustomTheme()

	const containerStyles = [
		styles.baseContainer,
		size === 'sm' && styles.smContainer,
		colorVariant === 'secondary' && { backgroundColor: colors.secondary },
		disabled && size === 'sm' && { backgroundColor: colors.point[1] },
		flex && { flex: 1 },
		style
	]

	const labelStyles = [
		styles.baseLabel,
		size === 'lg'
			? [styles.lgLabel, fonts.body1Medium]
			: [styles.smLabel, fonts.body3Medium],
		disabled &&
			size === 'sm' && {
				backgroundColor: colors.point[1],
				color: colors.grayscale[6]
			},
		colorVariant === 'secondary' && { color: colors.onSecondary },
		labelVariant && fonts[labelVariant],
		labelStyle
	]

	return (
		<Button
			mode={mode}
			style={containerStyles}
			labelStyle={labelStyles}
			disabled={disabled}
			theme={mode === 'text' ? { colors: { primary: colors.onPrimary } } : {}}
			{...props}
		/>
	)
}

const styles = StyleSheet.create({
	baseContainer: {
		minWidth: 0,
		borderRadius: 8
	},
	smContainer: {
		alignSelf: 'flex-start'
	},
	baseLabel: {
		marginVertical: 0,
		marginHorizontal: 0
	},
	lgLabel: {
		marginVertical: 18,
		marginHorizontal: 22
	},
	smLabel: {
		marginVertical: 8,
		marginHorizontal: 12
	}
})
