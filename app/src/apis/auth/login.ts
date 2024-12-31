import { API_PATH } from '@/constants/apis'
import { OAuthProvider } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { LoginResponseSchema } from '@/utils/schemas'

export const loginWithOAuth = async (
	provider: OAuthProvider,
	accessToken: string
) => {
	const response = await axiosInstance.post(API_PATH.AUTH.LOGIN(provider), {
		accessToken
	})
	return LoginResponseSchema.parse(response.data)
}
