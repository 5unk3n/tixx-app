import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, StyleSheet, View } from 'react-native'
import { Divider, TouchableRipple } from 'react-native-paper'

import { useTranslateAddress } from '@/hooks/useTranslateAddress'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'

import { CustomText } from '../ui/display/CustomText'

export default function RecentlyViewedList() {
	const recentlyViewed = useRecentlyViewedStore((s) => s.items)

	return (
		<View>
			<FlatList
				data={recentlyViewed}
				renderItem={({ item }) => (
					<RecentlyViewedListItem item={item} isVenue={item.isVenue} />
				)}
				ItemSeparatorComponent={SeparatorComponent}
				style={styles.flatList}
				scrollEnabled={false}
				ListEmptyComponent={RecentlyViewedEmpty}
			/>
		</View>
	)
}

interface RecentlyViewedListItemProps {
	item: any
	isVenue: boolean
}

function RecentlyViewedListItem({
	item,
	isVenue
}: RecentlyViewedListItemProps) {
	const { t } = useTranslation()
	const address = useTranslateAddress({
		address: item.place.address,
		name: item.place.name,
		latitude: item.place.latitude,
		longitude: item.place.longitude
	})
	const navigation = useNavigation()

	const handlePress = () => {
		if (isVenue) {
			navigation.navigate('HostDetail', {
				hostId: item.host.id
			})
		} else {
			navigation.navigate('EventDetail', {
				eventId: item.id
			})
		}
	}

	return (
		<TouchableRipple onPress={handlePress}>
			<View className="flex-row">
				<Image
					source={{ uri: isVenue ? item.host.imageUrl : item.imageUrl }}
					width={84}
					height={84}
					className="rounded-lg"
				/>
				<View className="ml-4 justify-center">
					<CustomText variant="body3Medium">{item.name}</CustomText>
					<CustomText
						variant="body3Regular"
						numberOfLines={1}
						className="mt-1.5 text-[13px] text-grayscale-400"
					>{`${
						isVenue
							? t('events.tags.venue')
							: item.tags[0].tag === 'party'
								? t('events.tags.party')
								: item.tags[0].tag === 'event'
									? t('events.tags.event')
									: item.tags[0].tag
					} | ${address}`}</CustomText>
				</View>
			</View>
		</TouchableRipple>
	)
}

function SeparatorComponent() {
	return <Divider className="my-4 bg-grayscale-600" />
}

function RecentlyViewedEmpty() {
	const { t } = useTranslation()
	return (
		<CustomText
			variant="body1Regular"
			className="text-grayscale-400 text-center mt-4"
		>
			{t('search.recentlyViewedNotExist')}
		</CustomText>
	)
}

const styles = StyleSheet.create({
	flatList: {
		marginTop: 16
	}
})
