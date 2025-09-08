import { useMutation } from '@tanstack/react-query'

import { verifyEmailCode } from '@/apis/auth/verifyEmailCode'

export const useVerifyEmailCode = () => {
	return useMutation({
		mutationFn: verifyEmailCode
	})
}
