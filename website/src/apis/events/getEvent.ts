import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { EventResponseSchema } from '@/lib/schemas/events'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEvent = async (eventId: string) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.BASE + `/${eventId}`)
	return validateApiResponse(response.data, EventResponseSchema)
}
