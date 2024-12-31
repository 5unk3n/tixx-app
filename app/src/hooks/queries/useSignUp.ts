import { useMutation } from '@tanstack/react-query'

import { signUp } from '@/apis/auth/signUp'
import { useAuthStore } from '@/stores/authStore'
import { SignUpInput } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useSignUp = () => {
	const { login } = useAuthStore()

	return useMutation({
		mutationFn: (data: SignUpInput) => signUp(data),
		onSuccess: async (data) => {
			await login(data.jwt, data.user.provider)
			queryClient.invalidateQueries({ queryKey: ['user'] })
		}
	})
}
