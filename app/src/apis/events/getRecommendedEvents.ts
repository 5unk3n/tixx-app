import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getRecommendedEvents = async (page?: number, limit?: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.RECOMMENDED, {
		params: { page, limit }
	})

	return validateApiResponse(response.data, EventsResponseSchema)
}
