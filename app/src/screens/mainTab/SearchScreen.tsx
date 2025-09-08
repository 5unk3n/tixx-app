import { format } from 'date-fns'
import React, { Suspense, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { ActivityIndicator, TouchableRipple } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import HashtagList from '@/components/events/HashtagList'
import PlaceFilterSelect from '@/components/events/PlaceFilterSelect'
import RecentlyViewedList from '@/components/events/RecentlyViewedList'
import SearchEventsList from '@/components/events/SearchEventsList'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomBottomSheet, {
	BottomSheetRef
} from '@/components/ui/feedback/CustomBottomSheet'
import SearchInput from '@/components/ui/input/SearchInput'
import { TAB_BAR_HEIGHT } from '@/constants/dimensions'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useSearch } from '@/hooks/useSearch'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'

export default function SearchScreen() {
	const { colors } = useCustomTheme()
	const { t, i18n } = useTranslation()
	const { bottom } = useSafeAreaInsets()
	const clear = useRecentlyViewedStore((s) => s.clear)

	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [open, setOpen] = useState(false)
	const [selectedCity, setSelectedCity] = useState('')
	const [sort, setSort] = useState<'popular' | 'newest'>('newest')

	const bottomSheetRef = useRef<BottomSheetRef>(null)

	const {
		searchQuery,
		setSearchQuery,
		handleSearch,
		searchHistory,
		clearSearchHistory,
		toggleSearchHistory,
		deleteSearchHistory,
		submittedQuery,
		isSearchHistoryEnabled
	} = useSearch({ autoSearch: false })

	const handleSortSelect = (value: 'popular' | 'newest') => {
		setSort(value)
		bottomSheetRef.current?.dismiss()
	}

	return (
		<View className="flex-1" style={{ paddingBottom: TAB_BAR_HEIGHT }}>
			<View className="mt-4 px-4">
				<SearchInput
					placeholder={t('search.placeholder')}
					onSearch={handleSearch}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
				<View className="flex-row mt-6">
					<PlaceFilterSelect
						value={selectedCity}
						onSelect={(city) => setSelectedCity(city)}
					/>
					<TouchableRipple
						onPress={() => setOpen(true)}
						className="rounded-[20px] bg-grayscale-800 px-2.5 ml-2"
						borderless
					>
						<View className="flex-row items-center h-9">
							<CustomIcon name={'calendar'} size={16} />
							<CustomText
								variant="body1Regular"
								className="text-grayscale-300 ml-1"
							>
								{selectedDate
									? format(selectedDate, 'yyyy.MM.dd')
									: t('common.date')}
							</CustomText>
							{selectedDate ? (
								<CustomIcon
									name={'close'}
									size={22}
									onPress={() => setSelectedDate(null)}
									pointerEvents="auto"
								/>
							) : null}
						</View>
					</TouchableRipple>
					<DatePicker
						date={selectedDate || new Date()}
						onConfirm={(date) => {
							setOpen(false)
							setSelectedDate(date)
						}}
						onCancel={() => {
							setOpen(false)
						}}
						modal
						open={open}
						cancelText={t('common.cancel')}
						confirmText={t('common.confirm')}
						mode="date"
						locale={i18n.language}
						theme="dark"
					/>
					<TouchableRipple
						onPress={() => bottomSheetRef.current?.present()}
						className="rounded-[20px] ml-2"
						borderless
					>
						<View className="flex-row items-center bg-grayscale-800 pl-3 pr-[5px] py-2 h-9">
							<CustomText variant="body1Regular" className="text-grayscale-300">
								{sort === 'newest'
									? t('search.sortNewest')
									: t('search.sortPopular')}
							</CustomText>
							<CustomIcon
								name={'chevronDown'}
								size={26}
								className="text-grayscale-300"
							/>
						</View>
					</TouchableRipple>
					<CustomBottomSheet
						ref={bottomSheetRef}
						snapPoints={[bottom + 132]}
						isDraggable={false}
						backgroundStyle={{ backgroundColor: colors.grayscale[800] }}
					>
						<View className="mt-9 mx-4">
							<TouchableRipple
								onPress={() => handleSortSelect('newest')}
								className="pl-4 py-4"
							>
								<CustomText variant="body1Regular">
									{t('search.sortNewest')}
								</CustomText>
							</TouchableRipple>
							<TouchableRipple
								onPress={() => handleSortSelect('popular')}
								className="pl-4 py-4"
							>
								<CustomText variant="body1Regular">
									{t('search.sortPopular')}
								</CustomText>
							</TouchableRipple>
						</View>
					</CustomBottomSheet>
				</View>
			</View>
			{searchQuery && submittedQuery ? (
				<View className="flex-1 mt-4 px-4">
					<Suspense
						fallback={
							<View className="flex-1 justify-center items-center">
								<ActivityIndicator />
							</View>
						}
					>
						<SearchEventsList
							searchTerm={submittedQuery}
							city={selectedCity}
							sort={sort}
							date={selectedDate}
						/>
					</Suspense>
				</View>
			) : (
				<ScrollView className="flex-1 mt-4">
					<View className="flex-row items-center px-4">
						<CustomText
							variant="headline2Medium"
							className="font-semibold flex-1"
						>
							{t('search.recent')}
						</CustomText>
						<View className="flex-row gap-2">
							<CustomText
								variant="body3Regular"
								className="text-grayscale-400"
								onPress={toggleSearchHistory}
							>
								{isSearchHistoryEnabled
									? t('search.historyOff')
									: t('search.historyOn')}
							</CustomText>
							<CustomText variant="body3Regular" className="text-grayscale-400">
								|
							</CustomText>
							<CustomText
								variant="body3Regular"
								onPress={clearSearchHistory}
								disabled={!isSearchHistoryEnabled}
								className="text-grayscale-400"
							>
								{t('search.clearAll')}
							</CustomText>
						</View>
					</View>
					{isSearchHistoryEnabled ? (
						<FlatList
							data={searchHistory}
							keyExtractor={(item) => item}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => {
										setSearchQuery(item)
										handleSearch(item, true)
									}}
								>
									<View className="flex-row items-center p-2 bg-grayscale-800 rounded-[20px]">
										<CustomText
											variant="body1Regular"
											className="text-grayscale-400"
										>
											{item}
										</CustomText>
										<Pressable
											onPress={() => deleteSearchHistory(item)}
											className="ml-1"
										>
											<CustomIcon
												name="close"
												color={colors.grayscale[300]}
												size={16}
											/>
										</Pressable>
									</View>
								</Pressable>
							)}
							horizontal
							className="mt-4 mx-4"
							contentContainerStyle={[
								styles.historyContainer,
								searchHistory.length ? {} : styles.historyEmptyContainer
							]}
							ListEmptyComponent={
								<CustomText
									variant="body1Regular"
									className="text-grayscale-400 mt-4"
								>
									{t('search.historyNotExist')}
								</CustomText>
							}
							showsHorizontalScrollIndicator={false}
						/>
					) : (
						<View className="mt-8 px-4">
							<CustomText
								variant="body1Regular"
								className="text-grayscale-400 text-center"
							>
								{t('search.historyDisabled')}
							</CustomText>
						</View>
					)}
					<View className="px-4 mt-10">
						<CustomText variant="headline2Medium" className="font-semibold">
							{t('search.recommendedHashtags')}
						</CustomText>
						<View className="mt-4">
							<HashtagList
								// HACK: 임시
								hashtags={['파티', '베뉴', '힙합', '클럽', '행사']}
								onPress={(hashtag) => {
									setSearchQuery(hashtag)
									handleSearch(hashtag, true)
								}}
							/>
						</View>
					</View>
					<View className="px-4 mt-10">
						<View className="flex-row items-center">
							<CustomText variant="headline2Medium" className="font-semibold">
								{t('search.recentlyViewed')}
							</CustomText>
							<CustomText
								variant="body3Regular"
								className="text-grayscale-400 ml-auto"
								onPress={clear}
							>
								{t('search.clearAll')}
							</CustomText>
						</View>
						<RecentlyViewedList />
					</View>
				</ScrollView>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	historyContainer: {
		gap: 8
	},
	historyEmptyContainer: {
		flex: 1,
		justifyContent: 'center'
	}
})
