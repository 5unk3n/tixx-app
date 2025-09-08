import { API_PATH } from '@/constants/apis'
import { NearbyEventsParams } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { NearbyEventsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getNearbyEvents = async (params: NearbyEventsParams) => {
	const response = await axiosInstance.get(API_PATH.EVENTS.NEARBY, {
		params
	})
	return validateApiResponse(response.data, NearbyEventsResponseSchema)
}
