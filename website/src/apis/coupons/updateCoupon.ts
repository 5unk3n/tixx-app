import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CouponBaseSchema } from '@/lib/schemas/coupons'
import { UpdateCouponPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const updateCoupon = async (payload: UpdateCouponPayload) => {
	const response = await axiosInstance.patch(API_PATH.COUPONS.BASE, payload)
	return validateApiResponse(response.data, CouponBaseSchema)
}
