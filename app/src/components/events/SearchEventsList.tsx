import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { useSearchEvents } from '@/hooks/queries/events/useSearchEvents'
import { EventFilter } from '@/types'

import EventListItem from './EventListItem'
import VenueListItem from '../hosts/VenueListItem'
import { CustomText } from '../ui/display/CustomText'

interface SearchEventsListProps {
	city: string
	sort?: EventFilter['sort']
	searchTerm: string
	date: Date | null
}

export default function SearchEventsList({
	city,
	sort,
	searchTerm,
	date
}: SearchEventsListProps) {
	const { t } = useTranslation()

	// FIXME: 베뉴와 이벤트 모두 검색 가능하도록 백엔드 api 수정
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchEvents({
			searchTerm: searchTerm,
			sort,
			startDate: date ? format(date, 'yyyy-MM-dd') : undefined,
			endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
			isActive: true
		})

	const events = data?.pages.flatMap((page) => page.items)
	const filteredEvents = city
		? events.filter((event) => {
				const cityName = city.slice(0, 2)
				const isAddressMatch = event.place.address.includes(cityName)
				return city ? isAddressMatch : true
			})
		: events

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	return (
		<FlatList
			data={filteredEvents}
			renderItem={({ item }) => {
				if (item.isVenue) {
					return <VenueListItem venue={item} type={'list'} showChip />
				}
				return <EventListItem event={item} type={'list'} />
			}}
			onEndReached={handleLoadMore}
			onEndReachedThreshold={0.5}
			contentContainerStyle={styles.flatListContentContainer}
			ListEmptyComponent={
				<View className="mt-10">
					<CustomText className="text-center">
						{t('tickets.search.noResult')}
					</CustomText>
				</View>
			}
		/>
	)
}

const styles = StyleSheet.create({
	flatListContentContainer: {
		gap: 16
	}
})
