import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventTicketsResponseSchema } from '@/utils/schemas'

export const getEventTickets = async () => {
	const response = await axiosInstance.get(API_PATH.EVENT_TICKETS.USER_TICKETS)
	return EventTicketsResponseSchema.parse(response.data)
}
