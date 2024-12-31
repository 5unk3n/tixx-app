import React, { useState } from 'react'
import { View } from 'react-native'

import { Event } from '@/types'

import { CustomText } from '../ui/display/CustomText'
import CustomIconButton from '../ui/input/CustomIconButton'

interface EventDetailProps {
	event: Event
}

export default function EventDetail({ event }: EventDetailProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<View className="pt-5 px-5 pb-[1] bg-grayscale-1 border-grayscale-2 border-[1px] rounded-xl">
			<CustomText
				variant="body1Regular"
				numberOfLines={isExpanded ? undefined : 5}
			>
				{event.description}
			</CustomText>
			<CustomIconButton
				name={isExpanded ? 'arrowUp' : 'arrowDown'}
				onPress={() => setIsExpanded(!isExpanded)}
				className="mx-auto"
			/>
		</View>
	)
}
