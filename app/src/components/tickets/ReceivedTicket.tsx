import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { UI } from '@/constants/ui'
import { useActionEventTicketTransfer } from '@/hooks/queries/eventTickets/useActionEventTicketTransfer'
import { EventTicketsUserTransfer } from '@/types'

import TicketListItem from './TicketListItem'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface ReceivedTicketProps {
	transferredEventTicket: EventTicketsUserTransfer
}

export default function ReceivedTicket({
	transferredEventTicket,
	...props
}: ReceivedTicketProps) {
	const navigation = useNavigation()
	const { mutateAsync: actionEventTicketTransfer } =
		useActionEventTicketTransfer()
	const [dialogProps, setDialogProps] = useState({
		visible: false,
		title: '',
		leftButtonText: '',
		rightButtonText: '',
		onLeftPress: () => {},
		onRightPress: () => {}
	})

	return (
		<TicketListItem
			eventTicket={transferredEventTicket.eventTicket}
			statusText={`From. ${transferredEventTicket.fromUser.nickname}님`}
			{...props}
		>
			{transferredEventTicket.status === 1 && (
				<View className="flex-row gap-2 pt-3">
					<CustomButton
						onPress={() =>
							setDialogProps({
								visible: true,
								title: UI.COMMON.REJECT_CONFIRM,
								leftButtonText: UI.COMMON.REJECT,
								rightButtonText: UI.COMMON.CANCEL,
								onLeftPress: async () => {
									await actionEventTicketTransfer({
										action: 'reject',
										data: { eventTicketTransferId: transferredEventTicket.id }
									})
									setDialogProps({
										...dialogProps,
										visible: false
									})
								},
								onRightPress: () =>
									setDialogProps({
										...dialogProps,
										visible: false
									})
							})
						}
						mode="contained"
						labelVariant="body2Medium"
						labelStyle={style.button}
						flex
						colorVariant="secondary"
					>
						{UI.COMMON.REJECT}
					</CustomButton>
					<CustomButton
						onPress={() =>
							setDialogProps({
								visible: true,
								title: UI.COMMON.ACCEPT_CONFIRM,
								leftButtonText: UI.COMMON.CANCEL,
								rightButtonText: UI.COMMON.ACCEPT,
								onLeftPress: () =>
									setDialogProps({ ...dialogProps, visible: false }),
								onRightPress: async () => {
									setDialogProps({ ...dialogProps, visible: false })
									await actionEventTicketTransfer({
										action: 'accept',
										data: { eventTicketTransferId: transferredEventTicket.id }
									})
									navigation.navigate(
										'ReceivedTicketDetail',
										transferredEventTicket
									)
								}
							})
						}
						mode="contained"
						labelVariant="body2Medium"
						labelStyle={style.button}
						flex
					>
						{UI.COMMON.ACCEPT}
					</CustomButton>
				</View>
			)}
			<CustomDialog {...dialogProps} />
		</TicketListItem>
	)
}

const style = StyleSheet.create({
	button: {
		marginVertical: 13
	}
})
