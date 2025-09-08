import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventTicketsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEventTickets = async () => {
	const response = await axiosInstance.get(API_PATH.EVENT_TICKETS.USER_TICKETS)
	return validateApiResponse(response.data, EventTicketsResponseSchema)
}
