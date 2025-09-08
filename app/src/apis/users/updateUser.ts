import { API_PATH } from '@/constants/apis'
import { UserUpdateInput } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { UserSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const updateUser = async (userUpdateInput: UserUpdateInput) => {
	const response = await axiosInstance.patch(
		API_PATH.USER.BASE,
		userUpdateInput
	)
	return validateApiResponse(response.data, UserSchema.updateResponse)
}
