import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { UserSchema } from '@/utils/schemas'

export const getUser = async () => {
	const response = await axiosInstance.get(API_PATH.USER.PROFILE)
	return UserSchema.getResponse.parse(response.data)
}
