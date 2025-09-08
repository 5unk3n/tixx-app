import { z } from 'zod'

import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { UserSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const checkPhoneNumber = async (phoneNumber: string) => {
	const response = await axiosInstance.get(API_PATH.USER.BASE, {
		params: {
			phoneNumber
		}
	})

	return validateApiResponse(
		response.data,
		z.union([UserSchema.getResponse, z.string()])
	)
}
