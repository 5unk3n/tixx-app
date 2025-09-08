import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { DeleteHostResponseSchema } from '@/lib/schemas/hosts'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const deleteHost = async (id: number) => {
	const response = await axiosInstance.delete(API_PATH.HOST.BASE, {
		params: {
			id
		}
	})
	return validateApiResponse(response.data, DeleteHostResponseSchema)
}
