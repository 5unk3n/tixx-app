import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { TicketDetailResponseSchema } from '@/lib/schemas/tickets'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getTicketDetail = async (ticketId: number) => {
	const response = await axiosInstance.get(API_PATH.TICKETS.DETAIL(ticketId))
	return validateApiResponse(response.data, TicketDetailResponseSchema)
}
