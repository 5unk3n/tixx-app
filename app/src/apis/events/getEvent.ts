import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventResponseSchema } from '@/utils/schemas'

export const getEvent = async (eventId: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.BASE + `/${eventId}`)
	return EventResponseSchema.parse(response.data)
}
