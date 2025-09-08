import { useInfiniteQuery } from '@tanstack/react-query'

import { getPaginatedEvents } from '@/apis/events/getPaginatedEvents'
import { EventFilter } from '@/types'

export const usePaginatedEvents = (filter?: EventFilter) => {
	return useInfiniteQuery({
		queryKey: ['events', 'search', filter],
		queryFn: ({ pageParam = 1 }) =>
			getPaginatedEvents({
				page: pageParam,
				isActive: false,
				isVenue: false,
				...filter
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1,
		enabled: Boolean(filter?.searchTerm)
	})
}
