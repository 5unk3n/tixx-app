import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

import { UI } from '@/constants/ui'
import { useDeleteEventTickets } from '@/hooks/queries/eventTickets/useDeleteEventTickets'
import { GroupedEventTicket } from '@/types'
import { formatTicketDate, formatTicketTime } from '@/utils/formatters'

import EventTags from '../events/EventTags'
import BulletText from '../ui/display/BulletText'
import { CustomText } from '../ui/display/CustomText'
import CustomBottomSheet, {
	BottomSheetRef
} from '../ui/feedback/CustomBottomSheet'
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
	const bottomSheetRef = useRef<BottomSheetRef>(null)
	const { mutateAsync: deleteEventTickets, isPending } = useDeleteEventTickets()
	const [selectedQuantity, setSelectedQuantity] = useState(1)
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
			snapPoints={[472]}
			isDraggable={false}
			onBackDropPress={onDismiss}
			className="pt-7 px-5"
		>
			<CustomText variant="headline1Semibold" className="mb-6 text-grayscale-8">
				{UI.TICKETS.CANCEL}
			</CustomText>
			<View className="py-4 px-5 mb-6 rounded-lg border-[1px] border-grayscale-2">
				<EventTags tags={groupedEventTicket.event.tags} className="mb-2" />
				<CustomText variant="headline1Medium" className="mb-2">
					{groupedEventTicket.event.name}
				</CustomText>
				<View className="flex-row justify-between">
					<View className="gap-2">
						<CustomText variant="body2Medium" className="text-grayscale-5">
							{formatTicketDate(groupedEventTicket.startAt)}
						</CustomText>
						<CustomText variant="body2Medium" className="text-grayscale-5">
							{formatTicketTime(
								groupedEventTicket.startAt,
								groupedEventTicket.endAt
							)}
						</CustomText>
					</View>
					<View className="flex-row w-[90] justify-between items-center">
						<IconButton
							icon="minus"
							onPress={() => handleQuantityChange('decrease')}
							className={`w-7 h-7 m-0 rounded-[4px] ${isMinimum ? 'bg-secondary' : 'bg-primary'}`}
							disabled={isMinimum}
							size={20}
						/>
						<CustomText variant="body1Medium">{selectedQuantity}</CustomText>
						<IconButton
							icon="plus"
							onPress={() => handleQuantityChange('increase')}
							className={`w-7 h-7 m-0 rounded-[4px]  ${isMaximum ? 'bg-secondary' : 'bg-primary'}`}
							disabled={isMaximum}
							size={20}
						/>
					</View>
				</View>
			</View>
			<View className="py-4 px-5 mb-8 rounded-lg bg-grayscale-2">
				<CustomText variant="body1Medium" className="mb-3 text-grayscale-6">
					{UI.TICKETS.CANCEL_NOTICE_TITLE}
				</CustomText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-4">
					{UI.TICKETS.CANCEL_DESTRUCTION_NOTICE}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-4">
					{UI.TICKETS.RECOVERY_NOTICE}
				</BulletText>
			</View>
			<View className="flex-row gap-3 ">
				<CustomButton labelVariant="body1Semibold" onPress={onDismiss} flex>
					{UI.COMMON.CLOSE}
				</CustomButton>
				<CustomButton
					labelVariant="body1Semibold"
					flex
					colorVariant="secondary"
					onPress={() => handleCancelTicket(selectedQuantity)}
					disabled={isPending}
					loading={isPending}
				>
					{UI.TICKETS.CANCEL}
				</CustomButton>
			</View>
		</CustomBottomSheet>
	)
}
