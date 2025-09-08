import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { HostsResponseSchema } from '@/lib/schemas/hosts'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getHosts = async () => {
	const response = await axiosInstance.get(API_PATH.HOST.BASE)
	return validateApiResponse(response.data, HostsResponseSchema)
}
