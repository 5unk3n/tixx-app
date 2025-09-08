import { useMutation } from '@tanstack/react-query'

import { requestEmailCode } from '@/apis/auth/requestEmailCode'

export const useRequestEmailCode = () => {
	return useMutation({
		mutationFn: requestEmailCode
	})
}
