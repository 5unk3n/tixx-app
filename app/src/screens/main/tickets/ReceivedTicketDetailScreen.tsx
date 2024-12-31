import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import EventTags from '@/components/events/EventTags'
import BulletText from '@/components/ui/display/BulletText'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import { UI } from '@/constants/ui'
import { colors } from '@/theme/colors'
import { MainStackParamList } from '@/types/navigation'
import { formatTicketDate, formatTicketTime } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'ReceivedTicketDetail'>

export default function ReceivedTicketDetailScreen({
	navigation,
	route
}: Props) {
	const eventTicketTransfer = route.params

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View className="absolute w-screen h-60">
				<Image
					source={{ uri: eventTicketTransfer.eventTicket.event.imageUrl }}
					className="h-60"
				/>
				<LinearGradient
					colors={['transparent', 'transparent', colors.grayscale[1]]}
					locations={[0, 0.2, 1]}
					className="absolute top-0 bottom-0 left-0 right-0"
				/>
			</View>
			<CustomText variant="h1Semibold" className="mt-40 mb-6">
				{UI.TICKETS.ACCEPTED_TITLE}
			</CustomText>
			<View>
				<EventTags
					tags={eventTicketTransfer.eventTicket.event.tags}
					className="mb-2"
				/>
				<CustomText variant="h1Semibold">
					{eventTicketTransfer.eventTicket.event.name}
				</CustomText>
				<CustomButton
					mode="text"
					size="sm"
					labelVariant="body3Regular"
					className="-ml-3 mb-4"
					labelStyle={{ color: colors.grayscale[5] }}
					onPress={() =>
						navigation.navigate(
							'EventDetail',
							eventTicketTransfer.eventTicket.event
						)
					}
				>
					{UI.TICKETS.VIEW_DETAIL}
				</CustomButton>
			</View>
			<View className="gap-4 pb-9">
				<View className="flex-row">
					<CustomIcon name="calendar" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-8">
						{formatTicketDate(eventTicketTransfer.eventTicket.startAt)}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="time" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-8">
						{formatTicketTime(
							eventTicketTransfer.eventTicket.startAt,
							eventTicketTransfer.eventTicket.endAt
						)}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="place" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-8">
						{eventTicketTransfer.eventTicket.event.place.name}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="pin" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-8">
						{eventTicketTransfer.eventTicket.event.memo}
					</CustomText>
				</View>
			</View>
			<View className="py-4 px-5 mb-5 bg-grayscale-2 rounded-2xl">
				<BulletText variant="body3RegularLarge" className="text-grayscale-4">
					{UI.TICKETS.ACCOUNT_DELETION_DESTRUCTION_NOTICE}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-4">
					{UI.TICKETS.RECOVERY_NOTICE}
				</BulletText>
			</View>
			<CustomButton
				onPress={() => navigation.navigate('MainTab')}
				className="bottom-0 mt-auto mb-2"
			>
				{UI.COMMON.CONFIRM}
			</CustomButton>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: 20, minHeight: '100%' }
})
