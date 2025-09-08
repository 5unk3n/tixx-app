import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { EventsResponseSchema } from '@/lib/schemas/events'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEvents = async (hostId: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.HOST + `/${hostId}`)
	return validateApiResponse(response.data, EventsResponseSchema)
}
