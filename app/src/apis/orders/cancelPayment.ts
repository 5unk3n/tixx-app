import { API_PATH } from '@/constants/apis'
import { CancelPaymentPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CancelPaymentResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const cancelPayment = async (payload: CancelPaymentPayload) => {
	const response = await axiosInstance.post(
		API_PATH.ORDERS.PAYMENT_CANCEL,
		payload
	)
	return validateApiResponse(response.data, CancelPaymentResponseSchema)
}
