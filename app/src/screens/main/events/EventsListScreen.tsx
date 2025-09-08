import { NativeStackScreenProps } from '@react-navigation/native-stack'
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
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import EmptyEvents from '@/components/events/EmptyEvents'
import EventList, { EventListProps } from '@/components/events/EventList'
import EventListItem from '@/components/events/EventListItem'
import VenueListItem from '@/components/hosts/VenueListItem'
import { CustomText } from '@/components/ui/display/CustomText'
import { useEvents } from '@/hooks/queries/events/useEvents'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'EventsList'>

const today = new Date()

const getWeekDays = (date: Date) => {
	const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // Monday
	const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
	return eachDayOfInterval({ start: weekStart, end: weekEnd })
}

export default function EventsListScreen({ route }: Props) {
	const { filter } = route.params
	const { i18n } = useTranslation()
	const [selectedDate, setSelectedDate] = useState(today)
	const week = useMemo(() => getWeekDays(today), [])

	const {
		data: events,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	} = useEvents(filter)

	const flatListEvents = events.pages.flatMap((v) => v.items)
	const filteredEvents = flatListEvents.filter((event) => {
		const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)
		return isSameDay(startDateTimeUTC, selectedDate)
	})

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
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

	const getEventListProps: () => Partial<EventListProps> = () => {
		if (filter.sort === 'this_week') {
			return { size: 'lg', itemType: 'list' }
		}
		return { size: 'md' }
	}

	return (
		<View className="flex-1">
			{filter.isVenue ? (
				<View className="px-4">
					<FlatList
						keyExtractor={(item) => item.id.toString()}
						data={flatListEvents}
						renderItem={({ item }) => (
							<VenueListItem venue={item} type={'list'} />
						)}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
						contentContainerStyle={styles.contentContainer}
					/>
				</View>
			) : filter.isPicked ? (
				<ScrollView contentContainerStyle={styles.scrollViewContainer}>
					<FlatList
						keyExtractor={(item) => item.id.toString()}
						data={flatListEvents.slice(0, 5)}
						renderItem={({ item }) => (
							<EventListItem event={item} type="card" />
						)}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.tixxPickFeaturedContentContainer}
					/>
					<FlatList
						keyExtractor={(item) => item.id.toString()}
						data={flatListEvents.slice(5)}
						renderItem={({ item }) => (
							<EventListItem event={item} type={'list'} />
						)}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.tixxPickContentContainer}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
						className="mt-6"
						scrollEnabled={false}
					/>
				</ScrollView>
			) : (
				<View className="px-4">
					{filter.sort === 'this_week' && (
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
						events={
							filter.sort === 'this_week' ? filteredEvents : flatListEvents
						}
						listOrientation="vertical"
						handleEndReached={handleEndReached}
						scrollEnabled={true}
						itemType={'list'}
						hasSeparator
						ListEmptyComponent={
							<View className="mt-[95px]">
								<EmptyEvents />
							</View>
						}
						{...getEventListProps()}
					/>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	contentContainer: {
		gap: 16,
		paddingTop: 16
	},
	tixxPickFeaturedContentContainer: {
		gap: 16
	},
	tixxPickContentContainer: {
		gap: 24
	},
	scrollViewContainer: {
		paddingTop: 16,
		paddingHorizontal: 16
	}
})
