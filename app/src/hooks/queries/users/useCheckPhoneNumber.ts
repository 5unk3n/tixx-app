import { useMutation } from '@tanstack/react-query'

import { checkPhoneNumber } from '@/apis/auth/checkPhoneNumber'

export const useCheckPhoneNumber = () => {
	return useMutation({
		mutationFn: (phoneNumber: string) => checkPhoneNumber(phoneNumber)
	})
}
