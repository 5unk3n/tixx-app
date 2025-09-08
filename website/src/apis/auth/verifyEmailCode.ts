import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { VerifyEmailCodeResponseSchema } from '@/lib/schemas/auth'
import { VerifyEmailCodePayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const verifyEmailCode = async (payload: VerifyEmailCodePayload) => {
	const response = await axiosInstance.post(
		API_PATH.AUTH.VERIFY_EMAIL_CODE,
		payload
	)
	return validateApiResponse(response.data, VerifyEmailCodeResponseSchema)
}
