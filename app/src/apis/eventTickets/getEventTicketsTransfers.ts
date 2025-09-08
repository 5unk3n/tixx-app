import { API_PATH } from '@/constants/apis'
import { EventTicketsTransfersParams } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { EventTicketsUserTransfersResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEventTicketsTransfers = async (
	params: EventTicketsTransfersParams
) => {
	const response = await axiosInstance.get(
		API_PATH.EVENT_TICKETS.USER_TRANSFERS,
		{ params: { ...params } }
	)
	return validateApiResponse(
		response.data,
		EventTicketsUserTransfersResponseSchema
	)
}
