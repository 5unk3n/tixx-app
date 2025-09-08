import { useSuspenseQuery } from '@tanstack/react-query'

import { getEventTicketsTransfers } from '@/apis/eventTickets/getEventTicketsTransfers'
import { EventTicketsTransfersParams } from '@/types'

import { useUser } from '../useUser'

export const useEventTicketsTransfers = (
	type: 'received' | 'sent',
	isPending?: boolean
) => {
	const { data: user } = useUser()

	const params = {
		fromUserId: type === 'received' ? undefined : user?.id,
		toUserId: type === 'received' ? user?.id : undefined,
		status: isPending ? 1 : undefined
	} satisfies EventTicketsTransfersParams

	return useSuspenseQuery({
		queryKey: ['eventTicketTransfers', params],
		queryFn: () => getEventTicketsTransfers(params),
		select: (data) => {
			return [...data].sort((a, b) => {
				// 1. 'pending' 상태(status: 1)를 최상단으로 정렬
				if (a.status === 1 && b.status !== 1) return -1
				if (a.status !== 1 && b.status === 1) return 1

				// 2. 상태가 같을 경우, 이벤트 시작일 기준 내림차순 정렬 (최신순)
				const eventDateA = new Date(
					a.eventTicket?.event?.startDate || a.createdAt
				).getTime()
				const eventDateB = new Date(
					b.eventTicket?.event?.startDate || b.createdAt
				).getTime()

				if (eventDateA !== eventDateB) {
					return eventDateB - eventDateA
				}

				// 3. 이벤트 시작일도 같을 경우, 생성일 기준 내림차순 정렬 (최신순)
				const createdAtA = new Date(a.createdAt).getTime()
				const createdAtB = new Date(b.createdAt).getTime()

				return createdAtB - createdAtA
			})
		}
	})
}
