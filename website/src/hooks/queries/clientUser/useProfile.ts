import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../useAuth'

import { getProfile } from '@/apis/clientUser/getProfile'

export const useProfile = (token?: string) => {
	const { accessToken } = useAuth()

	return useQuery({
		queryKey: ['profile'],
		queryFn: () => getProfile(token),
		staleTime: Infinity,
		gcTime: Infinity,
		enabled: !!accessToken || !!token
	})
}
