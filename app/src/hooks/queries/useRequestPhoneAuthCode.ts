import { useMutation } from '@tanstack/react-query'

import { requestPhoneAuthCode } from '@/apis/auth/requestPhoneAuthCode'
import { PhonAuthRequestInput } from '@/types'

export const useRequestPhoneAuthCode = () => {
	return useMutation({
		mutationFn: (data: PhonAuthRequestInput) => requestPhoneAuthCode(data)
	})
}
