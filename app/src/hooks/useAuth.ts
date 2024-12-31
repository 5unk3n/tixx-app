import { useEffect } from 'react'

import { useAuthStore } from '@/stores/authStore'

import { useLogin } from './queries/useLogin'
import { useSignUp } from './queries/useSignUp'
import { useFCMToken } from './useFCMToken'

export const useAuth = () => {
	const { isAuthenticated, recentLoginProvider, logout, initializeAuth } =
		useAuthStore()
	const { mutateAsync: login } = useLogin()
	const { mutateAsync: signUp } = useSignUp()
	const { updateToken, removeToken } = useFCMToken()

	const logoutAndRemoveToken = async () => {
		await removeToken()
		logout()
	}

	useEffect(() => {
		if (isAuthenticated) {
			updateToken()
		}
	}, [isAuthenticated, updateToken])

	return {
		isAuthenticated,
		recentLoginProvider,
		signUp,
		login,
		logout: logoutAndRemoveToken,
		initializeAuth
	}
}
