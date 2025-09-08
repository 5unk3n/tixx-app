import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { getEvents } from '@/apis/events/getEvents'
import { EventFilter } from '@/types'

export const useSearchEvents = (filter?: EventFilter) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', 'search', filter],
		queryFn: ({ pageParam = 1 }) =>
			getEvents({
				page: pageParam,
				isActive: false,
				isVenue: false,
				...filter
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
