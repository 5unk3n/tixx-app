import { useQuery } from '@tanstack/react-query'

import { getHost } from '@/apis/hosts/getHost'

export function useHost(hostId: number) {
	return useQuery({
		queryKey: ['host', hostId],
		queryFn: () => getHost(hostId)
	})
}
