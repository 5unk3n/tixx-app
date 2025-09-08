import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { getWishEvents } from '@/apis/events/getWishEvents'

interface UseWishEventsProps {
	limit?: number
}

export const useWishEvents = ({ limit = 10 }: UseWishEventsProps = {}) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', 'wish', limit],
		queryFn: ({ pageParam = 1 }) => getWishEvents(pageParam, limit),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
