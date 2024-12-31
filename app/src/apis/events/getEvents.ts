import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventsResponseSchema } from '@/utils/schemas'

export const getEvents = async () => {
	const response = await axiosInstance.get(API_PATH.EVENTS.BASE)
	return EventsResponseSchema.parse(response.data)
}
