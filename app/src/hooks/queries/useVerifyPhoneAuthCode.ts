import { useMutation } from '@tanstack/react-query'

import { verifyPhoneAuthCode } from '@/apis/auth/verifyPhoneAuthCode'
import { PhonAuthVerifyInput } from '@/types'

export const useVerifyPhoneAuthCode = () => {
	return useMutation({
		mutationFn: (input: PhonAuthVerifyInput) => verifyPhoneAuthCode(input)
	})
}
