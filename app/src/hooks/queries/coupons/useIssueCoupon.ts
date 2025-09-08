import { useMutation } from '@tanstack/react-query'

import { issueCoupon } from '@/apis/coupons/issueCoupon'

export const useIssueCoupon = () => {
	return useMutation({
		mutationFn: issueCoupon
	})
}
