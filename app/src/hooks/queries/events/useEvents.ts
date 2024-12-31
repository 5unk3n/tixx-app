import { useQuery } from '@tanstack/react-query'

import { getEvents } from '@/apis/events/getEvents'

export const useEvents = () => {
	return useQuery({
		queryKey: ['events'],
		queryFn: getEvents
	})
}
