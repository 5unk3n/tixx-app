import { useMutation } from '@tanstack/react-query'

import { loginWithOAuth } from '@/apis/auth/login'
import { useAuthStore } from '@/stores/authStore'
import { OAuthProvider } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useLogin = () => {
	const { login } = useAuthStore()

	return useMutation({
		mutationFn: ({
			provider,
			accessToken
		}: {
			provider: OAuthProvider
			accessToken: string
		}) => loginWithOAuth(provider, accessToken),
		onSuccess: async (data) => {
			await login(data.jwt, data.user.provider)
			queryClient.invalidateQueries({ queryKey: ['user'] })
		}
	})
}
