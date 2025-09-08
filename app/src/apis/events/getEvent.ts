import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEvent = async (eventId: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.BASE + `/${eventId}`)
	return validateApiResponse(response.data, EventResponseSchema)
}
