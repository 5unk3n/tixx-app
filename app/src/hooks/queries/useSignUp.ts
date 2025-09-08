import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { signUp } from '@/apis/auth/signUp'
import { useAuthStore } from '@/stores/authStore'
import { SignUpInput } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useSignUp = () => {
	const { login } = useAuthStore()
	const { t } = useTranslation()

	return useMutation({
		mutationFn: (data: SignUpInput) => signUp(data),
		onSuccess: async (data) => {
			await login(data.jwt, data.user.provider)
			queryClient.invalidateQueries({ queryKey: ['user'] })
		},
		onError: (error) => {
			if (isAxiosError(error) && error.status === 400) {
				Toast.show({
					type: 'error',
					text1: t('auth.errors.invalidPhoneNumber')
				})
			}
		}
	})
}
