import React from 'react'
import { StyleSheet, View } from 'react-native'
import LinearGradient, {
	LinearGradientProps
} from 'react-native-linear-gradient'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface GradientBorderViewProps extends LinearGradientProps {
	borderRadius: number
	borderWidth: number
}

export default function GradientBorderView({
	borderRadius,
	borderWidth,
	style,
	children,
	...props
}: GradientBorderViewProps) {
	const { colors } = useCustomTheme()
	const { backgroundColor, ...restStyle } = StyleSheet.flatten(style) || {}

	return (
		<LinearGradient {...props} style={[{ borderRadius }, restStyle]}>
			<View
				style={[
					styles.view,
					{
						borderRadius: borderRadius - borderWidth,
						margin: borderWidth,
						backgroundColor: backgroundColor || colors.background
					}
				]}
			>
				{children}
			</View>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	view: {
		overflow: 'hidden'
	}
})
