import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { useEvents } from '@/hooks/queries/events/useEvents'

import EventList from './EventList'
import VenueListItem from '../hosts/VenueListItem'

// const tabs = ['exhibition', 'concert', 'popup'] as const

interface TixxPickListProps {
	limit?: number
	isVenue?: boolean
	fetchNextEnabled?: boolean
	scrollEnabled?: boolean
}

export default function TixxPickList({
	limit,
	isVenue = false,
	fetchNextEnabled = true,
	scrollEnabled = true
}: TixxPickListProps) {
	// const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>(tabs[0])
	// const { t } = useTranslation()

	const {
		data: events,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	} = useEvents({ limit, isPicked: true, isVenue })

	const flatListEvents = events.pages.flatMap((v) => v.items)

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage && fetchNextEnabled) {
			fetchNextPage()
		}
	}

	return (
		<View>
			{/* TODO: 전시 등 다른 이벤트 종류 생기면 다시 추가 */}
			{/* <Tabs
				value={selectedTab}
				onChange={(value) => setSelectedTab(value)}
				type="dot"
			>
				{tabs.map((tab) => (
					<Tabs.Tab key={tab} value={tab} label={t(`events.tabs.${tab}`)} />
				))}
			</Tabs> */}
			<View className="mt-4">
				{isVenue ? (
					<FlatList
						keyExtractor={(item) => item.id.toString()}
						data={flatListEvents}
						renderItem={({ item }) => (
							<VenueListItem venue={item} type={'list'} />
						)}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.contentContainer}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
						scrollEnabled={scrollEnabled}
					/>
				) : (
					<EventList
						events={flatListEvents}
						listOrientation="horizontal"
						itemType="card"
						handleEndReached={handleEndReached}
						scrollEnabled={scrollEnabled}
					/>
				)}
			</View>
		</View>
	)
}

export const styles = StyleSheet.create({
	contentContainer: {
		gap: 16
	}
})
