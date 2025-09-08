import { useInfiniteQuery } from '@tanstack/react-query'

import { getEvents } from '@/apis/events/getEvents'

interface UseRecommendedEventsOptions {
	limit?: number
	isVenue?: boolean
}

export const useRecommendedEvents = ({
	limit = 10,
	isVenue = false
}: UseRecommendedEventsOptions = {}) => {
	return useInfiniteQuery({
		queryKey: ['events', 'recommended', limit, isVenue],
		queryFn: ({ pageParam = 1 }) =>
			getEvents({
				isRecommended: true,
				page: pageParam,
				limit,
				isActive: true,
				isVenue
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
