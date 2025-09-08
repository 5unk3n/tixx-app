import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { HostFollowResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const toggleHostFollow = async (hostId: number) => {
	const response = await axiosInstance.post(
		API_PATH.HOSTS.TOGGLE_FOLLOW(hostId)
	)
	return validateApiResponse(response.data, HostFollowResponseSchema)
}
