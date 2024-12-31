import { styled } from 'nativewind'
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Chip } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'
import { Tags } from '@/types'

interface EventTagsProps {
	tags: Tags
	style?: ViewStyle
}

function EventTags({ tags, style, ...props }: EventTagsProps) {
	const { colors, fonts } = useCustomTheme()

	return (
		<View className="flex-row flex-wrap gap-2" style={style} {...props}>
			{tags.map((tag) => (
				<Chip
					key={tag.id}
					style={[{ backgroundColor: colors.primary }, styles.chip]}
					textStyle={[
						fonts.body3Medium,
						{ color: colors.onBackground },
						styles.text
					]}
					compact
				>
					{tag.tag}
				</Chip>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	chip: { borderRadius: 4 },
	text: { marginHorizontal: 12, marginVertical: 8 }
})

export default styled(EventTags)
