import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { TicketBaseSchema } from '@/lib/schemas/tickets'
import { CreateTicketPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createTicket = async (payload: CreateTicketPayload) => {
	const response = await axiosInstance.post(API_PATH.TICKETS.BASE, payload)
	return validateApiResponse(response.data, TicketBaseSchema)
}
