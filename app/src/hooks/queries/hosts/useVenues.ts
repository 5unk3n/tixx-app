import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { getVenues } from '@/apis/hosts/getVenues'
import { EventFilter } from '@/types'

export const useVenues = (filter?: EventFilter) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['host', 'venue', filter],
		queryFn: ({ pageParam = 1 }) =>
			getVenues({
				...filter,
				page: pageParam,
				isActive: false,
				isVenue: true
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
