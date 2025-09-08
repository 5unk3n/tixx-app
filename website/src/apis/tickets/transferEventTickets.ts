import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { EventTicketBaseSchema } from '@/lib/schemas/tickets'
import { EventTicketsTransferPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const transferEventTickets = async (
	payload: EventTicketsTransferPayload
) => {
	const response = await axiosInstance.post(
		API_PATH.TICKETS.EVENT_TICKET_TRANSFER,
		payload
	)
	return validateApiResponse(response.data, EventTicketBaseSchema)
}
