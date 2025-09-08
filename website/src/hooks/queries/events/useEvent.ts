import { useQuery } from '@tanstack/react-query'

import { getEvent } from '@/apis/events/getEvent'

export const useEvent = (eventId: string) => {
	return useQuery({
		queryKey: ['event', eventId],
		queryFn: () => getEvent(eventId),
		enabled: !!eventId
	})
}
