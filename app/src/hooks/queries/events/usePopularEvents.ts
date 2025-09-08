import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { getEvents } from '@/apis/events/getEvents'

interface UsePopularEventsOptions {
	limit?: number
}

export const usePopularEvents = ({
	limit = 10
}: UsePopularEventsOptions = {}) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', 'popular', limit],
		queryFn: ({ pageParam = 1 }) =>
			getEvents({
				sort: 'popular',
				page: pageParam,
				limit,
				isActive: true,
				isVenue: false
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
