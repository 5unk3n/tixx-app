import { useSuspenseQuery } from '@tanstack/react-query'

import { getEventTickets } from '@/apis/eventTickets/getEventTickets'
import {
	EventTicket,
	EventTickets,
	EventTicketStatus,
	GroupedEventTicket
} from '@/types'

const filterEventTicket = (
	eventTickets: EventTickets,
	statuses: EventTicketStatus[]
) => {
	return eventTickets.filter((eventTicket) => {
		return statuses.some((status) => getFilterCondition(eventTicket, status))
	})
}

const getFilterCondition = (
	eventTicket: EventTicket,
	status: EventTicketStatus
) => {
	switch (status) {
		case 'available':
			return (
				eventTicket.usedAt === null &&
				eventTicket.deletedAt === null &&
				new Date(eventTicket.endAt) >= new Date()
			)
		case 'used':
			return eventTicket.usedAt !== null
		case 'expired':
			return (
				eventTicket.usedAt === null &&
				eventTicket.deletedAt === null &&
				new Date(eventTicket.endAt) < new Date()
			)
		case 'cancelled':
			return eventTicket.deletedAt !== null
		default:
			return () => true
	}
}

const groupEventTickets = (eventTickets: EventTickets) => {
	const groupedMap = eventTickets.reduce((acc, eventTicket) => {
		const existing = acc.get(eventTicket.ticketId)

		if (existing) {
			existing.ids.push(eventTicket.id)
		} else {
			// XXX: status 로직 개선
			const status = getFilterCondition(eventTicket, 'available')
				? 'available'
				: getFilterCondition(eventTicket, 'used')
					? 'used'
					: getFilterCondition(eventTicket, 'expired')
						? 'expired'
						: 'cancelled'

			const copiedTicket = {
				...eventTicket,
				event: {
					...eventTicket.event,
					place: { ...eventTicket.event.place },
					tags: [...eventTicket.event.tags]
				},
				ids: [eventTicket.id],
				status
			} satisfies GroupedEventTicket
			acc.set(eventTicket.ticketId, copiedTicket)
		}
		return acc
	}, new Map())

	return Array.from(groupedMap.values()) as GroupedEventTicket[]
}

export const useEventTickets = (eventTicketStatuses: EventTicketStatus[]) => {
	return useSuspenseQuery({
		queryKey: ['eventTickets', eventTicketStatuses],
		queryFn: getEventTickets,
		select: (data) => {
			const filteredEventTicket = filterEventTicket(data, eventTicketStatuses)
			return groupEventTickets(filteredEventTicket)
		}
	})
}
