import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { deleteAccount } from '@/apis/auth/deleteAccount'
import { useAuth } from '@/hooks/useAuth'

export const useDeleteAccount = () => {
	const { t } = useTranslation()
	const { logout } = useAuth()

	return useMutation({
		mutationFn: deleteAccount,
		onSuccess: logout,
		onError: (error) => {
			if (isAxiosError(error)) {
				if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: t('auth.errors.nonExistentAccount')
					})
				}
			}
		}
	})
}
