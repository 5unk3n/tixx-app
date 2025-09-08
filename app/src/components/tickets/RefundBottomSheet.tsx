import { differenceInDays, startOfDay } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCancelPayment } from '@/hooks/queries/orders/useCancelPayment'
import { OrdersResponse } from '@/types'
import { formatDateWithDay, formatTimeRange } from '@/utils/formatters'

import BulletText from '../ui/display/BulletText'
import { CustomText } from '../ui/display/CustomText'
import CustomBottomSheet, {
	BottomSheetRef
} from '../ui/feedback/CustomBottomSheet'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface RefundBottomSheetProps {
	order: OrdersResponse[number]
	isBottomSheetOpen: boolean
	onDismiss: () => void
}

export default function RefundBottomSheet({
	order,
	isBottomSheetOpen,
	onDismiss
}: RefundBottomSheetProps) {
	const { t, i18n } = useTranslation()
	const { bottom } = useSafeAreaInsets()
	const bottomSheetRef = useRef<BottomSheetRef>(null)
	const [selectedQuantity, setSelectedQuantity] = useState(1)
	const [isDialogVisible, setIsDialogVisible] = useState(false)
	const isMinimum = selectedQuantity === 1
	const isMaximum = selectedQuantity === order.orderItems[0].quantity

	const daysUntilStart = differenceInDays(
		startOfDay(order.orderItems[0].ticket.startAt),
		startOfDay(new Date())
	)
	const penaltyRate =
		daysUntilStart === 0 ? 0.1 : daysUntilStart === 1 ? 0.05 : 0
	const penaltyAmount =
		selectedQuantity * order.orderItems[0].ticket.price! * penaltyRate

	const { mutateAsync: cancelPayment, isPending } = useCancelPayment()

	const handleCancelTicket = async (quantity: number) => {
		await cancelPayment(
			order.orderItems[0].eventTickets
				.map((eventTicket) => ({ eventTicketId: eventTicket.id }))
				.slice(0, quantity)
		)
		onDismiss()
	}

	const handleQuantityChange = (action: 'increase' | 'decrease') => {
		if (
			action === 'increase' &&
			selectedQuantity < order.orderItems[0].quantity
		) {
			setSelectedQuantity((prev) => prev + 1)
		} else if (action === 'decrease' && selectedQuantity > 1) {
			setSelectedQuantity((prev) => prev - 1)
		}
	}

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
			snapPoints={[i18n.language === 'ko' ? 460 + bottom : 494 + bottom]}
			isDraggable={false}
			onBackDropPress={onDismiss}
			className="pt-7 px-5"
		>
			<CustomText
				variant="headline1Semibold"
				className="mb-6 text-grayscale-100"
			>
				{t('tickets.refund.title')}
			</CustomText>
			<View className="py-4 px-5 mb-6 rounded-lg border-[1px] border-grayscale-700">
				<CustomText variant="headline1Medium" className="mb-2">
					{order.orderItems[0].ticket.event.name}
				</CustomText>
				<View className="flex-row justify-between">
					<View className="gap-2">
						<CustomText variant="body2Medium" className="text-grayscale-400">
							{formatDateWithDay(
								order.orderItems[0].ticket.startAt,
								i18n.language
							)}
						</CustomText>
						<CustomText variant="body2Medium" className="text-grayscale-400">
							{t(
								'tickets.entryTime',
								formatTimeRange(
									order.orderItems[0].ticket.startAt,
									order.orderItems[0].ticket.endAt
								)
							)}
						</CustomText>
					</View>
					<View className="flex-row w-[90] justify-between items-center">
						<IconButton
							icon="minus"
							onPress={() => handleQuantityChange('decrease')}
							className={`w-7 h-7 m-0 rounded-[4px] ${isMinimum ? 'bg-secondary' : 'bg-primary'}`}
							iconColor="black"
							disabled={isMinimum}
							size={20}
						/>
						<CustomText variant="body1Medium">{selectedQuantity}</CustomText>
						<IconButton
							icon="plus"
							onPress={() => handleQuantityChange('increase')}
							className={`w-7 h-7 m-0 rounded-[4px]  ${isMaximum ? 'bg-secondary' : 'bg-primary'}`}
							iconColor="black"
							disabled={isMaximum}
							size={20}
						/>
					</View>
				</View>
			</View>
			<View className="py-4 px-5 mb-8 rounded-lg bg-grayscale-700">
				<CustomText variant="body1Medium" className="mb-3 text-grayscale-300">
					{t('tickets.refund.checkBeforeRefund')}
				</CustomText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.refund.notices.ticketDestruction')}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.refund.notices.ticketRecovery')}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.refund.notices.refundMethod')}
				</BulletText>
			</View>
			<View className="flex-row gap-3 ">
				<CustomButton labelVariant="body1Semibold" onPress={onDismiss} flex>
					{t('common.close')}
				</CustomButton>
				<CustomButton
					labelVariant="body1Semibold"
					flex
					colorVariant="secondary"
					onPress={() => setIsDialogVisible(true)}
				>
					{t('common.actions.cancel')}
				</CustomButton>
			</View>
			<CustomDialog visible={isDialogVisible}>
				<CustomDialog.Title>
					{t('tickets.refund.confirmDialog.title', {
						days: daysUntilStart,
						amount: penaltyAmount
					})}
				</CustomDialog.Title>
				<CustomDialog.Actions>
					<CustomButton
						labelVariant="body1Semibold"
						colorVariant="secondary"
						onPress={() => setIsDialogVisible(false)}
						flex
					>
						{t('common.actions.cancel')}
					</CustomButton>
					<CustomButton
						labelVariant="body1Semibold"
						mode="contained"
						onPress={() => handleCancelTicket(selectedQuantity)}
						disabled={isPending}
						loading={isPending}
						flex
					>
						{t('common.confirm')}
					</CustomButton>
				</CustomDialog.Actions>
			</CustomDialog>
		</CustomBottomSheet>
	)
}
