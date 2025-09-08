import { API_PATH } from '@/constants/apis'
import { CouponPayload } from '@/types'
import axiosInstance from '@/utils/axiosInstance'
import { CouponIssueResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const issueCoupon = async (payload: CouponPayload) => {
	const response = await axiosInstance.post(API_PATH.COUPONS.ISSUE, payload)
	return validateApiResponse(response.data, CouponIssueResponseSchema)
}
