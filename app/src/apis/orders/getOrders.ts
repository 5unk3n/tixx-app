import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { OrdersResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getOrders = async () => {
	const response = await axiosInstance.get(API_PATH.ORDERS.BASE)
	return validateApiResponse(response.data, OrdersResponseSchema)
}
