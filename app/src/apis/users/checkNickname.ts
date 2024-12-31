import { API_PATH } from '@/constants/apis'
import { UserCheckProfileInput } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CheckNicknameResponseSchema } from '@/utils/schemas'

export const checkNickname = async ({ nickname }: UserCheckProfileInput) => {
	const response = await axiosInstance.get(API_PATH.USER.NICKNAMES, {
		params: {
			nickname
		}
	})
	return CheckNicknameResponseSchema.parse(response.data)
}
