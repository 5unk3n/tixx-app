import { useFocusEffect } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	View,
	ScrollView,
	StyleSheet,
	Image,
	NativeSyntheticEvent,
	NativeScrollEvent
} from 'react-native'
import { Divider } from 'react-native-paper'

import EventBackgroundMedia from '@/components/events/EventBackgroundMedia'
import EventDetail from '@/components/events/EventDetail'
import EventInfo from '@/components/events/EventInfo'
import EventTags from '@/components/events/EventTags'
import EventWishButton from '@/components/events/EventWishButton'
import HashtagList from '@/components/events/HashtagList'
import OrderBottomSheet from '@/components/orders/OrderBottomSheet'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import ShadowGradient from '@/components/ui/display/ShadowGradient'
import CustomButton from '@/components/ui/input/CustomButton'
import CustomHeader from '@/components/ui/navigation/CustomHeader'
import { useEvent } from '@/hooks/queries/events/useEvent'
import { useEventHashtags } from '@/hooks/useEventHashtags'
import { useShareLink } from '@/hooks/useShareLink'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'
import { Events } from '@/types'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'EventDetail'>

export default function EventDetailScreen({ route, navigation }: Props) {
	const { t } = useTranslation()
	const { eventId } = route.params
	const [isOrderBottomSheetVisible, setIsOrderBottomSheetVisible] =
		useState(false)
	const { shareLink } = useShareLink()

	const { data: event, isPending, isError } = useEvent(eventId)
	const add = useRecentlyViewedStore((s) => s.add)
	const { hasHashtags, hashtags } = useEventHashtags(event?.eventHashtags || [])

	const standardTickets = event?.tickets?.filter(
		(ticket) => ticket.name === 'Standard'
	)

	const contentYRef = useRef(0)
	const isScrolledToContentRef = useRef(false)
	const [isScrolledToContent, setIsScrolledToContent] = useState(false)

	useFocusEffect(
		useCallback(() => {
			return () => {
				setIsOrderBottomSheetVisible(false)
			}
		}, [])
	)

	useEffect(() => {
		if (event) {
			const itemForRecent = {
				...event,
				eventWishes: []
			} as Events['items'][number]
			add(itemForRecent)
		}
	}, [event, add])

	const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const y = e.nativeEvent.contentOffset.y
		if (contentYRef.current && y >= contentYRef.current) {
			if (!isScrolledToContentRef.current) {
				isScrolledToContentRef.current = true
				setIsScrolledToContent(true)
			}
		} else {
			if (isScrolledToContentRef.current) {
				isScrolledToContentRef.current = false
				setIsScrolledToContent(false)
			}
		}
	}

	if (isPending || isError) {
		return null
	}

	return (
		<View className="flex-1">
			<View className="absolute top-0 left-0 right-0 z-20">
				<CustomHeader
					hasBack
					title={isScrolledToContent ? event.name : ''}
					isBgTransparent={isScrolledToContent ? false : true}
				/>
			</View>
			<ScrollView
				onScroll={handleScroll}
				scrollEventThrottle={32}
				contentContainerStyle={styles.container}
			>
				<View className="bg-background">
					{event?.eventMedias ? (
						<EventBackgroundMedia event={event} />
					) : (
						<Image source={{ uri: event.imageUrl }} className="flex-1" />
					)}
					<ShadowGradient type={'3'} pointerEvents="none" />
					{/* FIXME: 프레스 통과되어야함 */}
					<EventTags tags={event.tags} className="absolute bottom-4 left-4" />
					<View
						className="absolute bottom-4 right-4 flex-row gap-2 items-center"
						pointerEvents="box-none"
					>
						<EventWishButton eventId={event.id} isWished={event.isWished} />
						{/* FIXME: 클릭 통과 되어야함 */}
						<CustomIcon
							pointerEvents="auto"
							name={'share'}
							onPress={() =>
								shareLink({
									type: 'event',
									id: eventId,
									title: event?.name,
									description: event?.description,
									imageUrl: event?.imageUrl
								})
							}
							color={'white'}
						/>
						<CustomIcon name={'extend'} color={'white'} size={23} />
					</View>
				</View>
				<View
					onLayout={(e) => (contentYRef.current = e.nativeEvent.layout.y)}
					className="pl-4 pt-4 pr-3 pb-4"
				>
					<CustomText variant="h1Semibold" className="mb-1 text-[26px]">
						{event.name}
					</CustomText>
					<CustomText
						variant="body1Regular"
						className="self-start"
						onPress={() =>
							navigation.navigate('HostDetail', {
								hostId: event.host.id
							})
						}
					>
						{event.host?.name}
					</CustomText>
					{hasHashtags && (
						<View className="mt-4">
							<HashtagList hashtags={hashtags} />
						</View>
					)}
				</View>
				<Divider className="bg-grayscale-600 mx-4" />
				<View className="pt-6 px-4 gap-9">
					<View>
						<EventInfo event={event} mode="detail" venue={event.venue} />
					</View>
					<View>
						<EventDetail event={event} />
					</View>
				</View>
			</ScrollView>
			<View className="pb-4 px-4 ">
				<CustomButton
					onPress={() => setIsOrderBottomSheetVisible(true)}
					disabled={!standardTickets?.length}
				>
					{t('events.buyTicket')}
				</CustomButton>
			</View>
			{standardTickets && standardTickets.length > 0 && event && (
				<OrderBottomSheet
					event={event}
					isBottomSheetOpen={isOrderBottomSheetVisible}
					onDismiss={() => setIsOrderBottomSheetVisible(false)}
					tickets={standardTickets}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 24
	}
})
