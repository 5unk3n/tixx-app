import { API_PATH } from '@/constants/apis'
import { OAuthProvider } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { LoginResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const loginWithOAuth = async (
	provider: OAuthProvider,
	accessToken?: string,
	idToken?: string
) => {
	const response = await axiosInstance.post(API_PATH.AUTH.LOGIN(provider), {
		accessToken,
		idToken
	})
	return validateApiResponse(response.data, LoginResponseSchema)
}
