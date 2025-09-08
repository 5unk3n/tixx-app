import { styled } from 'nativewind'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import { useCustomTheme } from '@/hooks/useCustomTheme'
import { Tags } from '@/types'

import CustomChip from '../ui/display/CustomChip'

interface EventTagsProps {
	tags: Tags
	style?: ViewStyle
	additionalTags?: string[]
}

function EventTags({ tags, style, additionalTags, ...props }: EventTagsProps) {
	const { t } = useTranslation()
	const { colors } = useCustomTheme()

	return (
		<View className="flex-row flex-wrap gap-2" style={style} {...props}>
			{tags.map((tag) => (
				<View key={tag.id}>
					<CustomChip>
						{tag.tag === 'venue'
							? t('events.tags.venue')
							: tag.tag === 'party'
								? t('events.tags.party')
								: tag.tag === 'event'
									? t('events.tags.event')
									: tag.tag}
					</CustomChip>
				</View>
			))}
			{additionalTags?.map((tag) => (
				<View key={tag}>
					<CustomChip textStyle={{ color: colors.primary }}>{tag}</CustomChip>
				</View>
			))}
		</View>
	)
}

export default styled(EventTags)
