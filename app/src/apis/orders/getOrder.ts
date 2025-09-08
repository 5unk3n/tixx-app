import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { OrderResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getOrder = async (orderId: string) => {
	const response = await axiosInstance.get(`${API_PATH.ORDERS.BASE}/${orderId}`)
	return validateApiResponse(response.data, OrderResponseSchema)
}
