import { useNavigation, useScrollToTop } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import React, { Suspense, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	RefreshControl
} from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import EventCalendar from '@/components/events/EventCalendar'
import HotEventsList from '@/components/events/HotEventsList'
import RecommendedEvents from '@/components/events/RecommendedEvents'
import ThisWeekEvensList from '@/components/events/ThisWeekEvensList'
import TixxPickList from '@/components/events/TixxPickList'
import TodayEventsList from '@/components/events/TodayEventsList'
import HotVenueList from '@/components/hosts/HotVenueList'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import { TAB_BAR_HEIGHT } from '@/constants/dimensions'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useHomeTabStore } from '@/stores/homeTabStore'

// TODO: 추천 이벤트, 태그별 이벤트 추가
// recommend, 'popup', 'exhibition', 'concert' 나중에 추가
const tabs = ['today', 'thisWeek', 'calendar', 'venue', 'hot'] as const

export default function HomeScreen() {
	const navigation = useNavigation()
	const { colors } = useCustomTheme()
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const scrollViewRef = useRef(null)
	const [refreshing, setRefreshing] = useState(false)
	const { currentTab, setCurrentTab } = useHomeTabStore()

	useScrollToTop(scrollViewRef)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await Promise.all([
			queryClient.refetchQueries({ queryKey: ['events', 'this-week'] }),
			queryClient.refetchQueries({ queryKey: ['events', 'popular'] }),
			queryClient.refetchQueries({ queryKey: ['events', 'recommended'] }),
			queryClient.refetchQueries({
				queryKey: ['events', { limit: 2, isPicked: true }]
			}),
			queryClient.refetchQueries({
				queryKey: ['host', 'venue', { sort: 'popular', limit: 10 }]
			})
		])
		setRefreshing(false)
	}, [queryClient])

	const handleTabPress = (tab: (typeof tabs)[number]) => {
		setCurrentTab(tab === currentTab ? null : tab)
	}

	return (
		<View className="flex-1" style={styles.container}>
			<ScrollView
				horizontal
				className="py-3 grow-0"
				contentContainerStyle={styles.tabsContentContainer}
				showsHorizontalScrollIndicator={false}
			>
				{tabs.map((tab) => (
					<TouchableRipple
						key={tab}
						onPress={() => handleTabPress(tab)}
						className={`rounded-[20px]  ${
							tab === currentTab ? 'border border-primary' : ''
						}`}
						borderless
					>
						<CustomText
							variant="body3Regular"
							className={
								tab === currentTab ? 'px-[18px] py-[8px]' : 'px-[19px] py-[9px]'
							}
						>
							{t(`events.tabs.${tab}`)}
						</CustomText>
					</TouchableRipple>
				))}
			</ScrollView>
			{currentTab === 'today' ? (
				<View className="px-4 flex-1">
					<Suspense fallback={null}>
						<TodayEventsList limit={5} />
					</Suspense>
				</View>
			) : currentTab === 'thisWeek' ? (
				<View className="px-4 flex-1">
					<Suspense fallback={null}>
						{/* FIXME: 새 api가 필요함, limit 수정 */}
						<ThisWeekEvensList limit={1000} isDetailed={true} />
					</Suspense>
				</View>
			) : currentTab === 'calendar' ? (
				<View className="px-4 flex-1">
					<Suspense fallback={null}>
						<EventCalendar />
					</Suspense>
				</View>
			) : currentTab === 'venue' ? (
				<ScrollView className="flex-1 ">
					<View className="mt-1">
						<RecommendedEvents isVenue />
					</View>
					<View className="mt-10">
						<View className="flex-row justify-between items-center mb-2">
							<CustomText
								variant="headline2Medium"
								className="ml-4 font-semibold"
							>
								{t('home.tixxPick')}
							</CustomText>
							{/* HACK: venue, event에 따른 tixx pick 화면 디자인 나오면 수정 */}
							{/* <TouchableWithoutFeedback
								onPress={() => {
									navigation.navigate('EventsList', {
										filter: { isPicked: true, isActive: true, isVenue: false },
										title: t('home.tixxPick')
									})
								}}
							>
								<View className="flex-row items-center gap-1">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>
										{t('common.viewMore')}
									</CustomText>
									<CustomIcon
										name={'chevronRight'}
										color={colors.grayscale[300]}
									/>
								</View>
							</TouchableWithoutFeedback> */}
						</View>
						<View className="px-4">
							<Suspense fallback={null}>
								<TixxPickList
									limit={3}
									fetchNextEnabled={false}
									scrollEnabled={false}
									isVenue
								/>
							</Suspense>
						</View>
					</View>
					<View className="mt-10 mb-10">
						<View className="flex-row justify-between items-center mb-4">
							<CustomText
								variant="headline2Medium"
								className="ml-4 font-semibold"
							>
								{t('home.hotVenue')}
							</CustomText>
							<TouchableWithoutFeedback
								onPress={() => {
									navigation.navigate('EventsList', {
										filter: { sort: 'popular', isActive: false, isVenue: true },
										title: t('home.hotVenue')
									})
								}}
							>
								<View className="flex-row items-center gap-1">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>
										{t('common.viewMore')}
									</CustomText>
									<CustomIcon
										name={'chevronRight'}
										color={colors.grayscale[300]}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View>
							<Suspense fallback={null}>
								<HotVenueList limit={10} />
							</Suspense>
						</View>
					</View>
				</ScrollView>
			) : currentTab === 'hot' ? (
				<View className="px-4 flex-1">
					<Suspense fallback={null}>
						<HotEventsList limit={5} isDetailed={true} />
					</Suspense>
				</View>
			) : currentTab === 'popup' ? null : currentTab ===
			  'exhibition' ? null : currentTab === 'concert' ? null : (
				<ScrollView
					ref={scrollViewRef}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							tintColor={colors.onPrimary}
							onRefresh={onRefresh}
						/>
					}
				>
					{/* 메인 섹션 */}
					<View className="mt-1">
						<RecommendedEvents />
					</View>
					{/* 광고 섹션 */}
					<View>{/* TODO: 광고 추가 시 */}</View>
					{/* 이번주 오픈 섹션 */}
					<View className="mt-10">
						<View className="flex-row justify-between items-center mb-5 pr-2">
							<CustomText
								variant="headline2Medium"
								className="ml-4 font-semibold"
							>
								{t('home.thisWeekEvents')}
							</CustomText>
							<TouchableWithoutFeedback
								onPress={() => {
									navigation.navigate('EventsList', {
										filter: {
											sort: 'this_week',
											isActive: false,
											isVenue: false
										},
										title: t('home.thisWeekEvents')
									})
								}}
							>
								<View className="flex-row items-center gap-1">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>
										{t('common.viewMore')}
									</CustomText>
									<CustomIcon
										name={'chevronRight'}
										color={colors.grayscale[300]}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View className="px-4">
							<Suspense fallback={null}>
								<ThisWeekEvensList limit={5} fetchNextEnabled={false} />
							</Suspense>
						</View>
					</View>
					{/* HOT 이벤트 섹션 */}
					<View className="mt-10">
						<View className="flex-row justify-between items-center mb-5">
							<CustomText
								variant="headline2Medium"
								className="ml-4 font-semibold"
							>
								{t('home.hotEvents')}
							</CustomText>
							<TouchableWithoutFeedback
								onPress={() => {
									navigation.navigate('EventsList', {
										filter: {
											sort: 'popular',
											isActive: true,
											isVenue: false
										},
										title: t('home.hotEvents')
									})
								}}
							>
								<View className="flex-row items-center gap-1">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>
										{t('common.viewMore')}
									</CustomText>
									<CustomIcon
										name={'chevronRight'}
										color={colors.grayscale[300]}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View className="px-4">
							<Suspense fallback={null}>
								<HotEventsList
									limit={3}
									fetchNextEnabled={false}
									scrollEnabled={false}
								/>
							</Suspense>
						</View>
					</View>
					{/* Tixx Pick 섹션 */}
					<View className="mt-10">
						<View className="flex-row justify-between items-center mb-2">
							<CustomText
								variant="headline2Medium"
								className="ml-4 font-semibold"
							>
								{t('home.tixxPick')}
							</CustomText>
							<TouchableWithoutFeedback
								onPress={() => {
									navigation.navigate('EventsList', {
										filter: { isPicked: true, isActive: true, isVenue: false },
										title: t('home.tixxPick')
									})
								}}
							>
								<View className="flex-row items-center gap-1">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>
										{t('common.viewMore')}
									</CustomText>
									<CustomIcon
										name={'chevronRight'}
										color={colors.grayscale[300]}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View className="px-4">
							<Suspense fallback={null}>
								<TixxPickList limit={5} fetchNextEnabled={false} />
							</Suspense>
						</View>
					</View>
					{/* HOT 베뉴 섹션 */}
					<View className="mt-10 mb-10">
						<View className="flex-row justify-between items-center mb-4">
							<CustomText
								variant="headline2Medium"
								className="ml-4 font-semibold"
							>
								{t('home.hotVenue')}
							</CustomText>
							<TouchableWithoutFeedback
								onPress={() => {
									navigation.navigate('EventsList', {
										filter: { sort: 'popular', isActive: false, isVenue: true },
										title: t('home.hotVenue')
									})
								}}
							>
								<View className="flex-row items-center gap-1">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>
										{t('common.viewMore')}
									</CustomText>
									<CustomIcon
										name={'chevronRight'}
										color={colors.grayscale[300]}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View>
							<Suspense fallback={null}>
								<HotVenueList limit={10} />
							</Suspense>
						</View>
					</View>
				</ScrollView>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: TAB_BAR_HEIGHT
	},
	tabsContentContainer: {
		gap: 8,
		paddingHorizontal: 12,
		height: 36
	}
})
