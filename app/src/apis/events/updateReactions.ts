import { API_PATH } from '@/constants/apis'
import { EventReactionPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'

export const updateReactions = async (
	eventId: number,
	payload: EventReactionPayload
) => {
	await axiosInstance.put(API_PATH.EVENTS.REACTIONS(eventId), payload)
}
