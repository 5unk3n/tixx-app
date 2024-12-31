import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { Event } from '@/types'
import { formatEventDate, formatEventTime } from '@/utils/formatters'

import StaticMap from '../maps/StaticMap'
import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

interface EventInfoProps {
	event: Event
	mode?: 'default' | 'detail'
}

export default function EventInfo({ event, mode = 'default' }: EventInfoProps) {
	const navigation = useNavigation()

	return (
		<View className="gap-4">
			<View className="flex-row">
				<CustomIcon name="calendar" size={20} className="mr-2" />
				<CustomText
					variant="body1Regular"
					className="text-grayscale-8 flex-1"
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{formatEventDate(event.startDate, event.endDate)}
				</CustomText>
			</View>
			<View className="flex-row">
				<CustomIcon name="time" size={20} className="mr-2" />
				<CustomText
					variant="body1Regular"
					className="text-grayscale-8 flex-1"
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{formatEventTime(event.startTime, event.endTime)}
				</CustomText>
			</View>
			<View className="flex-row">
				<CustomIcon name="place" size={20} className="mr-2" />
				<CustomText
					variant="body1Regular"
					className="text-grayscale-8 flex-1"
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{event.place.name}
				</CustomText>
			</View>
			{mode === 'detail' && (
				<TouchableOpacity
					onPress={() => navigation.navigate('Map', event.place)}
					className="rounded-xl overflow-hidden"
				>
					<StaticMap
						longitude={event.place.longitude}
						latitude={event.place.latitude}
					/>
				</TouchableOpacity>
			)}
			<View className="flex-row">
				<CustomIcon name="pin" size={20} className="mr-2" />
				<CustomText
					variant="body1Regular"
					className="text-grayscale-8 flex-1"
					numberOfLines={mode === 'default' ? 1 : undefined}
				>
					{event.memo}
				</CustomText>
			</View>
		</View>
	)
}
