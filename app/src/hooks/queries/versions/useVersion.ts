import { useQuery } from '@tanstack/react-query'

import { getVersion } from '@/apis/version/getVersion'
import { Version } from '@/types'

export function useVersion(os: Version['os']) {
	return useQuery({
		queryKey: ['version', os],
		queryFn: () => getVersion(os),
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60
	})
}
