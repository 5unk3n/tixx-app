import { API_PATH } from '@/constants/apis'
import { EventTicketsTransferPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { EventTicketsTransfersResponseSchema } from '@/utils/schemas'

export const transferEventTickets = async (
	data: EventTicketsTransferPayload
) => {
	const response = await axiosInstance.post(
		API_PATH.EVENT_TICKETS.TRANSFER,
		data
	)
	return EventTicketsTransfersResponseSchema.parse(response.data)
}
