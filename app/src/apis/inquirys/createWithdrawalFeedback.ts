import { API_PATH } from '@/constants/apis'
import { CreateFeedbackPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CreateFeedbackResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createWithdrawalFeedback = async (
	payload: CreateFeedbackPayload
) => {
	const response = await axiosInstance.post(
		API_PATH.INQUIRIES.WITHDRAWAL_FEEDBACK,
		payload
	)
	return validateApiResponse(response.data, CreateFeedbackResponseSchema)
}
