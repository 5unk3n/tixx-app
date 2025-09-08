import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CreatePlaceResponseSchema } from '@/lib/schemas/places'
import { CreatePlacePayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createPlace = async (payload: CreatePlacePayload) => {
	const response = await axiosInstance.post(API_PATH.PLACES.BASE, payload)
	return validateApiResponse(response.data, CreatePlaceResponseSchema)
}
