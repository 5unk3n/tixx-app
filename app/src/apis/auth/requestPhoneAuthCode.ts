import { API_PATH } from '@/constants/apis'
import { PhonAuthRequestInput } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { PhoneAuthCodeResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const requestPhoneAuthCode = async (data: PhonAuthRequestInput) => {
	const response = await axiosInstance.post(
		API_PATH.AUTH.REQUEST_PHONE_AUTH_CODE,
		data
	)
	return validateApiResponse(response.data, PhoneAuthCodeResponseSchema)
}
