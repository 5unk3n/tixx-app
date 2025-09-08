import { useQuery } from '@tanstack/react-query'

import { getClientTransfers } from '@/apis/tickets/getClientTransfers'

export const useClientTransfers = (eventId: number) => {
	return useQuery({
		queryKey: ['clientTransfers', eventId],
		queryFn: () => getClientTransfers(eventId)
	})
}
