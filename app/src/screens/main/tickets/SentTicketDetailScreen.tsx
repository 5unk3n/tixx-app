import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import EventTags from '@/components/events/EventTags'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomDialog from '@/components/ui/feedback/CustomDialog'
import CustomButton from '@/components/ui/input/CustomButton'
import { useActionEventTicketTransfer } from '@/hooks/queries/eventTickets/useActionEventTicketTransfer'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'
import { formatDateWithDay, formatTimeRange } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'SentTicketDetail'>

export default function SentTicketDetailScreen({ navigation, route }: Props) {
	const { t, i18n } = useTranslation()
	const { colors } = useCustomTheme()
	const initialEventTicketTransfer = route.params
	const [eventTicketTransfer, setEventTicketTransfer] = useState(
		initialEventTicketTransfer
	)
	const [isVisible, setIsVisible] = useState(false)
	const { mutateAsync: actionEventTicketTransfer } =
		useActionEventTicketTransfer()

	const handleCancelConfirm = async () => {
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

	const handleCancel = () => {
		if (eventTicketTransfer.status === 1) {
			setIsVisible(true)
		} else {
			navigation.goBack()
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
						? t('tickets.messages.accepted')
						: eventTicketTransfer.status === 3
							? t('tickets.messages.sentRejected')
							: t('tickets.messages.sentCanceled')}
				</CustomText>
			)}
			<View className="mt-[217]">
				<EventTags
					tags={eventTicketTransfer.eventTicket.event.tags}
					className="mb-2"
				/>
				<CustomText variant="h1Semibold" className="mb-4">
					{eventTicketTransfer.eventTicket.event.name}
				</CustomText>
				<CustomButton
					mode="text"
					size="sm"
					labelVariant="body3Regular"
					className="-ml-3 mb-4"
					labelStyle={{ color: colors.grayscale[400] }}
					onPress={() =>
						navigation.navigate('EventDetail', {
							eventId: eventTicketTransfer.eventTicket.event.id
						})
					}
				>
					{t('tickets.viewDetail')}
				</CustomButton>
			</View>
			<View className="gap-4 pb-9 mb-auto">
				<View className="flex-row">
					<CustomIcon name="calendar" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{formatDateWithDay(
							eventTicketTransfer.eventTicket.ticket.startAt,
							i18n.language
						)}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="time" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{t(
							'tickets.entryTime',
							formatTimeRange(
								eventTicketTransfer.eventTicket.ticket.startAt,
								eventTicketTransfer.eventTicket.ticket.endAt
							)
						)}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="place" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{eventTicketTransfer.eventTicket.event.place.name}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="pin" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{eventTicketTransfer.eventTicket.event.memo}
					</CustomText>
				</View>
			</View>
			<CustomButton
				onPress={handleCancel}
				className="bottom-0 mt-auto mb-2"
				colorVariant={
					eventTicketTransfer.status === 1 ? 'secondary' : 'primary'
				}
			>
				{eventTicketTransfer.status === 1
					? t('tickets.actions.cancelTransfer')
					: t('common.confirm')}
			</CustomButton>
			<CustomDialog visible={isVisible}>
				<CustomDialog.Title>
					{t('tickets.messages.confirmCancel')}
				</CustomDialog.Title>
				<CustomDialog.Actions>
					<CustomButton
						flex
						onPress={() => setIsVisible(false)}
						colorVariant="secondary"
						mode="contained"
					>
						{t('common.close')}
					</CustomButton>
					<CustomButton flex onPress={handleCancelConfirm} mode="contained">
						{t('tickets.actions.confirmCancelTransfer')}
					</CustomButton>
				</CustomDialog.Actions>
			</CustomDialog>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: 20, minHeight: '100%' }
})
