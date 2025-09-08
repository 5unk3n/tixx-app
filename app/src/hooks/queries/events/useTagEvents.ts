import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { getTagEvents } from '@/apis/events/getTagEvents'

interface UseTagEventsOptions {
	tag: string
	limit?: number
}

export const useTagEvents = ({ tag, limit = 10 }: UseTagEventsOptions) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', 'tag', tag, limit],
		queryFn: ({ pageParam = 1 }) => getTagEvents(tag, pageParam, limit),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
