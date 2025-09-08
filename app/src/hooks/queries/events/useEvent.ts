import { useQuery } from '@tanstack/react-query'

import { getEvent } from '@/apis/events/getEvent'

export const useEvent = (eventId: number) => {
	return useQuery({
		queryKey: ['events', eventId],
		queryFn: () => getEvent(eventId),
		enabled: !!eventId
	})
}
