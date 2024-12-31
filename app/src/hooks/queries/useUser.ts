import { useQuery } from '@tanstack/react-query'

import { getUser } from '@/apis/users/getUser'
import { useAuthStore } from '@/stores/authStore'

export const useUser = () => {
	const { isAuthenticated } = useAuthStore()

	return useQuery({
		queryKey: ['user'],
		queryFn: getUser,
		enabled: isAuthenticated,
		staleTime: Infinity,
		gcTime: Infinity
	})
}
