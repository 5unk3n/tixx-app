import React from 'react'
import { View } from 'react-native'

import EventList from '@/components/events/EventList'
import { CustomText } from '@/components/ui/display/CustomText'
import { useWishEvents } from '@/hooks/queries/events/useWishEvents'

export default function WishlistScreen() {
	const {
		data: events,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage
	} = useWishEvents()

	const flatListEvents = events.pages.flatMap((v) => v.items)

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	return (
		<View className="flex-1 px-4">
			{flatListEvents.length === 0 ? (
				<View className="flex-1 items-center justify-center">
					<CustomText variant="body1RegularLarge">
						위시리스트가 비어있습니다.
					</CustomText>
				</View>
			) : (
				<EventList
					events={flatListEvents}
					listOrientation="vertical"
					handleEndReached={handleEndReached}
					scrollEnabled={true}
					size="sm"
					hasSeparator={true}
					itemType={'list'}
				/>
			)}
		</View>
	)
}
