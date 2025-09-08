import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, ScrollView, StyleSheet, Image } from 'react-native'
import { Divider } from 'react-native-paper'

import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import { useEvent } from '@/hooks/queries/events/useEvent'
import { useOrder } from '@/hooks/queries/orders/useOrder'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'PaymentCancelDetail'>

export default function PaymentCancelDetailScreen({ route }: Props) {
	const { orderId } = route.params
	const { colors } = useCustomTheme()
	const { t } = useTranslation()
	const navigation = useNavigation()

	const { data: order, isPending, isError } = useOrder(orderId)
	const eventId = order?.orderItems[0].ticket.event.id as number
	const { data: event } = useEvent(eventId)

	if (isPending || isError) {
		return null
	}

	const isPartialCancel = order.status === 5
	const isEndedEvent =
		parseISO(
			`${order.orderItems[0].ticket.event.endDate}T${order.orderItems[0].ticket.event.endTime}Z`
		) < new Date()

	return (
		<ScrollView style={styles.container}>
			<View>
				<CustomText variant="headline2Medium">
					{`${format(order.createdAt, 'yyyy.MM.dd HH:mm')} (${t('tickets.payment.cancel.completionDateTime')})`}
				</CustomText>
				<Divider className="my-4 bg-grayscale-600" />
				<View>
					<CustomText variant="headline2Medium">
						{isPartialCancel
							? t('tickets.payment.cancel.partialCanceled', {
									count:
										order.orderItems[0].quantity -
										order.orderItems[0].eventTickets.length
								})
							: t('tickets.payment.cancel.canceledTickets', {
									quantity: order.orderItems[0].quantity
								})}
					</CustomText>
					<CustomText
						variant="body3Regular"
						className="mt-4 text-grayscale-300"
					>
						{isPartialCancel
							? t('tickets.payment.cancel.partialPrefix') +
								t('tickets.payment.cancel.completedCancel', {
									method: order.paymentMethod
								})
							: t('tickets.payment.cancel.completedCancel', {
									method: order.paymentMethod
								})}
					</CustomText>
					<View className="mt-6 flex-row">
						<Image
							source={{ uri: order.orderItems[0].ticket.event.imageUrl }}
							className="w-[90] h-[113] rounded-lg"
						/>
						<View className="flex-1 ml-4">
							<CustomText variant="body3Medium">
								{order.orderItems[0].ticket.event.name}
							</CustomText>
							<CustomText
								variant="body3Regular"
								className="mt-1 text-grayscale-300"
							>
								{/* FIXME: 호스트 이름  */}{' '}
							</CustomText>
							<CustomText
								variant="body3Regular"
								className="mt-1 text-grayscale-300"
							>
								{t('tickets.payment.cancel.priceAndQuantity', {
									price: order.orderItems[0].amountKrw.toLocaleString(),
									quantity: order.orderItems[0].quantity
								})}
							</CustomText>
							<View className="mt-auto flex-row">
								{!isEndedEvent && (
									<CustomButton
										mode="contained"
										size="sm"
										style={{ backgroundColor: colors.grayscale[800] }}
										labelStyle={{ color: colors.grayscale[100] }}
										onPress={() => {
											navigation.navigate('EventDetail', { event: event! })
										}}
										flex
										className="ml-2"
									>
										{t('orders.repurchase')}
									</CustomButton>
								)}
							</View>
						</View>
					</View>
				</View>
				<Divider className="my-4 bg-grayscale-600" />
				<CustomText variant="headline2Medium" className="mb-6">
					{t('tickets.payment.cancel.requestInfo')}
				</CustomText>
				<View className="gap-4">
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.cancel.requestDateTime')}
						</CustomText>
						<CustomText variant="body1Regular">
							{order.orderItems[0].cancelledAt
								? format(
										order.orderItems[0].cancelledAt,
										'yyyy.MM.dd | HH:mm:ss'
									)
								: ''}
						</CustomText>
					</View>
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.cancel.completionTime')}
						</CustomText>
						<CustomText variant="body1Regular">
							{order.orderItems[0].cancelledAt
								? format(
										order.orderItems[0].cancelledAt,
										'yyyy.MM.dd | HH:mm:ss'
									)
								: ''}
						</CustomText>
					</View>
				</View>
			</View>
			<View className="mt-10">
				<CustomText variant="headline2Medium" className="mb-6">
					{t('tickets.payment.cancel.refundInfo')}
				</CustomText>
				<View className="gap-4">
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.cancel.productPaymentAmount')}
						</CustomText>
						<CustomText variant="body1Regular">
							{`${order.orderItems[0].amountKrw.toLocaleString()}${t('orders.currency')}`}
						</CustomText>
					</View>
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.cancel.refundMethod')}
						</CustomText>
						<CustomText variant="body1Regular">
							{order.paymentMethod}
						</CustomText>
					</View>
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.cancel.ticketQuantity')}
						</CustomText>
						<CustomText variant="body1Regular">
							{t('tickets.payment.cancel.canceledCount', {
								count:
									order.orderItems[0].quantity -
									order.orderItems[0].eventTickets.length
							})}
						</CustomText>
					</View>
				</View>
			</View>
			<View className="mt-20 flex-row justify-between">
				<CustomText variant="body1Semibold" className="text-grayscale-400">
					{t('tickets.payment.cancel.expectedRefundAmount')}
				</CustomText>
				<CustomText variant="headline2Medium" className="text-primary">
					{`${order.orderItems[0].cancelledAmountKrw?.toLocaleString()}${t('orders.currency')}`}
				</CustomText>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 35,
		paddingHorizontal: 16
	},
	textQuantity: {
		marginHorizontal: 'auto'
	},
	textAmount: {
		marginLeft: 'auto'
	}
})
