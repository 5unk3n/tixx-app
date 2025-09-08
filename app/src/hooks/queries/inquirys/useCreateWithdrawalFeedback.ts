import { useMutation } from '@tanstack/react-query'

import { createWithdrawalFeedback } from '@/apis/inquirys/createWithdrawalFeedback'

export const useCreateWithdrawalFeedback = () => {
	return useMutation({
		mutationFn: createWithdrawalFeedback
	})
}
