import { useQuery } from '@tanstack/react-query'

import { getIsFollowing } from '@/apis/hosts/getIsFollowing'

export function useIsFollowingHost(hostId: number) {
	return useQuery({
		queryKey: ['isFollowingHost', hostId],
		queryFn: () => getIsFollowing(hostId)
	})
}
