import BottomSheet, {
	BottomSheetFlatList,
	BottomSheetProps
} from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CustomText } from '@/components/ui/display/CustomText'
import { useNearbyEvents } from '@/hooks/queries/events/useNearbyEvents'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import EventListItem from './EventListItem'
import VenueListItem from '../hosts/VenueListItem'

interface EventBottomSheetProps extends Omit<BottomSheetProps, 'children'> {
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
}

export default function EventBottomSheet({
	coord1,
	coord2,
	filterCategory = 'all',
	selectedEventId,
	...props
}: EventBottomSheetProps) {
	const { bottom } = useSafeAreaInsets()
	const { colors } = useCustomTheme()
	const bottomSheetRef = useRef<BottomSheet>(null)
	const { t } = useTranslation()

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
		<BottomSheet
			ref={bottomSheetRef}
			snapPoints={[58 + bottom, 184 + bottom, '75%']}
			handleIndicatorStyle={[
				styles.handleIndicator,
				{ backgroundColor: colors.grayscale[200] }
			]}
			backgroundStyle={{ backgroundColor: colors.background }}
			handleStyle={styles.handleContainer}
			{...props}
		>
			<CustomText variant="body1Medium" className="text-center">
				{selectedEventId
					? ''
					: t('eventBottomSheet.nearbyEventsCount', {
							count: filteredEvents.length ?? 0
						})}
			</CustomText>
			<BottomSheetFlatList
				data={
					selectedEventId
						? filteredEvents.filter((event) => event.id === selectedEventId)
						: filteredEvents
				}
				renderItem={({ item }) => {
					if (item.isVenue) {
						return <VenueListItem venue={item} type={'list'} showChip />
					}
					return <EventListItem event={item} type={'list'} />
				}}
				ItemSeparatorComponent={SeparatorComponent}
				style={styles.flatList}
				contentContainerStyle={styles.flatListContentContainer}
			/>
		</BottomSheet>
	)
}

function SeparatorComponent() {
	return <Divider className="my-4 bg-grayscale-600" />
}

const styles = StyleSheet.create({
	handleContainer: {
		paddingVertical: 12
	},
	handleIndicator: {
		width: 40
	},
	flatList: {
		marginTop: 16
	},
	flatListContentContainer: {
		paddingHorizontal: 16
	}
})
