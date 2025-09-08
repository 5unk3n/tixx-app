import { useMutation } from '@tanstack/react-query'

import { signup } from '@/apis/auth/signup'
import { queryClient } from '@/lib/queryClient'

export const useSignUp = () => {
	return useMutation({
		mutationFn: signup,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['profile'] })
		}
	})
}
