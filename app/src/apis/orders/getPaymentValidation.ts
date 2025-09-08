import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { PaymentValidationResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getPaymentValidation = async (params: { paymentId: string }) => {
	const response = await axiosInstance.get(API_PATH.ORDERS.PAYMENT, { params })
	return validateApiResponse(response.data, PaymentValidationResponseSchema)
}
