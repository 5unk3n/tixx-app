import React from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItemProps } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface CustomListItemProps extends ListItemProps {
	rightElement?: React.ReactNode
}

export default function CustomListItem({
	style,
	titleStyle,
	contentStyle,
	descriptionStyle,
	rightElement,
	...props
}: CustomListItemProps) {
	const { colors, fonts } = useCustomTheme()
	const rightProp = rightElement ? () => rightElement : props.right

	return (
		<List.Item
			{...props}
			style={[styles.container, style]}
			contentStyle={[styles.content, contentStyle]}
			titleStyle={[fonts.body1Medium, titleStyle]}
			descriptionStyle={[
				fonts.caption1Regular,
				{ color: colors.grayscale[400] },
				styles.description,
				descriptionStyle
			]}
			titleNumberOfLines={2}
			right={rightProp}
		/>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 6,
		paddingHorizontal: 20
	},
	content: {
		paddingLeft: 0
	},
	description: {
		marginTop: 8
	}
})
