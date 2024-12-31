import { useQuery } from '@tanstack/react-query'

import { getReactions } from '@/apis/events/getReactions'

export const useReactions = (eventId: number) => {
	return useQuery({
		queryKey: ['events', eventId, 'reactions'],
		queryFn: () => getReactions(eventId)
	})
}
