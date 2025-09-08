import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CreateEventResponseSchema } from '@/lib/schemas/events'
import { CreateEventPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const updateEvent = async (
	eventId: string,
	payload: CreateEventPayload
) => {
	const response = await axiosInstance.patch(
		API_PATH.EVENTS.BASE + `/${eventId}`,
		payload
	)
	return validateApiResponse(response.data, CreateEventResponseSchema)
}
