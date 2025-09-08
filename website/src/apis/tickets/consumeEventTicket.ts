import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { ConsumeEventTicketResponseSchema } from '@/lib/schemas/tickets'
import { ConsumeEventTicketPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const consumeEventTicket = async (
	payload: ConsumeEventTicketPayload
) => {
	const response = await axiosInstance.post(API_PATH.TICKETS.USE, payload)
	return validateApiResponse(response.data, ConsumeEventTicketResponseSchema)
}
