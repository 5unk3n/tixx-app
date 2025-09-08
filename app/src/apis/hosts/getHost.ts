import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { HostResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getHost = async (hostId: number | string) => {
	const response = await axiosInstance.get(API_PATH.HOSTS.BASE + '/' + hostId)
	return validateApiResponse(response.data, HostResponseSchema)
}
