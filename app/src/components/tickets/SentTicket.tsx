import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { EventTicketsUserTransfer } from '@/types'

import TicketListItem from './TicketListItem'

interface SentTicketProps {
	transferredEventTicket: EventTicketsUserTransfer
}

export default function SentTicket({
	transferredEventTicket,

	...props
}: SentTicketProps) {
	const { t } = useTranslation()
	const navigation = useNavigation()

	return (
		<TicketListItem
			eventTicket={transferredEventTicket.eventTicket}
			onPress={() =>
				navigation.navigate('SentTicketDetail', transferredEventTicket)
			}
			statusText={`${
				transferredEventTicket.toUser
					? t('tickets.to', {
							nickname: transferredEventTicket.toUser.nickname
						})
					: ''
			} ${
				transferredEventTicket.status === 1
					? t('common.status.waiting')
					: transferredEventTicket.status === 2
						? t('common.status.accepted')
						: transferredEventTicket.status === 3
							? t('common.status.rejected')
							: t('tickets.status.canceled')
			}`}
			transferId={transferredEventTicket.id}
			selectable={transferredEventTicket.status === 1}
			{...props}
		/>
	)
}
