import { z } from 'zod'

import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { UserSchema } from '@/utils/schemas'

export const checkPhoneNumber = async (phoneNumber: string) => {
	const response = await axiosInstance.get(API_PATH.USER.BASE, {
		params: {
			phoneNumber
		}
	})

	// FIXME: 스키마 새로 만들기
	return z.union([UserSchema.getResponse, z.string()]).parse(response.data)
}
