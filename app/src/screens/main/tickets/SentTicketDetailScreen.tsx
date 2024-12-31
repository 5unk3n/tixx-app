import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import EventTags from '@/components/events/EventTags'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomDialog from '@/components/ui/feedback/CustomDialog'
import CustomButton from '@/components/ui/input/CustomButton'
import { UI } from '@/constants/ui'
import { useActionEventTicketTransfer } from '@/hooks/queries/eventTickets/useActionEventTicketTransfer'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'
import { formatTicketDate, formatTicketTime } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'SentTicketDetail'>

export default function SentTicketDetailScreen({ navigation, route }: Props) {
	const { colors } = useCustomTheme()
	const initialEventTicketTransfer = route.params
	const [eventTicketTransfer, setEventTicketTransfer] = useState(
		initialEventTicketTransfer
	)
	const [isVisible, setIsVisible] = useState(false)
	const { mutateAsync: actionEventTicketTransfer } =
		useActionEventTicketTransfer()

	const handleCancel = async () => {
		setIsVisible(false)
		const responseEventTicketTransfer = await actionEventTicketTransfer({
			action: 'cancel',
			data: { eventTicketTransferId: eventTicketTransfer.id }
		})
		setEventTicketTransfer((prev) => ({
			...prev,
			...responseEventTicketTransfer
		}))
	}

	const handlePress = () => {
		if (eventTicketTransfer.status === 1) {
			setIsVisible(true)
		} else {
			navigation.navigate('SentTickets')
		}
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View className="absolute w-screen h-60">
				<Image
					source={{
						uri: eventTicketTransfer.eventTicket.event.imageUrl
					}}
					className="h-60"
				/>
				<LinearGradient
					colors={['transparent', 'transparent', colors.background]}
					locations={[0, 0.2, 1]}
					className="absolute top-0 bottom-0 left-0 right-0"
				/>
			</View>
			{eventTicketTransfer.status !== 1 && (
				<CustomText variant="h1Semibold" className="absolute mt-40 px-5">
					{eventTicketTransfer.status === 2
						? UI.TICKETS.ACCEPTED_TITLE
						: eventTicketTransfer.status === 3
							? UI.TICKETS.SENT_REJECTED_TITLE
							: UI.TICKETS.SENT_CANCELED_TITLE}
				</CustomText>
			)}
			<View className="mt-[217]">
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
			<View className="gap-4 pb-9 mb-auto">
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
			<CustomButton
				onPress={handlePress}
				className="bottom-0 mt-auto mb-2"
				colorVariant={
					eventTicketTransfer.status === 1 ? 'secondary' : 'primary'
				}
			>
				{eventTicketTransfer.status === 1
					? UI.TICKETS.CANCEL_TRANSFER
					: UI.COMMON.CONFIRM}
			</CustomButton>
			<CustomDialog
				visible={isVisible}
				title={UI.TICKETS.CANCEL_DIALOG_TITLE}
				leftButtonText={UI.COMMON.CLOSE}
				rightButtonText={UI.TICKETS.CANCEL_TRANSFER_ACTION}
				onLeftPress={() => setIsVisible(false)}
				onRightPress={handleCancel}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: 20, minHeight: '100%' }
})
