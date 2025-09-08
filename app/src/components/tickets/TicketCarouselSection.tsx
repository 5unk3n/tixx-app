import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { interpolate, useSharedValue } from 'react-native-reanimated'
import Carousel, {
	ICarouselInstance,
	Pagination,
	TAnimationStyle
} from 'react-native-reanimated-carousel'

import { TAB_BAR_HEIGHT, POSTER_RATIO } from '@/constants/dimensions'
import { useEventTickets } from '@/hooks/queries/eventTickets/useEventTickets'

import EmptyTickets from './EmptyTickets'
import GroupedTicketCard from './GroupedTicketCard'

const TICKET_CONTENTS_HEIGHT = 133
const TICKET_MARGIN = 20
const PAGINATION_HEIGHT = 20

export default function TicketCarouselSection() {
	const [parentSize, setParentSize] = useState({ width: 0, height: 0 })
	const { data: eventTickets, refetch } = useEventTickets(['available'])
	const ref = useRef<ICarouselInstance>(null)
	const progress = useSharedValue(0)
	const isOverHeight =
		(parentSize.width - TICKET_MARGIN * 2) / POSTER_RATIO +
			TICKET_CONTENTS_HEIGHT >
		parentSize.height - (TAB_BAR_HEIGHT + PAGINATION_HEIGHT)
	const maxCardWidth = isOverHeight
		? (parentSize.height -
				(TAB_BAR_HEIGHT + PAGINATION_HEIGHT) -
				TICKET_MARGIN -
				36 -
				TICKET_CONTENTS_HEIGHT) *
			POSTER_RATIO
		: parentSize.width - TICKET_MARGIN * 2
	const cardHeight =
		(maxCardWidth - TICKET_CONTENTS_HEIGHT) / POSTER_RATIO +
		TICKET_CONTENTS_HEIGHT

	// 부모 크기를 측정하는 함수
	const handleLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout
		setParentSize({ width, height })
	}

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			/**
			 * Calculate the difference between the current index and the target index
			 * to ensure that the carousel scrolls to the nearest index
			 */
			count: index - progress.value,
			animated: true
		})
	}

	const animationStyle: TAnimationStyle = React.useCallback(
		(value: number, _index: number) => {
			'worklet'
			const zIndex = interpolate(value, [-1, 0, 1], [30, 20, 10])
			const scale = interpolate(
				value,
				[-1, 0, 1, 2],
				[1.05, 1, 0.95, 0.9],
				'clamp'
			)
			const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 1])
			const translateY = interpolate(
				value,
				[-1, 0, 1, 2],
				[-200, 0, 12 + (cardHeight * 0.05) / 2, 24 + (cardHeight * 0.1) / 2],
				'clamp'
			)

			return {
				transform: [{ scale }, { translateY }],
				zIndex,
				opacity,
				display: value <= -0.9 ? 'none' : 'block'
			}
		},
		[cardHeight]
	)

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, [refetch])
	)

	const dynamicStyles = StyleSheet.create({
		groupedTicketCard: {
			width: maxCardWidth,
			marginTop: 20,
			marginHorizontal: 'auto'
		}
	})

	return (
		<View className="flex-1" onLayout={handleLayout} testID="carousel-section">
			{eventTickets.length && parentSize.height ? (
				<Carousel
					ref={ref}
					loop={false}
					width={parentSize.width}
					height={parentSize.height - 80}
					vertical={true}
					onProgressChange={progress}
					data={eventTickets}
					renderItem={({ item }) => {
						return (
							<GroupedTicketCard
								groupedTicket={item}
								hasActions
								style={dynamicStyles.groupedTicketCard}
							/>
						)
					}}
					style={styles.carousel}
					customAnimation={animationStyle}
					testID="carousel"
				/>
			) : (
				<EmptyTickets />
			)}
			<Pagination.Basic
				progress={progress}
				data={eventTickets}
				dotStyle={styles.paginationDot}
				activeDotStyle={styles.paginationActiveDot}
				containerStyle={styles.paginationContainer}
				onPress={onPressPagination}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	carousel: {
		width: '100%'
	},
	paginationContainer: {
		gap: 5,
		marginBottom: 10,
		height: 20,
		alignItems: 'center'
	},
	paginationActiveDot: { backgroundColor: '#f1f1f1' },
	paginationDot: { backgroundColor: '#262626', borderRadius: 100 }
})
