import React from 'react'
import { Dimensions, View } from 'react-native'
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle
} from 'react-native-reanimated'

import { GroupedEventTicket } from '@/types'

import GroupedTicketCard from './GroupedTicketCard'

interface TicketCarouselProps {
	tickets: GroupedEventTicket[]
	cardStackY: SharedValue<number>
	sectionIndex: number
	currentSectionIndex: number
	onLayout?: (event: any) => void
}
const { width } = Dimensions.get('window')
const CAROUSEL_HEIGHT = Math.round((width - 40) * (364 / 350) + 173)

export default function TicketCarousel({
	tickets,
	cardStackY,
	sectionIndex,
	currentSectionIndex,
	onLayout
}: TicketCarouselProps) {
	return (
		<View style={{ height: CAROUSEL_HEIGHT }} onLayout={onLayout}>
			{sectionIndex === currentSectionIndex ? (
				tickets.map((ticket, index) => (
					<AnimatedCard
						key={ticket.id}
						ticket={ticket}
						cardStackY={cardStackY}
						index={index}
					/>
				))
			) : (
				<GroupedTicketCard groupedTicket={tickets[0]} hasActions />
			)}
		</View>
	)
}

interface AnimatedCardProps {
	ticket: GroupedEventTicket
	cardStackY: SharedValue<number>
	index: number
}

const AnimatedCard = ({ ticket, cardStackY, index }: AnimatedCardProps) => {
	const cardAnimatedStyle = useAnimatedStyle(() => {
		let scale = 1
		let translateY = 0
		let opacity = 0
		let zIndex = -index

		translateY = interpolate(
			cardStackY.value + index * 200,
			[-200, 0, 200, 400],
			[-200, 0, 20, 40],
			'clamp'
		)
		scale = interpolate(
			translateY,
			[-200, 0, 20, 40],
			[1.05, 1, 0.95, 0.9],
			'clamp'
		)
		opacity = interpolate(translateY, [-200, -100], [0, 1], 'clamp')

		return {
			transform: [{ scale }, { translateY }],
			opacity,
			zIndex,
			display: opacity === 0 ? 'none' : 'flex'
		}
	})

	return (
		<Animated.View className="absolute w-full" style={[cardAnimatedStyle]}>
			<GroupedTicketCard
				key={ticket.id}
				groupedTicket={ticket}
				style={{}}
				hasActions
			/>
		</Animated.View>
	)
}
