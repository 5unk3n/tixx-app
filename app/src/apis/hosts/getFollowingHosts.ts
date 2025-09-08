import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { FollowingHostsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getFollowingHosts = async (params: {
	page: number
	limit: number
}) => {
	const response = await axiosInstance.get(API_PATH.HOSTS.FOLLOWING, {
		params
	})
	return validateApiResponse(response.data, FollowingHostsResponseSchema)
}
