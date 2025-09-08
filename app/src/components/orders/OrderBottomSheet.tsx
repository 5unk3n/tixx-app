import { useNavigation } from '@react-navigation/native'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TicketIllust from '@/assets/illustrations/ticket-rounded.svg'
import CustomBottomSheet, {
	BottomSheetRef
} from '@/components/ui/feedback/CustomBottomSheet'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useOrderStore } from '@/stores/orderStore'
import { Event, Ticket } from '@/types'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'
import CustomIconButton from '../ui/input/CustomIconButton'

interface OrderBottomSheetProps {
	event: Event
	tickets: Ticket[]
	isBottomSheetOpen: boolean
	onDismiss: () => void
}

export default function OrderBottomSheet({
	event,
	tickets,
	isBottomSheetOpen,
	onDismiss
}: OrderBottomSheetProps) {
	const { t } = useTranslation()
	const navigation = useNavigation()
	const { colors } = useCustomTheme()
	const { bottom } = useSafeAreaInsets()
	const bottomSheetRef = useRef<BottomSheetRef>(null)
	const { order, setOrder } = useOrderStore()

	const eventDate = format(
		parseISO(`${event.startDate}T${event.startTime}Z`),
		'yyyy.MM.dd HH:mm'
	)

	const handleOrder = async () => {
		try {
			navigation.navigate('BuyTicket', event)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		if (order === null) {
			setOrder(tickets[0], 1)
		}
	}, [order, setOrder, tickets])

	useEffect(() => {
		if (isBottomSheetOpen) {
			bottomSheetRef.current?.present()
		} else {
			bottomSheetRef.current?.dismiss()
		}
	}, [isBottomSheetOpen])

	return (
		<CustomBottomSheet
			ref={bottomSheetRef}
			snapPoints={[524 + bottom]}
			isDraggable={false}
			onBackDropPress={onDismiss}
			className="pt-7 px-5"
		>
			<CustomText variant="h1Semibold" className="mb-1">
				{event.name}
			</CustomText>
			<CustomText variant="body1RegularLarge" className="text-primary">
				{eventDate}
			</CustomText>
			<CustomText variant="body1Regular">{event.host.name}</CustomText>
			<View className="mt-4 pt-8 px-5 bg-grayscale-0 rounded-lg overflow-hidden">
				<CustomText
					variant="body3Medium"
					className="text-center text-grayscale-600"
				>
					{t('orders.selectTicket')}
				</CustomText>
				<View className="h-[120] pt-6">
					{tickets.map((ticket, index) => {
						const isSelected = order?.ticket.id === ticket.id
						return (
							<TouchableWithoutFeedback
								key={ticket.id}
								testID={`ticket-item-${ticket.id}`}
								onPress={() => setOrder(ticket, order!.quantity)}
							>
								<View
									className={`flex-row h-[58] items-center px-4 rounded-lg bg-grayscale-0 
								${isSelected ? 'bg-grayscale-900 border border-primary' : ''}
								${index === 0 ? 'mt-0' : 'mt-1'}`}
									style={styles.feeDropShadow}
								>
									<CustomIcon
										name={'userCheck'}
										color={
											isSelected ? colors.grayscale[0] : colors.grayscale[900]
										}
									/>
									<View className="gap-1 ml-2">
										<CustomText
											variant="labelSmall"
											className={
												isSelected ? 'text-grayscale-0' : 'text-grayscale-900'
											}
										>
											{ticket.type === 'Early Bird'
												? t('tickets.names.earlyBird')
												: ticket.type === 'Standard'
													? t('tickets.names.standard')
													: t('orders.entranceFee')}
										</CustomText>
										<CustomText
											variant="labelMedium"
											className={
												isSelected ? 'text-grayscale-0' : 'text-grayscale-900'
											}
										>
											{`${ticket.price?.toLocaleString()} ${t('orders.currency')}`}
										</CustomText>
									</View>
								</View>
							</TouchableWithoutFeedback>
						)
					})}
				</View>
				<View className="flex-row h-[130] justify-center items-center">
					<CustomIconButton
						name={'minus'}
						iconColor={colors.grayscale[600]}
						size={48}
						onPress={() => {
							if (!order) return
							setOrder(order.ticket, order.quantity - 1)
						}}
					/>
					<View className="justify-center items-center">
						<TicketIllust
							color={colors.grayscale[700]}
							width={96}
							height={53}
						/>
						<CustomText
							variant="headline1Medium"
							className="absolute text-primary"
						>
							{order?.quantity}
						</CustomText>
					</View>
					<CustomIconButton
						name={'plus'}
						iconColor={colors.grayscale[600]}
						size={48}
						onPress={() => {
							if (!order) return
							setOrder(order.ticket, order.quantity + 1)
						}}
					/>
				</View>
			</View>
			<CustomButton onPress={handleOrder} className="mt-6">
				{`${(order ? order.ticket.price! * order.quantity : 0).toLocaleString()} ${t('orders.currency')} ${t('orders.pay')}`}
			</CustomButton>
		</CustomBottomSheet>
	)
}

const styles = StyleSheet.create({
	bottomSheet: {
		padding: 0
	},
	feeDropShadow: {
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowRadius: 30,
		shadowOpacity: 0.25,
		elevation: 8
	}
})
