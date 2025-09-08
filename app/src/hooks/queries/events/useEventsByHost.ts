import { useQuery } from '@tanstack/react-query'

import { getEventsByHost } from '@/apis/events/getEventsByHost'

export const useEventsByHost = (hostId: number) => {
	return useQuery({
		queryKey: ['events', 'host', hostId],
		queryFn: () => getEventsByHost(hostId)
	})
}
