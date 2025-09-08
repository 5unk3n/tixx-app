import { useQuery } from '@tanstack/react-query'

import { getOrders } from '@/apis/orders/getOrders'
import { PaymentStatusEnum } from '@/utils/schemas'

export const useOrders = () => {
	return useQuery({
		queryKey: ['orders'],
		queryFn: getOrders,
		select: (data) => {
			return data.filter(
				(order) => order.status !== PaymentStatusEnum.enum.PENDING
			)
		}
	})
}
