import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map'
import React from 'react'

import activeMarker from '@/assets/images/active-marker.png'
import inactiveMarker from '@/assets/images/inactive-marker.png'
import { useNearbyEvents } from '@/hooks/queries/events/useNearbyEvents'

interface EventMarkersProps {
	coord1: {
		latitude: number
		longitude: number
	}
	coord2: {
		latitude: number
		longitude: number
	}
	filterCategory?: string
	selectedEventId: number | null
	onPress: (eventId: number) => void
}

export default function EventMarkers({
	coord1,
	coord2,
	filterCategory = 'all',
	selectedEventId,
	onPress
}: EventMarkersProps) {
	const { data: nearbyEvents } = useNearbyEvents({
		lat1: coord1.latitude,
		lng1: coord1.longitude,
		lat2: coord2.latitude,
		lng2: coord2.longitude
	})

	const filteredEvents = nearbyEvents.filter((event) => {
		const eventTag = event.isVenue ? 'venue' : event.tags[0].tag
		if (filterCategory === 'all') {
			return true
		}
		if (eventTag === filterCategory) {
			return true
		}
		return false
	})

	return (
		<>
			{filteredEvents.map((event) => (
				<NaverMapMarkerOverlay
					key={event.id}
					latitude={+event.place.latitude}
					longitude={+event.place.longitude}
					image={
						!selectedEventId || selectedEventId === event.id
							? activeMarker
							: inactiveMarker
					}
					onTap={() => onPress(event.id)}
				/>
			))}
		</>
	)
}
