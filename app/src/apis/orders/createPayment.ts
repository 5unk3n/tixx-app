import { API_PATH } from '@/constants/apis'
import { CreatePaymentPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CreatePaymentResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createPayment = async (payload: CreatePaymentPayload) => {
	const response = await axiosInstance.post(API_PATH.ORDERS.PAYMENT, payload)
	return validateApiResponse(response.data, CreatePaymentResponseSchema)
}
