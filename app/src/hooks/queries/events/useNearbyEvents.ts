import { useSuspenseQuery } from '@tanstack/react-query'

import { getNearbyEvents } from '@/apis/events/getNearbyEvents'
import { NearbyEventsParams } from '@/types'

export const useNearbyEvents = (options: NearbyEventsParams) => {
	return useSuspenseQuery({
		queryKey: ['events', 'nearby', options],
		queryFn: () => getNearbyEvents(options),
		staleTime: 0,
		gcTime: 0
	})
}
