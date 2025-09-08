import { useNavigation } from '@react-navigation/native'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Image } from 'react-native'

import { useEvent } from '@/hooks/queries/events/useEvent'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { OrdersResponse } from '@/types'
import { PaymentStatusEnum } from '@/utils/schemas'

import RefundBottomSheet from '../tickets/RefundBottomSheet'
import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'

const OrderStatusMap = {
	[PaymentStatusEnum.enum.PENDING]: 'orders.status.pending',
	[PaymentStatusEnum.enum.READY]: 'orders.status.ready',
	[PaymentStatusEnum.enum.PAID]: 'orders.status.paid',
	[PaymentStatusEnum.enum.CANCELLED]: 'orders.status.cancelled',
	[PaymentStatusEnum.enum.PARTIAL_CANCELLED]: 'orders.status.partialCancelled',
	[PaymentStatusEnum.enum.FAILED]: 'orders.status.failed'
} as const

interface OrderItemProps {
	order: OrdersResponse[number]
}

export default function OrderItem({ order }: OrderItemProps) {
	const { colors } = useCustomTheme()
	const navigation = useNavigation()
	const { t } = useTranslation()
	const [isRefundBottomSheetVisible, setIsRefundBottomSheetVisible] =
		useState(false)
	const isEndedEvent =
		parseISO(
			`${order.orderItems[0].ticket.event.endDate}T${order.orderItems[0].ticket.event.endTime}Z`
		) < new Date()
	const isEndedTicket = parseISO(order.orderItems[0].ticket.endAt) < new Date()

	// FIXME: 이벤트 상세 페이지로 이동 로직 수정
	const { data: event } = useEvent(order.orderItems[0].ticket.event.id)

	return (
		<View>
			<View className="flex-row justify-between">
				<CustomText variant="body1Semibold">
					{format(order.createdAt, 'yy.MM.dd')}
				</CustomText>
				<CustomText
					variant="body3Regular"
					className="underline underline-offset-2 text-grayscale-300"
					onPress={() =>
						navigation.navigate('PaymentDetail', { orderId: order.id })
					}
				>
					{t('orders.paymentDetail')}
				</CustomText>
			</View>
			<CustomText variant="body3Regular" className="mt-6">
				{`${t(OrderStatusMap[order.status])}${
					order.status === PaymentStatusEnum.enum.PARTIAL_CANCELLED ||
					order.status === PaymentStatusEnum.enum.CANCELLED
						? ` | ${format(order.orderItems[0].cancelledAt!, 'yyyy.MM.dd HH:mm')}`
						: ''
				}`}
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
						{t('orders.purchaseDateTime', {
							datetime: order.paidAt
								? format(order.paidAt, 'yyyy.MM.dd HH:mm')
								: ''
						})}
					</CustomText>
					<CustomText
						variant="body3Regular"
						className="mt-1 text-grayscale-300"
					>
						{t('orders.priceAndQuantity', {
							price: order.orderItems[0].amountKrw.toLocaleString(),
							quantity: order.orderItems[0].quantity
						})}
					</CustomText>
					<View className="mt-auto flex-row">
						{order.status === PaymentStatusEnum.enum.PAID && !isEndedTicket && (
							<CustomButton
								mode="contained"
								size="sm"
								style={{ backgroundColor: colors.grayscale[800] }}
								labelStyle={{ color: colors.grayscale[100] }}
								onPress={() => setIsRefundBottomSheetVisible(true)}
								flex
								testID="order-item-cancel-button"
							>
								{t('common.actions.cancel')}
							</CustomButton>
						)}
						{(order.status === PaymentStatusEnum.enum.CANCELLED ||
							order.status === PaymentStatusEnum.enum.PARTIAL_CANCELLED) && (
							<CustomButton
								mode="contained"
								size="sm"
								style={{ backgroundColor: colors.grayscale[800] }}
								labelStyle={{ color: colors.grayscale[100] }}
								onPress={() =>
									navigation.navigate('PaymentCancelDetail', {
										orderId: order.id
									})
								}
								flex
							>
								{t('orders.cancelDetail')}
							</CustomButton>
						)}
						{!isEndedEvent && (
							<CustomButton
								mode="contained"
								size="sm"
								style={{ backgroundColor: colors.grayscale[800] }}
								labelStyle={{ color: colors.grayscale[100] }}
								onPress={() =>
									navigation.navigate('EventDetail', { eventId: event!.id })
								}
								flex
								className="ml-2"
							>
								{t('orders.repurchase')}
							</CustomButton>
						)}
					</View>
				</View>
			</View>
			<RefundBottomSheet
				order={order}
				isBottomSheetOpen={isRefundBottomSheetVisible}
				onDismiss={() => setIsRefundBottomSheetVisible(false)}
			/>
		</View>
	)
}
