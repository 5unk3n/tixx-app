import { useInfiniteQuery } from '@tanstack/react-query'

import { getFollowingHosts } from '@/apis/hosts/getFollowingHosts'

export function useFollowingHosts(page: number, limit: number) {
	return useInfiniteQuery({
		queryKey: ['followingHosts', page, limit],
		queryFn: ({ pageParam = 1 }) =>
			getFollowingHosts({ page: pageParam, limit }),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1
	})
}
