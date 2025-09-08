import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { ClientUserSchema } from '@/lib/schemas/clientUser'
import { UpdatePasswordPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const updatePassword = async (
	payload: UpdatePasswordPayload,
	token?: string
) => {
	const response = await axiosInstance.patch(
		API_PATH.CLIENT_USER.UPDATE_PASSWORD,
		payload,
		token
			? {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			: undefined
	)
	return validateApiResponse(response.data, ClientUserSchema)
}
