import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { TicketBaseSchema } from '@/lib/schemas/tickets'
import { ValidateEventTicketPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const validateEventTicket = async (
	payload: ValidateEventTicketPayload
) => {
	const response = await axiosInstance.post(API_PATH.TICKETS.VALIDATE, payload)
	return validateApiResponse(response.data, TicketBaseSchema)
}
