import qs from 'qs'

import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { NicknameResponseSchema } from '@/utils/schemas'

export const getNicknames = async (phoneNumbers: string[]) => {
	const response = await axiosInstance.get(API_PATH.USER.NICKNAMES, {
		params: { phoneNumbers },
		paramsSerializer: (params) =>
			qs.stringify(params, { arrayFormat: 'repeat' })
	})
	// return NicknameResponseSchema.parse(response.data)
	return NicknameResponseSchema.parse(response.data)
}
