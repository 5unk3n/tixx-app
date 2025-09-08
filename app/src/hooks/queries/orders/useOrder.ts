import { useQuery } from '@tanstack/react-query'

import { getOrder } from '@/apis/orders/getOrder'

export const useOrder = (orderId: string) => {
	return useQuery({
		queryKey: ['order', orderId],
		queryFn: () => getOrder(orderId)
	})
}
