import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CreateHostResponseSchema } from '@/lib/schemas/hosts'
import { UpdateHostPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const updateHost = async (payload: UpdateHostPayload) => {
	const response = await axiosInstance.patch(API_PATH.HOST.BASE, payload)
	return validateApiResponse(response.data, CreateHostResponseSchema)
}
