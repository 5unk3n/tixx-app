import { useLogin } from './auth/useLogin'
import { useSignUp } from './auth/useSignup'

import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/authStore'
import { useHostStore } from '@/stores/hostStore'

export const useAuth = () => {
	const { accessToken, clearToken } = useAuthStore()
	const { mutateAsync: login } = useLogin()
	const { mutateAsync: signUp } = useSignUp()
	const { clearHostId } = useHostStore()

	const logout = () => {
		queryClient.clear()
		clearHostId()
		clearToken()
	}

	return {
		accessToken,
		signUp,
		login,
		logout
	}
}
