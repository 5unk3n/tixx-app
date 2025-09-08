import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { EventsPaginationResponseSchema } from '@/lib/schemas/events'
import { EventFilter } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getPaginatedEvents = async (filter?: EventFilter) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.BASE, {
		params: filter
	})

	return validateApiResponse(response.data, EventsPaginationResponseSchema)
}
