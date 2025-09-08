import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { EventParticipantsResponseSchema } from '@/lib/schemas/events'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getEventParticipants = async (
	eventId: number,
	params?: { startDate?: string; endDate?: string }
) => {
	const response = await axiosInstance.get(
		API_PATH.EVENTS.PARTICIPANTS(eventId),
		{ params }
	)
	return validateApiResponse(response.data, EventParticipantsResponseSchema)
}
