import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { ClientUserSchema } from '@/lib/schemas/clientUser'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getProfile = async (token?: string) => {
	const response = await axiosInstance.get(
		API_PATH.CLIENT_USER.PROFILE,
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
