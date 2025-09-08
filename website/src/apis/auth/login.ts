import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { LoginResponseSchema } from '@/lib/schemas/auth'
import { LoginPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const login = async (payload: LoginPayload) => {
	const response = await axiosInstance.post(
		API_PATH.AUTH.LOGIN_WITH_EMAIL,
		payload
	)
	return validateApiResponse(response.data, LoginResponseSchema)
}
