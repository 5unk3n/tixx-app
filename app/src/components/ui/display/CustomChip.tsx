import React from 'react'
import { StyleSheet } from 'react-native'
import { Chip, ChipProps } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface CustomChipProps extends ChipProps {}

export default function CustomChip({
	style,
	textStyle,
	...props
}: CustomChipProps) {
	const { colors, fonts } = useCustomTheme()

	return (
		<Chip
			{...props}
			style={[{ backgroundColor: colors.grayscale[700] }, styles.chip, style]}
			textStyle={[
				fonts.body3Medium,
				{ color: colors.onPrimary },
				styles.text,
				textStyle
			]}
			compact
		/>
	)
}

const styles = StyleSheet.create({
	chip: { borderRadius: 8 },
	text: { marginHorizontal: 12, marginVertical: 8 }
})
