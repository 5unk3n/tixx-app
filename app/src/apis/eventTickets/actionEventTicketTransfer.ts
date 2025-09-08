import { API_PATH } from '@/constants/apis'
import { EventTicketsActionPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { EventTicketsActionResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const actionEventTicketTransfer = async (
	data: EventTicketsActionPayload,
	action: 'accept' | 'reject' | 'cancel'
) => {
	const actionMap = {
		accept: API_PATH.EVENT_TICKETS.ACCEPT,
		reject: API_PATH.EVENT_TICKETS.REJECT,
		cancel: API_PATH.EVENT_TICKETS.CANCEL
	}

	const response = await axiosInstance.post(actionMap[action], data)
	return validateApiResponse(response.data, EventTicketsActionResponseSchema)
}
