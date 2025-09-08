import { API_PATH } from '@/constants/apis'
import { EventFilter } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { EventsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEvents = async (filter?: EventFilter) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.BASE, {
		params: filter
	})
	return validateApiResponse(response.data, EventsResponseSchema)
}
