import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { CouponBaseSchema } from '@/lib/schemas/coupons'
import { CreateCouponPayload } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createCoupon = async (payload: CreateCouponPayload) => {
	const response = await axiosInstance.post(API_PATH.COUPONS.BASE, payload)
	return validateApiResponse(response.data, CouponBaseSchema)
}
