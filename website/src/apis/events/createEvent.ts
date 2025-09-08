import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CreateEventResponseSchema } from '@/lib/schemas/events'
import { CreateEventPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createEvent = async (payload: CreateEventPayload) => {
	const response = await axiosInstance.post(API_PATH.EVENTS.BASE, payload)
	return validateApiResponse(response.data, CreateEventResponseSchema)
}
