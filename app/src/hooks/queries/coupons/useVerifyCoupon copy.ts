import { useMutation } from '@tanstack/react-query'

import { verifyCoupon } from '@/apis/coupons/verifyCoupon'

export const useVerifyCoupon = () => {
	return useMutation({
		mutationFn: verifyCoupon
	})
}
