import { useQuery } from '@tanstack/react-query'

import { instagramCrawl } from '@/apis/events/instagramCrawl'

export const useInstagramCrawl = (userName: string) => {
	return useQuery({
		queryKey: ['instagram', userName],
		queryFn: () =>
			instagramCrawl({ urls: [`https://www.instagram.com/${userName}`] }),
		staleTime: 3 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		enabled: !!userName
	})
}
