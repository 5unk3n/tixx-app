import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useDeleteEventTickets } from '@/hooks/queries/eventTickets/useDeleteEventTickets'
import { GroupedEventTicket } from '@/types'
import { formatDateWithDay, formatTimeRange } from '@/utils/formatters'

import EventTags from '../events/EventTags'
import BulletText from '../ui/display/BulletText'
import { CustomText } from '../ui/display/CustomText'
import CustomBottomSheet, {
	BottomSheetRef
} from '../ui/feedback/CustomBottomSheet'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface CancelBottomSheetProps {
	groupedEventTicket: Omit<GroupedEventTicket, 'transfers'>
	isBottomSheetOpen: boolean
	onDismiss: () => void
}

export default function CancelBottomSheet({
	groupedEventTicket,
	isBottomSheetOpen,
	onDismiss
}: CancelBottomSheetProps) {
	const { t, i18n } = useTranslation()
	const { bottom } = useSafeAreaInsets()
	const bottomSheetRef = useRef<BottomSheetRef>(null)
	const { mutateAsync: deleteEventTickets, isPending } = useDeleteEventTickets()
	const [selectedQuantity, setSelectedQuantity] = useState(1)
	const [isDialogVisible, setIsDialogVisible] = useState(false)
	const isMinimum = selectedQuantity === 1
	const isMaximum = selectedQuantity === groupedEventTicket.ids.length

	useEffect(() => {
		if (isBottomSheetOpen) {
			bottomSheetRef.current?.present()
		} else {
			bottomSheetRef.current?.dismiss()
		}
	}, [isBottomSheetOpen])

	const handleCancelTicket = async (quantity: number) => {
		const ticketIds = groupedEventTicket.ids
		const targetTickets = ticketIds.filter((_, index) => index < quantity)
		await deleteEventTickets({ eventTicketIds: targetTickets })
		onDismiss()
	}

	const handleQuantityChange = (action: 'increase' | 'decrease') => {
		if (
			action === 'increase' &&
			selectedQuantity < groupedEventTicket.ids.length
		) {
			setSelectedQuantity((prev) => prev + 1)
		} else if (action === 'decrease' && selectedQuantity > 1) {
			setSelectedQuantity((prev) => prev - 1)
		}
	}

	return (
		<CustomBottomSheet
			ref={bottomSheetRef}
			snapPoints={[i18n.language === 'ko' ? 506 + bottom : 540 + bottom]}
			isDraggable={false}
			onBackDropPress={onDismiss}
			className="pt-7 px-5"
		>
			<CustomText
				variant="headline1Semibold"
				className="mb-6 text-grayscale-100"
			>
				{t('tickets.cancel.title')}
			</CustomText>
			<View className="py-4 px-5 mb-6 rounded-lg border-[1px] border-grayscale-700">
				<EventTags tags={groupedEventTicket.event.tags} className="mb-2" />
				<CustomText variant="headline1Medium" className="mb-2">
					{groupedEventTicket.event.name}
				</CustomText>
				<View className="flex-row justify-between">
					<View className="gap-2">
						<CustomText variant="body2Medium" className="text-grayscale-400">
							{formatDateWithDay(
								groupedEventTicket.ticket.startAt,
								i18n.language
							)}
						</CustomText>
						<CustomText variant="body2Medium" className="text-grayscale-400">
							{t(
								'tickets.entryTime',
								formatTimeRange(
									groupedEventTicket.ticket.startAt,
									groupedEventTicket.ticket.endAt
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
					{t('tickets.cancel.checkBeforeCancel')}
				</CustomText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.cancel.notices.ticketDestruction')}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.cancel.notices.ticketRecovery')}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.cancel.notices.refundMethod')}
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
					{t('common.cancel')}
				</CustomButton>
			</View>
			<CustomDialog visible={isDialogVisible}>
				<CustomDialog.Title>
					{t('tickets.cancel.confirmDialog.title')}
				</CustomDialog.Title>
				<CustomDialog.Actions>
					<CustomButton
						labelVariant="body1Semibold"
						colorVariant="secondary"
						onPress={() => setIsDialogVisible(false)}
						flex
					>
						{t('common.close')}
					</CustomButton>
					<CustomButton
						labelVariant="body1Semibold"
						mode="contained"
						onPress={() => handleCancelTicket(selectedQuantity)}
						disabled={isPending}
						loading={isPending}
						flex
					>
						{t('common.cancel')}
					</CustomButton>
				</CustomDialog.Actions>
			</CustomDialog>
		</CustomBottomSheet>
	)
}
