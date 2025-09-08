import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getThisWeekEvents = async (page?: number, limit?: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.THIS_WEEK, {
		params: { page, limit, isActive: false }
	})

	return validateApiResponse(response.data, EventsResponseSchema)
}
