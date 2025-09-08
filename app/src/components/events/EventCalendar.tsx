import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { useFocusEffect } from '@react-navigation/native'
import { endOfMonth, format, isSameDay, isSunday, startOfMonth } from 'date-fns'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Calendar, CalendarProps } from 'react-native-calendars'
import { DayProps } from 'react-native-calendars/src/calendar/day'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { DateData } from 'react-native-calendars/src/types'
import { Divider, TouchableRipple } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useEvents } from '@/hooks/queries/events/useEvents'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import localeConfig from '@/locales/calendarLocaleConfig'

import EventListItem from './EventListItem'
import { CustomText } from '../ui/display/CustomText'

function CustomDayComponent({
	date,
	marking,
	state,
	onPress
}: DayProps & { date: DateData }) {
	const containerStyle = marking?.customStyles?.container
	const textStyle = marking?.customStyles?.text

	const handlePress = () => {
		if (onPress) {
			onPress(date)
		}
	}

	return (
		<TouchableRipple onPress={handlePress} className="rounded-full" borderless>
			<View
				className="w-7 h-7 rounded-full justify-center items-center"
				style={containerStyle}
			>
				<CustomText
					variant="body3Medium"
					className={`text-gray-300 ${isSunday(date.timestamp) ? 'text-[#E93333]' : ''} ${state === 'today' ? 'font-bold' : ''}`}
					style={textStyle}
				>
					{date.day}
				</CustomText>
			</View>
		</TouchableRipple>
	)
}

function CustomCalendar(props: CalendarProps) {
	const { colors } = useCustomTheme()

	return (
		<Calendar
			{...props}
			theme={{
				backgroundColor: 'black',
				calendarBackground: 'black',
				textSectionTitleColor: colors.grayscale[400], // 요일(월~일) 기본색
				dayTextColor: 'white',
				monthTextColor: 'white',
				arrowColor: 'white',
				todayTextColor: 'white'
			}}
			dayComponent={CustomDayComponent}
		/>
	)
}

function EventListItemSeparator() {
	return <Divider className="mt-6 mb-4 bg-grayscale-600" />
}

// FIXME: 로딩 중에 깜빡이는 현상 발생
export default function EventCalendar() {
	const { i18n, t } = useTranslation()
	const { colors } = useCustomTheme()
	const [currentDate, setCurrentDate] = useState(new Date())
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const { bottom } = useSafeAreaInsets()

	const { data: events } = useEvents({
		limit: 1000,
		isActive: false,
		startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
		endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd')
	})

	const handleDayPress = (day: DateData) => {
		const pressedDate = new Date(day.timestamp)
		if (selectedDate && isSameDay(selectedDate, pressedDate)) {
			setSelectedDate(null)
			bottomSheetRef.current?.dismiss()
			return
		}
		setSelectedDate(pressedDate)
		bottomSheetRef.current?.present()
	}

	const handleMonthChange = (date: DateData) => {
		bottomSheetRef.current?.dismiss()
		setCurrentDate(new Date(date.dateString))
	}

	const flatListEvents = events?.pages.flatMap((v) => v.items)

	const eventsByDate = useMemo(() => {
		return flatListEvents.reduce(
			(acc: { [key: string]: any[] }, event: any) => {
				const eventDate = format(new Date(event.startDate), 'yyyy-MM-dd')
				if (!acc[eventDate]) {
					acc[eventDate] = []
				}
				acc[eventDate].push(event)
				return acc
			},
			{}
		)
	}, [flatListEvents])

	const markedDates = useMemo(() => {
		const baseMarkedDates = Object.keys(eventsByDate).reduce(
			(acc: { [key: string]: MarkingProps }, date: string) => {
				acc[date] = {
					customStyles: {
						container: {
							backgroundColor: colors.primary + '4D'
						},
						text: { color: 'white' }
					}
				}
				return acc
			},
			{}
		)

		if (selectedDate) {
			const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
			baseMarkedDates[selectedDateString] = {
				customStyles: {
					container: {
						backgroundColor: colors.primary
					},
					text: { color: 'black' }
				}
			}
		}

		return baseMarkedDates
	}, [eventsByDate, selectedDate, colors])

	const selectedDateEvents =
		selectedDate && eventsByDate[format(selectedDate, 'yyyy-MM-dd')]
			? eventsByDate[format(selectedDate, 'yyyy-MM-dd')]
			: []

	useEffect(() => {
		localeConfig.defaultLocale = i18n.language === 'ko' ? 'ko' : ''
	}, [i18n.language])

	useFocusEffect(
		useCallback(() => {
			return () => {
				bottomSheetRef.current?.dismiss()
				setSelectedDate(null)
			}
		}, [])
	)

	return (
		<View>
			<CustomCalendar
				key={i18n.language}
				hideExtraDays
				onDayPress={handleDayPress}
				onMonthChange={handleMonthChange}
				markingType="custom"
				markedDates={markedDates}
				renderHeader={(date) => (
					<CustomText variant="headline2Medium">
						{format(new Date(date), 'yyyy.MM')}
					</CustomText>
				)}
				headerStyle={[
					styles.header,
					{
						borderColor: colors.grayscale[600]
					}
				]}
			/>
			<BottomSheetModal
				ref={bottomSheetRef}
				snapPoints={[184 + bottom, '50%']}
				onDismiss={() => setSelectedDate(null)}
				handleIndicatorStyle={[
					{
						backgroundColor: colors.grayscale[200]
					},
					styles.handleIndicator
				]}
				backgroundStyle={{
					backgroundColor: colors.grayscale[800]
				}}
			>
				<CustomText variant="body1Medium" className="text-center my-2">
					{selectedDate
						? t('events.calendar.selectedDateEvents', {
								date: format(
									selectedDate,
									i18n.language === 'ko' ? 'M월 d일' : 'd MMMM'
								)
							})
						: ''}
				</CustomText>
				<BottomSheetFlatList
					data={selectedDateEvents}
					renderItem={({ item }) => (
						<EventListItem event={item} type={'list'} size={'sm'} />
					)}
					ItemSeparatorComponent={EventListItemSeparator}
					contentContainerStyle={styles.contentContainer}
				/>
			</BottomSheetModal>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		borderBottomWidth: 0.5
	},
	handleIndicator: {
		width: 40
	},
	contentContainer: {
		paddingHorizontal: 16
	}
})
