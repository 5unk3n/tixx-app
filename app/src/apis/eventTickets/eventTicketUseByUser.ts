import { API_PATH } from '@/constants/apis'
import { UseEventTicketByUserPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { UseEventTicketByUserResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const eventTicketUseByUser = async (
	payload: UseEventTicketByUserPayload
) => {
	const response = await axiosInstance.post(
		API_PATH.EVENT_TICKETS.USE_TICKET,
		payload
	)
	return validateApiResponse(response.data, UseEventTicketByUserResponseSchema)
}
