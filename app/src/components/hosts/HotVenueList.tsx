import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'

import { useVenues } from '@/hooks/queries/hosts/useVenues'

import VenueListItem from './VenueListItem'

interface HotVenueListProps {
	limit?: number
	isDetailed?: boolean
}

export default function HotVenueList({
	limit = 5,
	isDetailed = false
}: HotVenueListProps) {
	const firstOffset = useSharedValue(16)
	const secondOffset = useSharedValue(147)

	const {
		data: venues,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	} = useVenues({ sort: 'popular', limit })

	const flatListVenues = venues.pages.flatMap((v) => v.items)

	const firstLineVenues = flatListVenues.slice(0, flatListVenues.length / 2)
	const secondLineVenues = flatListVenues.slice(
		flatListVenues.length / 2,
		flatListVenues.length
	)

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	return (
		<View>
			{isDetailed ? (
				<FlatList
					testID="hot-venue-flat-list"
					keyExtractor={(item) => item.id.toString()}
					data={flatListVenues}
					renderItem={({ item }) => (
						<VenueListItem venue={item} type={'list'} />
					)}
					onEndReached={handleEndReached}
					contentContainerStyle={styles.contentContainer}
				/>
			) : (
				<>
					<Carousel
						data={firstLineVenues}
						loop={true}
						pagingEnabled={false}
						snapEnabled={false}
						style={styles.carousel}
						defaultScrollOffsetValue={firstOffset}
						renderItem={({ item }) => (
							<View className="mr-2">
								<VenueListItem
									venue={item}
									type={isDetailed ? 'list' : 'card'}
								/>
							</View>
						)}
						width={235}
						height={133}
						onConfigurePanGesture={(gesture) =>
							gesture.activeOffsetX([-10, 10])
						}
					/>
					<View className="h-2" />
					<Carousel
						data={secondLineVenues}
						loop={true}
						pagingEnabled={false}
						snapEnabled={false}
						style={styles.carousel}
						defaultScrollOffsetValue={secondOffset}
						renderItem={({ item }) => (
							<View className="mr-2">
								<VenueListItem
									venue={item}
									type={isDetailed ? 'list' : 'card'}
								/>
							</View>
						)}
						width={235}
						height={133}
						onConfigurePanGesture={(gesture) =>
							gesture.activeOffsetX([-10, 10])
						}
					/>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	contentContainer: {
		gap: 16
	},
	carousel: {
		width: '100%'
	}
})
