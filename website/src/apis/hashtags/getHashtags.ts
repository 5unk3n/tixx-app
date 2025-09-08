import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { HashtagsResponseSchema } from '@/lib/schemas/hashtags'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getHashtags = async () => {
	const response = await axiosInstance.get(API_PATH.EVENTS.HASHTAGS)
	return validateApiResponse(response.data, HashtagsResponseSchema)
}
