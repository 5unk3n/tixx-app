import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { SignupResponseSchema } from '@/lib/schemas/auth'
import { SignupPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const signup = async (payload: SignupPayload) => {
	const response = await axiosInstance.post(API_PATH.AUTH.SIGNUP, payload)
	return validateApiResponse(response.data, SignupResponseSchema)
}
