import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { UploadImageResponseSchema } from '@/lib/schemas/file'
import { UploadImagePayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const uploadImage = async (
	payload: UploadImagePayload,
	type: 'hosts' | 'events' | 'users'
) => {
	const response = await axiosInstance.post(API_PATH.FILE.BASE, payload, {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		params: {
			type: type
		}
	})
	return validateApiResponse(response.data, UploadImageResponseSchema)
}
