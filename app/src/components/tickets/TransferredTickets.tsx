import React from 'react'

import { useEventTicketsTransfers } from '@/hooks/queries/eventTickets/useEventTicketsTransfers'

import EmptyTickets from './EmptyTickets'
import ReceivedTicket from './ReceivedTicket'
import SentTicket from './SentTicket'

interface TransferredTicketsProps {
	type: 'received' | 'sent'
}

export default function TransferredTickets({
	type,
	...props
}: TransferredTicketsProps) {
	const {
		data: transferredEventTickets,
		isError,
		isPending
	} = useEventTicketsTransfers(type)

	if (isPending || isError) return

	return transferredEventTickets.length ? (
		transferredEventTickets.map((transferredEventTicket) =>
			type === 'received' ? (
				<ReceivedTicket
					key={transferredEventTicket.id}
					transferredEventTicket={transferredEventTicket}
					{...props}
				/>
			) : (
				<SentTicket
					key={transferredEventTicket.id}
					transferredEventTicket={transferredEventTicket}
					{...props}
				/>
			)
		)
	) : (
		<EmptyTickets />
	)
}
