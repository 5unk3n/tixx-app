import React from 'react'
import { View } from 'react-native'

import { useTodayEvents } from '@/hooks/queries/events/useTodayEvents'

import EmptyEvents from './EmptyEvents'
import EventList from './EventList'

interface ThisWeekEvensListProps {
	limit?: number
	fetchNextEnabled?: boolean
	scrollEnabled?: boolean
}

export default function TodayEventsList({
	limit = 5,
	fetchNextEnabled = true,
	scrollEnabled = true
}: ThisWeekEvensListProps) {
	const {
		data: events,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useTodayEvents({ limit })

	const flatListEvents = events.pages.flatMap((v) => v.items)

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage && fetchNextEnabled) {
			fetchNextPage()
		}
	}

	return (
		<EventList
			events={flatListEvents}
			listOrientation={'vertical'}
			handleEndReached={handleEndReached}
			scrollEnabled={scrollEnabled}
			itemType={'list'}
			size={'lg'}
			ListEmptyComponent={
				<View className="mt-[60px]">
					<EmptyEvents />
				</View>
			}
		/>
	)
}
