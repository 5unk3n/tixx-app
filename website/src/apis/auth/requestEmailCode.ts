import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { RequestEmailCodeResponseSchema } from '@/lib/schemas/auth'
import { RequestEmailCodePayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const requestEmailCode = async (payload: RequestEmailCodePayload) => {
	const response = await axiosInstance.post(
		API_PATH.AUTH.REQUEST_EMAIL_CODE,
		payload
	)
	return validateApiResponse(response.data, RequestEmailCodeResponseSchema)
}
