import { API_PATH } from '@/constants/apis'
import { EventTicketsTransferPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { EventTicketsTransfersResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const transferEventTickets = async (
	data: EventTicketsTransferPayload
) => {
	const response = await axiosInstance.post(
		API_PATH.EVENT_TICKETS.TRANSFER,
		data
	)
	return validateApiResponse(response.data, EventTicketsTransfersResponseSchema)
}
