import { API_PATH } from '@/constants/apis'
import { SignUpInput } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { LoginResponseSchema } from '@/utils/schemas'

export const signUp = async (signUpInput: SignUpInput) => {
	const response = await axiosInstance.post(API_PATH.AUTH.SIGNUP, signUpInput)
	return LoginResponseSchema.parse(response.data)
}
