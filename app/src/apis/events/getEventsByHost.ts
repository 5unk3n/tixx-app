import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { EventsByHostResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEventsByHost = async (hostId: number) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.HOST + `/${hostId}`)

	return validateApiResponse(response.data, EventsByHostResponseSchema)
}
