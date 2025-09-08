import { z } from 'zod'

import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { FindPasswordPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const findPassword = async (payload: FindPasswordPayload) => {
	const response = await axiosInstance.patch(
		API_PATH.CLIENT_USER.FIND_PASSWORD,
		payload
	)
	return validateApiResponse(response.data, z.any())
}
