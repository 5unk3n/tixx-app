import { useMutation } from '@tanstack/react-query'

import { updateCoupon } from '@/apis/coupons/updateCoupon'
import { queryClient } from '@/lib/queryClient'

export const useUpdateCoupon = () => {
	return useMutation({
		mutationFn: updateCoupon,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['event'] })
		}
	})
}
