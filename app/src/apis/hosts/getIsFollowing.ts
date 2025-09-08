import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { IsFollowingHostResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getIsFollowing = async (hostId: number) => {
	const response = await axiosInstance.get(API_PATH.HOSTS.IS_FOLLOWING(hostId))
	return validateApiResponse(response.data, IsFollowingHostResponseSchema)
}
