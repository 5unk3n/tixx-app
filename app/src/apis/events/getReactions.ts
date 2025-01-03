import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventReactionsResponseSchema } from '@/utils/schemas'

export const getReactions = async (eventId: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.REACTIONS(eventId))
	return EventReactionsResponseSchema.parse(response.data)
}
