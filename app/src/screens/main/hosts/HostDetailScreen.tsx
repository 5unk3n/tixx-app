import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Image,
	View,
	ScrollView,
	StyleSheet,
	LayoutChangeEvent,
	NativeSyntheticEvent,
	NativeScrollEvent
} from 'react-native'
import { Divider } from 'react-native-paper'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, {
	ICarouselInstance,
	Pagination
} from 'react-native-reanimated-carousel'

import EventList from '@/components/events/EventList'
import { CustomText } from '@/components/ui/display/CustomText'
import ShadowGradient from '@/components/ui/display/ShadowGradient'
import CustomHeader from '@/components/ui/navigation/CustomHeader'
import Tabs from '@/components/ui/navigation/Tabs'
import { useEventsByHost } from '@/hooks/queries/events/useEventsByHost'
import { useHost } from '@/hooks/queries/hosts/useHost'
import { useEventHashtags } from '@/hooks/useEventHashtags'
import { useTranslateAddress } from '@/hooks/useTranslateAddress'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'
import { Events } from '@/types'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'HostDetail'>

export default function HostDetailScreen({ route }: Props) {
	const { t } = useTranslation()
	const { data: host } = useHost(route.params.hostId)
	const { data: hostEvents } = useEventsByHost(route.params.hostId)
	const [carouselContainerSize, setCarouselContainerSize] = useState({
		width: 0,
		height: 0
	})
	const [activeTab, setActiveTab] = useState<
		'all' | 'before' | 'ongoing' | 'past'
	>('all')
	const isVenue = host?.category === 'Venue' && host?.events[0]
	const venue = host?.events[0]
	const { hashtags } = useEventHashtags(venue?.eventHashtags || [])

	const contentYRef = useRef(0)
	const isScrolledToContentRef = useRef(false)
	const [isScrolledToContent, setIsScrolledToContent] = useState(false)

	const address = useTranslateAddress(
		venue
			? {
					address: venue.place.address,
					name: venue.place.name,
					latitude: venue.place.latitude,
					longitude: venue.place.longitude
				}
			: null
	)

	const progress = useSharedValue(0)
	const ref = useRef<ICarouselInstance>(null)
	const add = useRecentlyViewedStore((s) => s.add)

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			/**
			 * Calculate the difference between the current index and the target index
			 * to ensure that the carousel scrolls to the nearest index
			 */
			count: index - progress.value,
			animated: true
		})
	}

	function filterEventsByTab(events: Events['items'] = [], tab: string) {
		const now = new Date()
		return events.filter((event) => {
			const start = new Date(`${event.startDate}T${event.startTime}Z`)
			const end = new Date(`${event.endDate}T${event.endTime}Z`)

			if (tab === 'all') return true
			if (tab === 'before') return start > now
			if (tab === 'ongoing') return start <= now && end > now
			if (tab === 'past') return end <= now
			return true
		})
	}

	// 최근 조회 추가: 베뉴 상세 진입 시 대표 이벤트(venue)를 최근 조회에 기록
	useEffect(() => {
		if (isVenue && venue && host) {
			const itemForRecent = {
				...venue,
				host: host,
				tags: (venue as any).tags ?? [],
				isVenue: true,
				eventWishes: [],
				eventHashtags: (venue as any).eventHashtags ?? []
			} as unknown as Events['items'][number]
			add(itemForRecent)
		}
	}, [isVenue, venue, host, add])

	// 탭 필터 결과를 메모이제이션하고, EventList가 요구하는 타입(Events['items'])로 강제 일치
	const filteredHostEvents = useMemo<Events['items']>(() => {
		const items = Array.isArray(hostEvents) ? hostEvents : []
		// hostEvents 스키마에는 eventHashtags가 없을 수 있으므로, 기본값을 채워 타입을 맞춘다
		return items.map((e) => ({
			...e,
			eventHashtags: (e as any).eventHashtags ?? []
		})) as Events['items']
	}, [hostEvents])

	const handleLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout
		setCarouselContainerSize({ width, height })
	}

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

	return (
		<>
			{host?.category === 'Venue' ? (
				<View className="absolute top-0 left-0 right-0 z-20">
					<CustomHeader
						hasBack
						hasHostActions
						isBgTransparent={isScrolledToContent ? false : true}
					/>
				</View>
			) : (
				<CustomHeader hasBack hasHostActions />
			)}
			<ScrollView onScroll={handleScroll} scrollEventThrottle={32}>
				{isVenue && (
					<View>
						<View
							className="w-full aspect-video bg-background"
							onLayout={handleLayout}
						>
							{carouselContainerSize.height > 0 && (
								<Carousel
									ref={ref}
									width={carouselContainerSize.width}
									height={carouselContainerSize.height}
									data={host.events[0].eventMedias}
									renderItem={({ item }) => (
										<Image
											source={{ uri: item.mediaUrl }}
											className="w-full h-full"
										/>
									)}
									loop={false}
									onProgressChange={progress}
								/>
							)}
						</View>
						<Pagination.Basic
							progress={progress}
							data={host.events[0].eventMedias}
							onPress={onPressPagination}
							containerStyle={styles.paginationContainer}
							activeDotStyle={styles.paginationActiveDot}
							dotStyle={styles.paginationDot}
						/>
						<ShadowGradient type={'3'} pointerEvents="none" />
					</View>
				)}
				<View
					onLayout={(e) => (contentYRef.current = e.nativeEvent.layout.y)}
					className="flex-row gap-2 flex-wrap mt-3 px-4"
				>
					<View className="rounded-[10px] bg-grayscale-800">
						<CustomText
							variant="body3Regular"
							className="text-grayscale-300 py-1 px-3"
						>
							{host?.category &&
								t(
									`hosts.categories.${host.category as 'Brand' | 'Promote' | 'Venue'}`
								)}
						</CustomText>
					</View>
					{isVenue &&
						hashtags.map((hashtag, index) => (
							<View key={index} className="rounded-[10px] bg-grayscale-800">
								<CustomText
									variant="body3Regular"
									className="text-grayscale-300 py-1 px-3"
								>
									{hashtag}
								</CustomText>
							</View>
						))}
				</View>
				<View className="flex-row mt-5 px-4">
					<View className="flex-1">
						<CustomText variant="h1Semibold">{host?.name}</CustomText>
						<View className="flex-row mt-2">
							<CustomText>
								{t('hosts.followers')} {host?.followerCount || 0}
							</CustomText>
							<CustomText> • </CustomText>
							<CustomText>
								{t('hosts.hostedEventsList')} {hostEvents?.length || 0}
							</CustomText>
						</View>
						{isVenue && (
							<CustomText
								variant="body3Regular"
								className="text-grayscale-300 mt-2"
							>{`${t('hosts.address')} | ${address}`}</CustomText>
						)}
					</View>
					<Image
						source={{
							uri: host?.imageUrl
						}}
						className="w-[70] h-[70] rounded-full self-center ml-4"
					/>
				</View>
				<Divider className="mx-4 my-8 bg-grayscale-600" />
				<View className="px-4">
					<CustomText variant="headline2Medium" className="mb-5">
						{t('hosts.hostedEventsList')}
					</CustomText>
					<Tabs type="outline" value={activeTab} onChange={setActiveTab}>
						<Tabs.Tab value="all" label={t('hosts.tabs.all')} />
						<Tabs.Tab value="before" label={t('hosts.tabs.before')} />
						<Tabs.Tab value="ongoing" label={t('hosts.tabs.ongoing')} />
						<Tabs.Tab value="past" label={t('hosts.tabs.past')} />
					</Tabs>
					<View className="mt-5">
						<EventList
							events={filterEventsByTab(filteredHostEvents, activeTab)}
							mode="list"
							size="sm"
							hasSeparator={false}
							scrollEnabled={false}
							itemType={'list'}
						/>
					</View>
					{/* TODO: 호스트 정보 추가되면 주석 해제 */}
					{/* <View>
						<CustomText
							variant="body1Medium"
							className="mt-8 mb-4 text-grayscale-100"
						>
							{t('hosts.infoTitle', { hostName: host?.name })}
						</CustomText>
						<View className="gap-[7]">
							<View className="flex-row">
								<CustomText variant="body3Regular" className="text-grayscale-300">
									{t('hosts.email')}
								</CustomText>
								<CustomText
									variant="body3Regular"
									className="ml-3 text-grayscale-300"
								>
									example@mail.co.kr
								</CustomText>
							</View>
							<View className="flex-row">
								<CustomText variant="body3Regular" className="text-grayscale-300">
									{t('hosts.contact')}
								</CustomText>
								<CustomText
									variant="body3Regular"
									className="ml-3 text-grayscale-300"
								>
									000-0000-0000
								</CustomText>
							</View>
							<View className="flex-row">
								<CustomText variant="body3Regular" className="text-grayscale-300">
									{t('hosts.instagram')}
								</CustomText>
								<CustomText
									variant="body3Regular"
									className="ml-3 text-grayscale-300"
								>
									@tixx.official
								</CustomText>
							</View>
						</View>
					</View> */}
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create({
	carousel: {
		width: '100%'
	},
	paginationContainer: {
		marginTop: 8,
		gap: 4
	},
	paginationActiveDot: { backgroundColor: '#FFFFFF' },
	paginationDot: { backgroundColor: '#FFFFFF80', borderRadius: 100 }
})
