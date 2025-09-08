import { useMutation } from '@tanstack/react-query'

import { createPayment } from '@/apis/orders/createPayment'

export const useCreatePayment = () => {
	return useMutation({
		mutationFn: createPayment
	})
}
