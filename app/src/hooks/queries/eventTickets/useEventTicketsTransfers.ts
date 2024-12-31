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
		queryKey: ['eventTickets', params],
		queryFn: () => getEventTicketsTransfers(params),
		select: (data) =>
			data.sort((a, b) => {
				if (a.status === 1 && b.status !== 1) return -1
				if (a.status !== 1 && b.status === 1) return 1
				return 0
			})
	})
}
