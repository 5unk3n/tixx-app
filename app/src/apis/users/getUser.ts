import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { UserSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getUser = async () => {
	const response = await axiosInstance.get(API_PATH.USER.PROFILE)
	return validateApiResponse(response.data, UserSchema.getResponse)
}
