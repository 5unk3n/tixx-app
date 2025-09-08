import { useQuery } from '@tanstack/react-query'

import { getHashtags } from '@/apis/hashtags/getHashtags'

export const useHashtags = () => {
	return useQuery({
		queryKey: ['hashtags'],
		queryFn: getHashtags,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60
	})
}
