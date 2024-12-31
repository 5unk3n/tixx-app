import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Toast from 'react-native-toast-message'

import { deleteAccount } from '@/apis/auth/deleteAccount'
import { useAuth } from '@/hooks/useAuth'

export const useDeleteAccount = () => {
	const { logout } = useAuth()

	return useMutation({
		mutationFn: deleteAccount,
		onSuccess: logout,
		onError: (error) => {
			if (isAxiosError(error)) {
				if (error.response?.status === 404) {
					Toast.show({ type: 'error', text1: '존재하지 않는 계정입니다.' })
				}
			}
		}
	})
}
