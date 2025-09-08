import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { InstagramCrawlResponseSchema } from '@/lib/schemas/events'
import { InstagramCrawlRequest } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const instagramCrawl = async (payload: InstagramCrawlRequest) => {
	const response = await axiosInstance.post(
		API_PATH.EVENTS.INSTAGRAM_CRAWL,
		payload
	)
	return validateApiResponse(response.data, InstagramCrawlResponseSchema)
}
