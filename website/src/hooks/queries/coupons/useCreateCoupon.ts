import { useMutation } from '@tanstack/react-query'

import { createCoupon } from '@/apis/coupons/createCoupon'

export const useCreateCoupon = () => {
	return useMutation({
		mutationFn: createCoupon
	})
}
