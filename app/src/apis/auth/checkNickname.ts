import { API_PATH } from '@/constants/apis'
import { UserCheckProfileInput } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CheckNicknameResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const checkNickname = async ({ nickname }: UserCheckProfileInput) => {
	const response = await axiosInstance.get(API_PATH.AUTH.CHECK_NICKNAME, {
		params: {
			nickname
		}
	})
	return validateApiResponse(response.data, CheckNicknameResponseSchema)
}
