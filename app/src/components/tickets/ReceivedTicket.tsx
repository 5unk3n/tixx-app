import React from 'react'
import { useTranslation } from 'react-i18next'

import { EventTicketsUserTransfer } from '@/types'

import TicketListItem from './TicketListItem'

interface ReceivedTicketProps {
	transferredEventTicket: EventTicketsUserTransfer
}

export default function ReceivedTicket({
	transferredEventTicket,
	...props
}: ReceivedTicketProps) {
	const { t } = useTranslation()

	return (
		<TicketListItem
			eventTicket={transferredEventTicket.eventTicket}
			statusText={
				transferredEventTicket.fromUser
					? t('tickets.from', {
							nickname: transferredEventTicket.fromUser.nickname
						})
					: ''
			}
			transferId={transferredEventTicket.id}
			selectable={transferredEventTicket.status === 1}
			{...props}
		/>
	)
}
