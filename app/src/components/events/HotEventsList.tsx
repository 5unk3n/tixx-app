import React from 'react'

import { usePopularEvents } from '@/hooks/queries/events/usePopularEvents'

import EventList from './EventList'

interface HotEventsListProps {
	limit?: number
	fetchNextEnabled?: boolean
	scrollEnabled?: boolean
	isDetailed?: boolean
}

export default function HotEventsList({
	limit,
	fetchNextEnabled = true,
	scrollEnabled = true,
	isDetailed = false
}: HotEventsListProps) {
	const {
		data: events,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	} = usePopularEvents({ limit })

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
			size={isDetailed ? 'sm' : 'md'}
			hasSeparator={isDetailed}
		/>
	)
}
