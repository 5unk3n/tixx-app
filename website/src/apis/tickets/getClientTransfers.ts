import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { ClientTransfersResponseSchema } from '@/lib/schemas/tickets'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getClientTransfers = async (eventId: number) => {
	const response = await axiosInstance.get(API_PATH.TICKETS.CLIENT_TRANSFERS, {
		params: { eventId }
	})
	return validateApiResponse(response.data, ClientTransfersResponseSchema)
}
