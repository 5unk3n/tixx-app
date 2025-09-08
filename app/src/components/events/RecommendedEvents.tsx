import React, { useCallback } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { interpolate } from 'react-native-reanimated'
import Carousel, { TAnimationStyle } from 'react-native-reanimated-carousel'

import { POSTER_RATIO } from '@/constants/dimensions'
import { useRecommendedEvents } from '@/hooks/queries/events/useRecommendedEvents'

import MainEventCard from './MainEventCard'
import MainVenueCard from './MainVenueCard'

const CARD_WIDTH = Dimensions.get('window').width - 60
const CARD_HEIGHT = CARD_WIDTH / POSTER_RATIO

interface RecommendedEventsProps {
	isVenue?: boolean
	autoPlayInterval?: number
}

export default function RecommendedEvents({
	isVenue,
	autoPlayInterval = 5000
}: RecommendedEventsProps) {
	const { data: events, isPending, isError } = useRecommendedEvents({ isVenue })

	const animationStyle: TAnimationStyle = useCallback(
		(value: number, _index: number) => {
			'worklet'
			const translateX = interpolate(
				value,
				[-1, 0, 1],
				[-CARD_WIDTH + 30 - 14, 30, CARD_WIDTH + 30 + 14],
				'extend'
			)

			return {
				transform: [{ translateX }]
			}
		},
		[]
	)

	if (isPending || isError) {
		return null
	}

	const flatEvents = events.pages.flatMap((v) => v.items)

	if (flatEvents.length === 0) {
		return null
	}

	return (
		<Carousel
			data={flatEvents}
			loop={false}
			style={styles.carousel}
			renderItem={({ item }) =>
				isVenue ? (
					<MainVenueCard venue={item} />
				) : (
					<MainEventCard event={item} />
				)
			}
			customAnimation={animationStyle}
			width={CARD_WIDTH}
			height={CARD_HEIGHT}
			onConfigurePanGesture={(gesture) => gesture.activeOffsetX([-10, 10])}
			autoPlay
			autoPlayInterval={autoPlayInterval}
		/>
	)
}

const styles = StyleSheet.create({
	carousel: {
		width: '100%'
	}
})
