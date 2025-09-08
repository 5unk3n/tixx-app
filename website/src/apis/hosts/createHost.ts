import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CreateHostResponseSchema } from '@/lib/schemas/hosts'
import { CreateHostPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createHost = async (payload: CreateHostPayload) => {
	const response = await axiosInstance.post(API_PATH.HOST.BASE, payload)
	return validateApiResponse(response.data, CreateHostResponseSchema)
}
