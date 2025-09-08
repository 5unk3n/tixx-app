import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { RequestPresignedUrlResponseSchema } from '@/lib/schemas/file'
import { RequestPresignedUrlPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const requestPresignedUrl = async (
	payload: RequestPresignedUrlPayload
) => {
	const response = await axiosInstance.post(API_PATH.FILE.BASE, payload)
	return validateApiResponse(response.data, RequestPresignedUrlResponseSchema)
}
