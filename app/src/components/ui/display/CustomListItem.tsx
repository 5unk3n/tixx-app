import React from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItemProps } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface CustomListItemProps extends ListItemProps {}

export default function CustomListItem({
	style,
	titleStyle,
	contentStyle,
	descriptionStyle,
	...props
}: CustomListItemProps) {
	const { colors, fonts } = useCustomTheme()

	return (
		<List.Item
			{...props}
			style={[styles.container, style]}
			contentStyle={[styles.content, contentStyle]}
			titleStyle={[fonts.body1Medium, titleStyle]}
			descriptionStyle={[
				fonts.caption1Regular,
				{ color: colors.grayscale[5] },
				styles.description,
				descriptionStyle
			]}
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
