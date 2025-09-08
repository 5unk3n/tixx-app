import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'

import { Events } from '@/types'

import EventListItem from './EventListItem'
import MainEventCard from './MainEventCard'
export interface EventListProps {
	events: Events['items']
	listOrientation?: 'horizontal' | 'vertical'
	itemType: 'list' | 'card'
	size?: 'sm' | 'md' | 'lg'
	handleEndReached?: () => void
	scrollEnabled?: boolean
	hasSeparator?: boolean
	mode?: 'card' | 'list'
	ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null
}

export default function EventList({
	events,
	listOrientation = 'vertical',
	itemType,
	handleEndReached,
	scrollEnabled = true,
	size,
	hasSeparator = false,
	mode = 'list',
	ListEmptyComponent
}: EventListProps) {
	return (
		<FlatList
			keyExtractor={(item) => item.id.toString()}
			data={events}
			renderItem={({ item }) => {
				if (mode === 'card') {
					return <MainEventCard event={item} />
				}
				return <EventListItem event={item} type={itemType} size={size} />
			}}
			ItemSeparatorComponent={() =>
				hasSeparator ? SeparatorComponent() : null
			}
			horizontal={listOrientation === 'horizontal'}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.contentContainer}
			onEndReached={handleEndReached}
			onEndReachedThreshold={0.5}
			scrollEnabled={scrollEnabled}
			ListEmptyComponent={ListEmptyComponent}
		/>
	)
}

function SeparatorComponent() {
	return <Divider className="my-4 bg-grayscale-600" />
}

const styles = StyleSheet.create({
	contentContainer: {
		gap: 16
	}
})
