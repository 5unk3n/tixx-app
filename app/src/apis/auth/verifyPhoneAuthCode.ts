import { API_PATH } from '@/constants/apis'
import { PhonAuthVerifyInput } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { PhoneAuthCodeVerifyResponseSchema } from '@/utils/schemas'

export const verifyPhoneAuthCode = async (input: PhonAuthVerifyInput) => {
	const response = await axiosInstance.post(
		API_PATH.AUTH.VERIFY_PHONE_AUTH_CODE,
		input
	)
	return PhoneAuthCodeVerifyResponseSchema.parse(response.data)
}
