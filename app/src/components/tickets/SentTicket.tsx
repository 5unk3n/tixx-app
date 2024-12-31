import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UI } from '@/constants/ui'
import { EventTicketsUserTransfer } from '@/types'

import TicketListItem from './TicketListItem'

interface SentTicketProps {
	transferredEventTicket: EventTicketsUserTransfer
}

export default function SentTicket({
	transferredEventTicket,
	...props
}: SentTicketProps) {
	const navigation = useNavigation()
	// const { mutate: actionEventTicketTransfer } = useActionEventTicketTransfer()
	// const [dialogProps, setDialogProps] = useState({
	// 	visible: false,
	// 	title: '',
	// 	leftButtonText: '',
	// 	rightButtonText: '',
	// 	onLeftPress: () => {},
	// 	onRightPress: () => {}
	// })

	return (
		<TicketListItem
			eventTicket={transferredEventTicket.eventTicket}
			onPress={() =>
				navigation.navigate('SentTicketDetail', transferredEventTicket)
			}
			statusText={`${
				transferredEventTicket.toUser
					? `To. ${transferredEventTicket.toUser.nickname}님`
					: ''
			} ${
				transferredEventTicket.status === 1
					? UI.COMMON.WAITING
					: transferredEventTicket.status === 2
						? UI.COMMON.ACCEPTED
						: transferredEventTicket.status === 3
							? UI.COMMON.REJECT
							: UI.COMMON.CANCEL
			}`}
			{...props}
		>
			{/* TODO: 필요없으면 지우기 */}
			{/* {type === 'sent' && transferredEventTicket.status === 1 && (
				<CustomButton
					onPress={() =>
						actionEventTicketTransfer({
							action: 'cancel',
							data: { eventTicketTransferId: transferredEventTicket.id }
						})
					}
					mode="contained"
					labelVariant="body2Medium"
					labelStyle={style.button}
					className="mt-3"
				>
					취소
				</CustomButton>
			)} */}
		</TicketListItem>
	)
}
