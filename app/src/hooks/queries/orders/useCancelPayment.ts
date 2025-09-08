import { useMutation } from '@tanstack/react-query'

import { cancelPayment } from '@/apis/orders/cancelPayment'
import { queryClient } from '@/utils/queryClient'

export const useCancelPayment = () => {
	return useMutation({
		mutationFn: cancelPayment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		}
	})
}
