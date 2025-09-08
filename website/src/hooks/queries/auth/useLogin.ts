import { useMutation } from '@tanstack/react-query'

import { login } from '@/apis/auth/login'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/authStore'

export const useLogin = () => {
	const { setToken } = useAuthStore()

	return useMutation({
		mutationFn: login,
		onSuccess: async ({ jwt }) => {
			await queryClient.invalidateQueries({ queryKey: ['profile'] })
			setToken(jwt)
		}
	})
}
