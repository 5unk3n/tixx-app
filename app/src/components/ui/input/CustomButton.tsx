import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonProps } from 'react-native-paper'
import { ThemeProp } from 'react-native-paper/lib/typescript/types'

import { useCustomTheme } from '@/hooks/useCustomTheme'
import { FontType } from '@/theme/defaultTheme'

export interface CustomButtonProps extends ButtonProps {
	size?: 'sm' | 'md' | 'lg'
	colorVariant?: 'primary' | 'secondary'
	labelVariant?: FontType
	flex?: boolean // 테일윈드로 flex 속성이 안 먹힘
}

export default function CustomButton({
	mode = 'outlined',
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
		mode === 'outlined' && {
			backgroundColor: colors.grayscale[800]
		},
		size === 'md'
			? styles.mdContainer
			: size === 'sm'
				? styles.smContainer
				: styles.baseContainer,
		colorVariant === 'secondary' && {
			backgroundColor: colors.secondary,
			borderWidth: 0
		},
		disabled &&
			size === 'sm' && { backgroundColor: colors.point[900], borderWidth: 0 },
		disabled &&
			mode === 'outlined' && {
				backgroundColor: colors.grayscale[700]
			},
		flex && { flex: 1 },
		style
	]

	const labelStyles = [
		styles.baseLabel,
		size === 'lg'
			? [styles.lgLabel, fonts.body1Medium]
			: [styles.smLabel, fonts.body3Medium],
		colorVariant === 'secondary' && { color: colors.onSecondary },
		disabled &&
			size === 'sm' && {
				backgroundColor: colors.point[900],
				color: colors.grayscale[700]
			},
		labelVariant && fonts[labelVariant],
		labelStyle
	]

	const getThemes = (): ThemeProp => {
		switch (mode) {
			case 'contained':
				return {
					colors: { onPrimary: colors.grayscale[900] }
				}
			case 'outlined':
				return {
					colors: {
						primary: colors.grayscale[0],
						outline: colors.primary
					}
				}
			case 'text':
				return { colors: { primary: colors.onPrimary } }
			default:
				return {}
		}
	}

	return (
		<Button
			mode={mode}
			style={containerStyles}
			contentStyle={styles.baseContent}
			labelStyle={labelStyles}
			disabled={disabled}
			theme={getThemes()}
			{...props}
		/>
	)
}

const styles = StyleSheet.create({
	baseContainer: {
		height: 56,
		minWidth: 0,
		borderRadius: 8
	},
	mdContainer: {
		height: 48
	},
	smContainer: {
		height: 32,
		alignSelf: 'flex-start'
	},
	baseContent: {
		height: '100%'
	},
	baseLabel: {
		marginVertical: 0,
		marginHorizontal: 0
	},
	lgLabel: {
		marginHorizontal: 22
	},
	smLabel: {
		marginVertical: 8,
		marginHorizontal: 12
	}
})
