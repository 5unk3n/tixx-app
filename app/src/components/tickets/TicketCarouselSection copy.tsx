import { useFocusEffect } from '@react-navigation/native'
import { format } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming
} from 'react-native-reanimated'

import { useEventTickets } from '@/hooks/queries/eventTickets/useEventTickets'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import EmptyTickets from './EmptyTickets'
import TicketCarousel from './TicketCarousel'
import TicketSectionHeader from './TicketSectionHeader'

const DURATION = 400
const SWIPE_THRESHOLD = 200
const SPRING_CONFIG = {
	damping: 20,
	stiffness: 200,
	mass: 0.5
}

export default function TicketCarouselSection() {
	const { data: eventTickets, refetch } = useEventTickets(['available'])

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, [refetch])
	)

	const ticketSectionsMap = eventTickets.reduce((acc, eventTicket) => {
		const date = new Date(eventTicket.ticket.startAt)
		const formattedDate = format(date, 'yyyyMMdd')

		if (!acc.has(formattedDate)) {
			acc.set(formattedDate, [])
		}

		acc.get(formattedDate).push(eventTicket)

		return acc
	}, new Map())

	const ticketSections = Array.from(ticketSectionsMap, ([date, tickets]) => ({
		date,
		tickets
	})).sort((a, b) => Number(a.date) - Number(b.date))

	const { colors } = useCustomTheme()
	const [sectionHeight, setSectionHeight] = useState(1000)
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
	const [currentCardIndex, setCurrentCardIndex] = useState(0)
	const currentSection = ticketSections[currentSectionIndex]
	const currentSectionLength = currentSection?.tickets.length
	const currentSectionY = currentSectionIndex * -sectionHeight
	const currentCardY = currentCardIndex * -SWIPE_THRESHOLD

	const sectionTranslateY = useSharedValue(0)
	const cardTranslateY = useSharedValue(0)

	const moveToPrevSection = useCallback(() => {
		if (currentSectionIndex > 0) {
			const nextIndex = currentSectionIndex - 1

			cardTranslateY.value = 0
			sectionTranslateY.value = withTiming(
				-nextIndex * sectionHeight,
				{ duration: DURATION },
				() => {
					runOnJS(setCurrentSectionIndex)(nextIndex)
					runOnJS(setCurrentCardIndex)(0)
				}
			)
		} else {
			sectionTranslateY.value = withTiming(currentSectionY, {
				duration: DURATION
			})
		}
	}, [
		cardTranslateY,
		currentSectionIndex,
		currentSectionY,
		sectionHeight,
		sectionTranslateY
	])

	const moveToNextSection = useCallback(() => {
		if (currentSectionIndex < ticketSections.length - 1) {
			const nextIndex = currentSectionIndex + 1

			cardTranslateY.value = 0
			sectionTranslateY.value = withTiming(
				-nextIndex * sectionHeight,
				{ duration: DURATION },
				() => {
					runOnJS(setCurrentSectionIndex)(nextIndex)
					runOnJS(setCurrentCardIndex)(0)
				}
			)
		} else {
			sectionTranslateY.value = withTiming(currentSectionY, {
				duration: DURATION
			})
		}
	}, [
		cardTranslateY,
		currentSectionIndex,
		currentSectionY,
		sectionHeight,
		sectionTranslateY,
		ticketSections.length
	])

	const moveToPrevCard = useCallback(
		(velocity: number) => {
			const targetValue = 200
			cardTranslateY.value = withSpring(
				currentCardIndex * -SWIPE_THRESHOLD + targetValue,
				{
					...SPRING_CONFIG,
					velocity
				},
				() => {
					runOnJS(setCurrentCardIndex)(currentCardIndex - 1)
				}
			)
		},
		[cardTranslateY, currentCardIndex]
	)

	const moveToNextCard = useCallback(
		(velocity: number) => {
			const targetValue = -200
			cardTranslateY.value = withSpring(
				currentCardIndex * -SWIPE_THRESHOLD + targetValue,
				{
					...SPRING_CONFIG,
					velocity
				},
				() => {
					runOnJS(setCurrentCardIndex)(currentCardIndex + 1)
				}
			)
		},
		[cardTranslateY, currentCardIndex]
	)

	const gesture = Gesture.Pan()
		.onUpdate((event) => {
			const { translationY } = event

			if (
				(currentCardIndex === 0 && translationY > 0) ||
				(currentCardIndex === currentSectionLength - 1 && translationY < 0)
			) {
				sectionTranslateY.value = currentSectionY + translationY
			} else {
				cardTranslateY.value = Math.max(
					Math.min(currentCardY + translationY, currentCardY + 200),
					currentCardY - 200
				)
			}
		})
		.onEnd((event) => {
			const { translationY, velocityY } = event

			if (
				Math.abs(translationY) > SWIPE_THRESHOLD ||
				Math.abs(velocityY) > 500
			) {
				if (currentSectionY === sectionTranslateY.value) {
					if (translationY > 0) {
						runOnJS(moveToPrevCard)(velocityY)
					} else {
						runOnJS(moveToNextCard)(velocityY)
					}
				} else {
					if (translationY > 0) {
						runOnJS(moveToPrevSection)()
					} else {
						runOnJS(moveToNextSection)()
					}
				}
			} else {
				sectionTranslateY.value = withTiming(currentSectionY, {
					duration: DURATION
				})
				cardTranslateY.value = withTiming(currentCardY, {
					duration: DURATION
				})
			}
		})

	const sectionAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: sectionTranslateY.value
				}
			]
		}
	})

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View className="flex-1 px-5">
				{ticketSections.length ? (
					ticketSections.map(({ date, tickets }, sectionIndex) => {
						return (
							<Animated.View
								key={date}
								className="pt-6 mb-3"
								style={sectionAnimatedStyle}
							>
								<TicketSectionHeader date={date} eventTickets={tickets} />
								<TicketCarousel
									tickets={tickets}
									cardStackY={cardTranslateY}
									sectionIndex={sectionIndex}
									currentSectionIndex={currentSectionIndex}
									onLayout={(e) => {
										setSectionHeight(e.nativeEvent.layout.height + 32 + 52) // 캐러셀 + 헤더 + 마진
									}}
								/>
							</Animated.View>
						)
					})
				) : (
					<EmptyTickets />
				)}
				<LinearGradient
					colors={['#12121200', colors.background, colors.background]}
					locations={[0, 0.63, 1]}
					className="absolute bottom-0 left-0 right-0 h-32"
					pointerEvents="none"
				/>
			</Animated.View>
		</GestureDetector>
	)
}
