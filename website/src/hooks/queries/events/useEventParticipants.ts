import { useQuery } from '@tanstack/react-query'

import { getEventParticipants } from '@/apis/events/getEventParticipants'

export const useEventParticipants = (
	eventId: number,
	params?: { startDate?: string; endDate?: string }
) => {
	return useQuery({
		queryKey: ['eventParticipants', eventId, params],
		queryFn: () => getEventParticipants(eventId, params),
		enabled: !!eventId
	})
}
