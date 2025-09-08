import {
	eachDayOfInterval,
	endOfWeek,
	format,
	isSameDay,
	isToday,
	parseISO,
	startOfWeek
} from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useThisWeekEvents } from '@/hooks/queries/events/useThisWeekEvents'

import EmptyEvents from './EmptyEvents'
import EventList from './EventList'
import { CustomText } from '../ui/display/CustomText'

interface ThisWeekEvensListProps {
	limit?: number
	fetchNextEnabled?: boolean
	scrollEnabled?: boolean
	isDetailed?: boolean
}

const getWeekDays = (date: Date) => {
	const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // Monday
	const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
	return eachDayOfInterval({ start: weekStart, end: weekEnd })
}

const today = new Date()

export default function ThisWeekEvensList({
	limit = 5,
	fetchNextEnabled = true,
	scrollEnabled = true,
	isDetailed = false
}: ThisWeekEvensListProps) {
	const { i18n } = useTranslation()

	const {
		data: events,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useThisWeekEvents({ limit })

	const week = useMemo(() => getWeekDays(today), [])
	const [selectedDate, setSelectedDate] = useState(today)

	const flatListEvents = events.pages.flatMap((v) => v.items)
	const filteredEvents = flatListEvents.filter((event) => {
		const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)
		return isSameDay(startDateTimeUTC, selectedDate)
	})

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage && fetchNextEnabled) {
			fetchNextPage()
		}
	}

	const renderDate = ({ item }: { item: Date }) => {
		const date = isToday(item)
			? format(item, 'd')
			: format(item, 'd (E)', {
					locale: i18n.language === 'ko' ? ko : enUS
				})
		const isSelected = isSameDay(item, selectedDate)

		return (
			<TouchableRipple
				onPress={() => setSelectedDate(item)}
				className="rounded-lg"
				borderless
			>
				<View className={`p-2 rounded-lg ${isSelected ? 'bg-primary' : ''}`}>
					<CustomText
						variant="body3Medium"
						className={isSelected ? 'text-grayscale-900' : 'text-grayscale-500'}
					>
						{date}
					</CustomText>
				</View>
			</TouchableRipple>
		)
	}

	return (
		<View className={isDetailed ? 'flex-1' : ''}>
			{isDetailed && (
				<View className="mt-2 mb-4">
					<FlatList
						keyExtractor={(item) => item.toISOString()}
						data={week}
						renderItem={renderDate}
						horizontal
						contentContainerStyle={styles.contentContainer}
						showsHorizontalScrollIndicator={false}
					/>
				</View>
			)}
			<EventList
				events={isDetailed ? filteredEvents : flatListEvents}
				listOrientation={isDetailed ? 'vertical' : 'horizontal'}
				handleEndReached={handleEndReached}
				scrollEnabled={scrollEnabled}
				itemType={isDetailed ? 'list' : 'card'}
				size={isDetailed ? 'lg' : 'sm'}
				ListEmptyComponent={
					isDetailed ? (
						<View className="mt-[95px]">
							<EmptyEvents />
						</View>
					) : null
				}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	contentContainer: {
		gap: 12
	}
})
