import { useNavigation } from '@react-navigation/native'
import {
	differenceInDays,
	format,
	isSameDay,
	isSameYear,
	parseISO,
	startOfDay,
	subDays
} from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TouchableRipple } from 'react-native-paper'

import { useTranslateAddress } from '@/hooks/useTranslateAddress'
import { Event } from '@/types'

import StaticMap from '../maps/StaticMap'
import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

interface EventInfoProps {
	event: Omit<Event, 'eventMedias' | 'tickets'>
	mode?: 'default' | 'detail'
	venue?: Partial<Event>
}

export default function EventInfo({
	event,
	mode = 'default',
	venue
}: EventInfoProps) {
	const { t, i18n } = useTranslation()
	const navigation = useNavigation()

	const address = useTranslateAddress({
		address: event.place.address,
		name: event.place.name,
		latitude: event.place.latitude,
		longitude: event.place.longitude
	})

	const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)
	const endDateTimeUTC = parseISO(`${event.endDate}T${event.endTime}Z`)
	const isAfterMidnightEvent =
		startDateTimeUTC.getHours() * 60 + startDateTimeUTC.getMinutes() >
		endDateTimeUTC.getHours() * 60 + endDateTimeUTC.getMinutes()
	const displayEndDateTimeUTC = isAfterMidnightEvent
		? subDays(endDateTimeUTC, 1)
		: endDateTimeUTC

	const getEventDate = () => {
		const selectedLocale = i18n.language === 'ko' ? ko : enUS
		const formattedStartDate = format(startDateTimeUTC, 'yyyy.MM.dd(E)', {
			locale: selectedLocale
		})
		const formattedEndDate = isSameYear(startDateTimeUTC, displayEndDateTimeUTC)
			? format(displayEndDateTimeUTC, 'MM.dd(E)', { locale: selectedLocale })
			: format(displayEndDateTimeUTC, 'yyyy.MM.dd(E)', {
					locale: selectedLocale
				})
		const durationDays =
			differenceInDays(
				startOfDay(displayEndDateTimeUTC),
				startOfDay(startDateTimeUTC)
			) + 1

		if (isSameDay(startDateTimeUTC, displayEndDateTimeUTC)) {
			return `${formattedStartDate} (${t('common.unit.day', { day: 1 })})`
		}
		return `${formattedStartDate} - ${formattedEndDate} (${t(
			'common.unit.durationDays',
			{ days: durationDays }
		)})`
	}

	const getEventTime = () => {
		const formattedStartTime = format(startDateTimeUTC, 'HH:mm')
		const formattedEndTime = format(displayEndDateTimeUTC, 'HH:mm')

		return `${formattedStartTime} - ${formattedEndTime}`
	}

	return (
		<View className="gap-4">
			<View className={mode === 'default' ? 'flex-row' : ''}>
				{mode === 'default' ? (
					<CustomIcon name="calendar" size={20} className="mr-2" />
				) : (
					<CustomText variant="body1Semibold" className="mb-2">
						{t('events.detail.date')}
					</CustomText>
				)}
				<CustomText
					variant="body3Regular"
					className={`text-grayscale-300 ${mode === 'default' ? 'flex-1' : ''}`}
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{getEventDate()}
				</CustomText>
			</View>
			<View className={mode === 'default' ? 'flex-row' : ''}>
				{mode === 'default' ? (
					<CustomIcon name="time" size={20} className="mr-2" />
				) : (
					<CustomText variant="body1Semibold" className="mb-2">
						{t('events.detail.time')}
					</CustomText>
				)}

				<CustomText
					variant="body3Regular"
					className={`text-grayscale-300 ${mode === 'default' ? 'flex-1' : ''}`}
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{getEventTime()}
				</CustomText>
			</View>
			<View className={mode === 'default' ? 'flex-row' : ''}>
				{mode === 'default' ? (
					<CustomIcon name="place" size={20} className="mr-2" />
				) : (
					<CustomText variant="body1Semibold" className="mb-2">
						{t('events.detail.location')}
					</CustomText>
				)}
				<CustomText
					variant="body3Regular"
					className={`text-grayscale-300 ${mode === 'default' ? 'flex-1' : ''}`}
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{address}
				</CustomText>
				{mode === 'detail' && venue && (
					<View className="items-start mt-4">
						<TouchableRipple
							onPress={() =>
								navigation.navigate('HostDetail', {
									hostId: venue.host!.id
								})
							}
						>
							<View className="items-center">
								<Image
									source={{
										uri: event.host.imageUrl
									}}
									width={36}
									height={36}
									className="rounded-full"
								/>
								<CustomText variant="body3Regular" className="mt-2">
									{venue.name}
								</CustomText>
							</View>
						</TouchableRipple>
					</View>
				)}
			</View>
			<View className={mode === 'default' ? 'flex-row' : 'mb-2'}>
				{mode === 'default' ? (
					<CustomIcon name="pin" size={20} className="mr-2" />
				) : (
					<CustomText variant="body1Semibold" className="mb-2">
						{t('events.detail.provided')}
					</CustomText>
				)}
				<CustomText
					variant="body3Regular"
					className={`text-grayscale-300 ${mode === 'default' ? 'flex-1' : ''}`}
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{event.memo}
				</CustomText>
			</View>
			{mode === 'detail' && (
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('Map', {
							place: event.place,
							title: address
						})
					}
					className="rounded-xl overflow-hidden"
				>
					<StaticMap
						longitude={event.place.longitude}
						latitude={event.place.latitude}
					/>
				</TouchableOpacity>
			)}
		</View>
	)
}
