import qs from 'qs'

import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { NicknameResponseSchema } from '@/lib/schemas/users'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getNicknames = async (phoneNumbers: string[]) => {
	const response = await axiosInstance.get(API_PATH.USER.NICKNAMES, {
		params: { phoneNumbers },
		paramsSerializer: (params) =>
			qs.stringify(params, { arrayFormat: 'repeat' })
	})
	return validateApiResponse(response.data, NicknameResponseSchema)
}
