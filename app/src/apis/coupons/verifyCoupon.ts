import { API_PATH } from '@/constants/apis'
import { CouponPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CouponVerifyResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const verifyCoupon = async (payload: CouponPayload) => {
	const response = await axiosInstance.post(API_PATH.COUPONS.VERIFY, payload)
	return validateApiResponse(response.data, CouponVerifyResponseSchema)
}
