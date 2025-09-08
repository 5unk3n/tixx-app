import { useSuspenseQuery } from '@tanstack/react-query'

import { getEventTickets } from '@/apis/eventTickets/getEventTickets'
import {
	EventTicket,
	EventTickets,
	EventTicketStatus,
	GroupedEventTicket
} from '@/types'

// 정렬 우선순위 정의
const SORT_PRIORITY: Record<EventTicketStatus, number> = {
	available: 1,
	used: 2,
	expired: 3,
	cancelled: 4
}

// 이벤트 티켓 상태 판별 함수
const getEventTicketStatus = (eventTicket: EventTicket): EventTicketStatus => {
	if (eventTicket.deletedAt !== null) {
		return 'cancelled'
	}

	if (eventTicket.usedAt !== null) {
		return 'used'
	}

	const now = new Date()
	const endDate = new Date(eventTicket.ticket.endAt)

	if (endDate < now) {
		return 'expired'
	}

	return 'available'
}

// 이벤트 티켓 필터링 함수
const filterEventTickets = (
	eventTickets: EventTickets,
	statuses: EventTicketStatus[]
): EventTickets => {
	if (statuses.length === 0) return eventTickets

	return eventTickets.filter((eventTicket) => {
		const status = getEventTicketStatus(eventTicket)
		return statuses.includes(status)
	})
}

// 이벤트 티켓 정렬 함수
const sortEventTickets = (eventTickets: EventTickets): EventTickets => {
	return [...eventTickets].sort((a, b) => {
		// 1. 상태별 우선순위 정렬
		const statusA = getEventTicketStatus(a)
		const statusB = getEventTicketStatus(b)

		if (statusA !== statusB) {
			return SORT_PRIORITY[statusA] - SORT_PRIORITY[statusB]
		}

		// 2. 같은 상태 내에서는 이벤트 시작 시간 기준 정렬 (최신순)
		const eventStartA = new Date(a.event?.startDate || a.createdAt).getTime()
		const eventStartB = new Date(b.event?.startDate || b.createdAt).getTime()

		if (eventStartA !== eventStartB) {
			return eventStartB - eventStartA
		}

		// 3. 이벤트 시작 시간이 같으면 생성 시간 기준 정렬 (최신순)
		const createdAtA = new Date(a.createdAt).getTime()
		const createdAtB = new Date(b.createdAt).getTime()

		return createdAtB - createdAtA
	})
}

// 이벤트 티켓 그루핑 함수 (최적화된 버전)
const groupEventTickets = (
	eventTickets: EventTickets
): GroupedEventTicket[] => {
	const groupedMap = new Map<number, GroupedEventTicket>()

	// 한 번의 순회로 그루핑 및 상태 계산
	for (const eventTicket of eventTickets) {
		const existing = groupedMap.get(eventTicket.ticketId)

		if (existing) {
			// 기존 그룹에 추가
			existing.ids.push(eventTicket.id)

			// 그룹의 대표 상태 업데이트 (가장 우선순위가 높은 상태로)
			const currentStatus = getEventTicketStatus(eventTicket)
			const existingStatusPriority = SORT_PRIORITY[existing.status]
			const currentStatusPriority = SORT_PRIORITY[currentStatus]

			if (currentStatusPriority < existingStatusPriority) {
				existing.status = currentStatus
			}
		} else {
			// 새로운 그룹 생성
			const status = getEventTicketStatus(eventTicket)

			const groupedTicket: GroupedEventTicket = {
				...eventTicket,
				// 이벤트 객체 깊은 복사 (안전성 보장)
				event: eventTicket.event
					? {
							...eventTicket.event,
							place: { ...eventTicket.event.place },
							tags: [...eventTicket.event.tags]
						}
					: eventTicket.event,
				ids: [eventTicket.id],
				status
			}

			groupedMap.set(eventTicket.ticketId, groupedTicket)
		}
	}

	// 그룹화된 결과를 배열로 변환하고 정렬
	const groupedTickets = Array.from(groupedMap.values())

	// 그룹화된 티켓들도 정렬 (상태별, 이벤트 시작 시간별)
	return groupedTickets.sort((a, b) => {
		// 1. 상태별 우선순위 정렬
		if (a.status !== b.status) {
			return SORT_PRIORITY[a.status] - SORT_PRIORITY[b.status]
		}

		// 2. 같은 상태 내에서는 이벤트 시작 시간 기준 정렬 (최신순)
		const eventStartA = new Date(a.event?.startDate || a.createdAt).getTime()
		const eventStartB = new Date(b.event?.startDate || b.createdAt).getTime()

		if (eventStartA !== eventStartB) {
			return eventStartB - eventStartA
		}

		// 3. 이벤트 시작 시간이 같으면 생성 시간 기준 정렬 (최신순)
		const createdAtA = new Date(a.createdAt).getTime()
		const createdAtB = new Date(b.createdAt).getTime()

		return createdAtB - createdAtA
	})
}

export const useEventTickets = (eventTicketStatuses: EventTicketStatus[]) => {
	return useSuspenseQuery({
		queryKey: ['eventTickets', eventTicketStatuses],
		queryFn: getEventTickets,
		select: (data) => {
			// 1. 필터링
			const filteredTickets = filterEventTickets(data, eventTicketStatuses)

			// 2. 정렬
			const sortedTickets = sortEventTickets(filteredTickets)

			// 3. 그루핑
			return groupEventTickets(sortedTickets)
		}
	})
}
